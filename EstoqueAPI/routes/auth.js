const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verificarToken } = require("../middleware/auth");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

// Rota de cadastro
router.post("/cadastro", AuthController.cadastrar);

// Rota de login
router.post("/login", AuthController.login);

// Rota de logout (requer token)
router.post("/logout", verificarToken, AuthController.logout);

// Rota para verificar se o token é válido (requer token)
router.get("/verificar", verificarToken, AuthController.verificarToken);

// Rota para obter perfil do usuário (requer token)
router.get("/perfil", verificarToken, AuthController.obterPerfil);

// Rota para atualizar perfil do usuário (requer token)
router.put("/perfil", verificarToken, AuthController.atualizarPerfil);

// Rota para alterar senha (requer token)
router.put("/alterar-senha", verificarToken, AuthController.alterarSenha);

module.exports = router;
