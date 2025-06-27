const jwt = require("jsonwebtoken");
const config = require("../config");

// Middleware para verificar se o usuário está autenticado
const verificarToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      error: "Acesso negado. Token não fornecido.",
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error("❌ Token inválido:", error.message);
    return res.status(401).json({
      error: "Token inválido ou expirado.",
    });
  }
};

// Middleware opcional para verificar token (não bloqueia se não houver token)
const verificarTokenOpcional = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.usuario = decoded;
    } catch (error) {
      // Token inválido, mas não bloqueia a requisição
      req.usuario = null;
    }
  }

  next();
};

module.exports = {
  verificarToken,
  verificarTokenOpcional,
};
