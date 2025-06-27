const { Op } = require("sequelize");
const { Carro, Usuario } = require("../models");

class CarroController {
  // Adicionar novo carro
  static async adicionar(req, res) {
    try {
      const {
        marca,
        modelo,
        ano,
        preco,
        quilometragem,
        combustivel,
        transmissao,
        cor,
        descricao,
        caracteristicas,
      } = req.body;

      // Validações básicas
      if (
        !marca ||
        !modelo ||
        !ano ||
        !preco ||
        !quilometragem ||
        !combustivel ||
        !transmissao ||
        !cor
      ) {
        return res.status(400).json({
          error: "Todos os campos obrigatórios devem ser preenchidos",
        });
      }

      // Processar imagens
      const imagens = req.files
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      // Processar características (se vier como string, converter para array)
      let caracteristicasArray = [];
      if (caracteristicas) {
        caracteristicasArray =
          typeof caracteristicas === "string"
            ? JSON.parse(caracteristicas)
            : caracteristicas;
      }

      // Criar novo carro
      const novoCarro = await Carro.create({
        marca,
        modelo,
        ano: parseInt(ano),
        preco: parseFloat(preco),
        quilometragem: parseInt(quilometragem),
        combustivel,
        transmissao,
        cor,
        descricao: descricao || "",
        caracteristicas: caracteristicasArray,
        imagens,
        usuario_id: req.usuario.id,
      });

      // Buscar carro com dados do usuário
      const carroCompleto = await Carro.findByPk(novoCarro.id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email"],
          },
        ],
      });

      res.status(201).json({
        message: "Carro adicionado com sucesso",
        carro: carroCompleto,
      });
    } catch (error) {
      console.error("Erro ao adicionar carro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Listar todos os carros com filtros
  static async listar(req, res) {
    try {
      const {
        marca,
        modelo,
        anoMin,
        anoMax,
        precoMin,
        precoMax,
        combustivel,
        transmissao,
        cor,
        limit = 20,
        offset = 0,
        ordenar = "data_cadastro",
        direcao = "DESC",
      } = req.query;

      // Construir condições de filtro
      const where = { ativo: true };
      const order = [[ordenar, direcao.toUpperCase()]];

      if (marca) {
        where.marca = { [Op.like]: `%${marca}%` };
      }

      if (modelo) {
        where.modelo = { [Op.like]: `%${modelo}%` };
      }

      if (anoMin || anoMax) {
        where.ano = {};
        if (anoMin) where.ano[Op.gte] = parseInt(anoMin);
        if (anoMax) where.ano[Op.lte] = parseInt(anoMax);
      }

      if (precoMin || precoMax) {
        where.preco = {};
        if (precoMin) where.preco[Op.gte] = parseFloat(precoMin);
        if (precoMax) where.preco[Op.lte] = parseFloat(precoMax);
      }

      if (combustivel) {
        where.combustivel = combustivel;
      }

      if (transmissao) {
        where.transmissao = transmissao;
      }

      if (cor) {
        where.cor = { [Op.like]: `%${cor}%` };
      }

      // Buscar carros
      const { count, rows: carros } = await Carro.findAndCountAll({
        where,
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email"],
          },
        ],
        order,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        carros,
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
        paginas: Math.ceil(count / parseInt(limit)),
      });
    } catch (error) {
      console.error("Erro ao listar carros:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Obter carro específico por ID
  static async obterPorId(req, res) {
    try {
      const carroId = parseInt(req.params.id);
      const carro = await Carro.findOne({
        where: { id: carroId, ativo: true },
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email"],
          },
        ],
      });

      if (!carro) {
        return res.status(404).json({
          error: "Carro não encontrado",
        });
      }

      res.json({
        carro,
      });
    } catch (error) {
      console.error("Erro ao buscar carro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Listar carros do usuário logado
  static async listarPorUsuario(req, res) {
    try {
      const carros = await Carro.findAll({
        where: {
          usuario_id: req.usuario.id,
          ativo: true,
        },
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email"],
          },
        ],
        order: [["data_cadastro", "DESC"]],
      });

      res.json({
        carros,
        total: carros.length,
      });
    } catch (error) {
      console.error("Erro ao listar carros do usuário:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Atualizar carro
  static async atualizar(req, res) {
    try {
      const carroId = parseInt(req.params.id);
      const carro = await Carro.findByPk(carroId);

      if (!carro) {
        return res.status(404).json({
          error: "Carro não encontrado",
        });
      }

      // Verificar se o usuário é o dono do carro
      if (carro.usuario_id !== req.usuario.id && req.usuario.role !== "admin") {
        return res.status(403).json({
          error: "Você não tem permissão para editar este carro",
        });
      }

      const {
        marca,
        modelo,
        ano,
        preco,
        quilometragem,
        combustivel,
        transmissao,
        cor,
        descricao,
        caracteristicas,
      } = req.body;

      // Processar imagens
      const novasImagens = req.files
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];
      const imagens = novasImagens.length > 0 ? novasImagens : carro.imagens;

      // Processar características
      let caracteristicasArray = carro.caracteristicas;
      if (caracteristicas) {
        caracteristicasArray =
          typeof caracteristicas === "string"
            ? JSON.parse(caracteristicas)
            : caracteristicas;
      }

      // Atualizar carro
      await carro.update({
        marca: marca || carro.marca,
        modelo: modelo || carro.modelo,
        ano: ano ? parseInt(ano) : carro.ano,
        preco: preco ? parseFloat(preco) : carro.preco,
        quilometragem: quilometragem
          ? parseInt(quilometragem)
          : carro.quilometragem,
        combustivel: combustivel || carro.combustivel,
        transmissao: transmissao || carro.transmissao,
        cor: cor || carro.cor,
        descricao: descricao || carro.descricao,
        caracteristicas: caracteristicasArray,
        imagens,
      });

      // Buscar carro atualizado com dados do usuário
      const carroAtualizado = await Carro.findByPk(carroId, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email"],
          },
        ],
      });

      res.json({
        message: "Carro atualizado com sucesso",
        carro: carroAtualizado,
      });
    } catch (error) {
      console.error("Erro ao atualizar carro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Deletar carro (soft delete)
  static async deletar(req, res) {
    try {
      const carroId = parseInt(req.params.id);
      const carro = await Carro.findByPk(carroId);

      if (!carro) {
        return res.status(404).json({
          error: "Carro não encontrado",
        });
      }

      // Verificar se o usuário é o dono do carro
      if (carro.usuario_id !== req.usuario.id && req.usuario.role !== "admin") {
        return res.status(403).json({
          error: "Você não tem permissão para deletar este carro",
        });
      }

      // Soft delete - marcar como inativo
      await carro.update({ ativo: false });

      res.json({
        message: "Carro deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar carro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  // Estatísticas dos carros
  static async estatisticas(req, res) {
    try {
      const totalCarros = await Carro.count({ where: { ativo: true } });
      const carrosPorMarca = await Carro.findAll({
        where: { ativo: true },
        attributes: [
          "marca",
          [Carro.sequelize.fn("COUNT", Carro.sequelize.col("id")), "total"],
        ],
        group: ["marca"],
        order: [
          [Carro.sequelize.fn("COUNT", Carro.sequelize.col("id")), "DESC"],
        ],
      });

      const precoMedio = await Carro.findOne({
        where: { ativo: true },
        attributes: [
          [
            Carro.sequelize.fn("AVG", Carro.sequelize.col("preco")),
            "preco_medio",
          ],
        ],
      });

      res.json({
        total_carros: totalCarros,
        carros_por_marca: carrosPorMarca,
        preco_medio: parseFloat(
          precoMedio?.dataValues?.preco_medio || 0
        ).toFixed(2),
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

module.exports = CarroController;
