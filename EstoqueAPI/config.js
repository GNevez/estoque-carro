require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",

  JWT_SECRET:
    process.env.JWT_SECRET || "sua_chave_secreta_jwt_muito_segura_2024",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",

  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || "uploads",

  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  DB: {
    HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.DB_PORT || 3306,
    NAME: process.env.DB_NAME || "estoque_db",
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "",
    DIALECT: "mysql",
  },
};
