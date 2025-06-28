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
