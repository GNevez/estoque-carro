const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const config = require("../config");

class AuthController {
  // Cadastrar novo usuário
  static async cadastrar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      // Validações básicas
      if (!nome || !email || !senha) {
        return res.status(400).json({
          error: "Todos os campos são obrigatórios",
        });
      }

      if (senha.length < 6) {
        return res.status(400).json({
          error: "A senha deve ter pelo menos 6 caracteres",
        });
      }

      // Verificar se o email já existe
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({
          error: "Este email já está cadastrado",
        });
      }

      // Criar novo usuário
      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha,
        role: "user",
      });

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: novoUsuario.id,
          email: novoUsuario.email,
          role: novoUsuario.role,
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        message: "Usuário cadastrado com sucesso",
        usuario: novoUsuario,
        token,
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);

      // Tratar erros de validação do Sequelize
      if (error.name === "SequelizeValidationError") {
        const validationErrors = error.errors.map((err) => {
          // Mapear erros específicos para mensagens mais amigáveis
          if (err.validatorKey === "isEmail") {
            return "Formato de email inválido";
          }
          if (err.validatorKey === "len") {
            if (err.path === "nome") {
              return "Nome deve ter entre 2 e 100 caracteres";
            }
            if (err.path === "senha") {
              return "Senha deve ter pelo menos 6 caracteres";
            }
          }
          if (err.validatorKey === "notEmpty") {
            return `${
              err.path.charAt(0).toUpperCase() + err.path.slice(1)
            } é obrigatório`;
          }
          return err.message;
        });

        return res.status(400).json({
          error: validationErrors[0] || "Dados inválidos",
        });
      }

      // Tratar erro de email duplicado
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          error: "Este email já está cadastrado",
        });
      }

      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Fazer login
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Validações básicas
      if (!email || !senha) {
        return res.status(400).json({
          error: "Email e senha são obrigatórios",
        });
      }

      // Buscar usuário
      const usuario = await Usuario.findOne({ where: { email, ativo: true } });
      if (!usuario) {
        return res.status(401).json({
          error: "Email ou senha inválidos",
        });
      }

      // Verificar senha
      const senhaValida = await usuario.verificarSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({
          error: "Email ou senha inválidos",
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          role: usuario.role,
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      res.json({
        message: "Login realizado com sucesso",
        usuario,
        token,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Fazer logout
  static async logout(req, res) {
    try {
      // Em uma implementação real, você poderia adicionar o token a uma blacklist
      res.json({
        message: "Logout realizado com sucesso",
      });
    } catch (error) {
      console.error("Erro no logout:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Verificar token
  static async verificarToken(req, res) {
    try {
      res.json({
        message: "Token válido",
        usuario: req.usuario,
      });
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Obter perfil do usuário
  static async obterPerfil(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id);

      if (!usuario) {
        return res.status(404).json({
          error: "Usuário não encontrado",
        });
      }

      res.json({
        usuario,
      });
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Atualizar perfil do usuário
  static async atualizarPerfil(req, res) {
    try {
      const { nome, email } = req.body;
      const usuario = await Usuario.findByPk(req.usuario.id);

      if (!usuario) {
        return res.status(404).json({
          error: "Usuário não encontrado",
        });
      }

      // Verificar se o email já existe (se foi alterado)
      if (email && email !== usuario.email) {
        const emailExistente = await Usuario.findOne({ where: { email } });
        if (emailExistente) {
          return res.status(400).json({
            error: "Este email já está em uso",
          });
        }
      }

      // Atualizar dados
      await usuario.update({
        nome: nome || usuario.nome,
        email: email || usuario.email,
      });

      res.json({
        message: "Perfil atualizado com sucesso",
        usuario,
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Alterar senha
  static async alterarSenha(req, res) {
    try {
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
          error: "Senha atual e nova senha são obrigatórias",
        });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({
          error: "A nova senha deve ter pelo menos 6 caracteres",
        });
      }

      const usuario = await Usuario.findByPk(req.usuario.id);

      if (!usuario) {
        return res.status(404).json({
          error: "Usuário não encontrado",
        });
      }

      // Verificar senha atual
      const senhaValida = await usuario.verificarSenha(senhaAtual);
      if (!senhaValida) {
        return res.status(401).json({
          error: "Senha atual incorreta",
        });
      }

      // Atualizar senha
      await usuario.update({ senha: novaSenha });

      res.json({
        message: "Senha alterada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

module.exports = AuthController;
