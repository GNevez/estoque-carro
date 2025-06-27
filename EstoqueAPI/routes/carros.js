const express = require("express");
const multer = require("multer");
const CarroController = require("../controllers/CarroController");
const {
  verificarToken,
  verificarTokenOpcional,
} = require("../middleware/auth");

const router = express.Router();

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas"), false);
    }
  },
});

// Simulação de banco de dados em memória (em produção, use um banco real)
let carros = [
  {
    id: 1,
    marca: "Honda",
    modelo: "Civic",
    ano: 2022,
    preco: 85000,
    quilometragem: 15000,
    combustivel: "flex",
    transmissao: "automatico",
    cor: "Branco",
    descricao: "Civic em excelente estado, único dono, revisões em dia.",
    caracteristicas: [
      "Ar Condicionado",
      "Direção Hidráulica",
      "Vidros Elétricos",
      "Airbag",
      "ABS",
    ],
    imagens: [
      "https://example.com/civic1.jpg",
      "https://example.com/civic2.jpg",
    ],
    usuarioId: 1,
    dataCadastro: new Date("2024-01-15"),
  },
  {
    id: 2,
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2021,
    preco: 78000,
    quilometragem: 22000,
    combustivel: "flex",
    transmissao: "cvt",
    cor: "Prata",
    descricao: "Corolla com baixa quilometragem, muito bem conservado.",
    caracteristicas: [
      "Ar Condicionado",
      "GPS",
      "Câmera de Ré",
      "Sensores de Estacionamento",
    ],
    imagens: ["https://example.com/corolla1.jpg"],
    usuarioId: 1,
    dataCadastro: new Date("2024-01-20"),
  },
];

// Rota para adicionar carro (requer autenticação)
router.post(
  "/",
  verificarToken,
  upload.array("imagens", 10),
  CarroController.adicionar
);

// Rota para listar todos os carros (pública)
router.get("/", verificarTokenOpcional, CarroController.listar);

// Rota para obter um carro específico por ID (pública)
router.get("/:id", verificarTokenOpcional, CarroController.obterPorId);

// Rota para listar carros do usuário logado (requer token)
router.get(
  "/usuario/meus-carros",
  verificarToken,
  CarroController.listarPorUsuario
);

// Rota para estatísticas dos carros (pública)
router.get("/estatisticas/geral", CarroController.estatisticas);

// Rota para atualizar um carro (requer token, apenas dono)
router.put(
  "/:id",
  verificarToken,
  upload.array("imagens", 10),
  CarroController.atualizar
);

// Rota para deletar um carro (requer token, apenas dono)
router.delete("/:id", verificarToken, CarroController.deletar);

module.exports = router;
