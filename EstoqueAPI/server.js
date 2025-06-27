const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config");
const { testarConexao, sincronizarBanco } = require("./config/database");

// Importar modelos para garantir que os relacionamentos sejam definidos
require("./models");

const app = express();
const PORT = config.PORT;

// Middleware
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Importar rotas
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/carros");

// Usar rotas
app.use("/api/auth", authRoutes);
app.use("/api/carros", carRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "API do Sistema de Estoque de Carros",
    version: "2.0.0",
    status: "online",
    database: "MySQL",
    architecture: "MVC",
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Erro específico do Multer
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "Arquivo muito grande. Tamanho máximo: 10MB",
    });
  }

  if (err.message === "Apenas imagens são permitidas") {
    return res.status(400).json({
      error: "Apenas arquivos de imagem são permitidos",
    });
  }

  res.status(500).json({
    error: "Erro interno do servidor",
    message: config.NODE_ENV === "development" ? err.message : "Erro interno",
  });
});

// Rota para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.originalUrl,
  });
});

// Inicializar servidor
const inicializarServidor = async () => {
  try {
    // Testar conexão com banco
    await testarConexao();

    // Sincronizar modelos
    await sincronizarBanco();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log("🚀 Servidor iniciado com sucesso!");
      console.log(`📡 API disponível em: http://localhost:${PORT}`);
      console.log(`🗄️  Banco de dados: MySQL`);
      console.log(`🏗️  Arquitetura: MVC`);
      console.log(`🌍 Ambiente: ${config.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Erro ao inicializar servidor:", error);
    process.exit(1);
  }
};

// Inicializar servidor
inicializarServidor();
