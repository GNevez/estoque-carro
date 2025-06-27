-- 🗄️ Script de Configuração do Banco MySQL
-- Execute este script no seu MySQL para criar o banco e as tabelas

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS estoque_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Usar o banco
USE estoque_db;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user' NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_ativo (ativo)
);

-- Criar tabela de carros
CREATE TABLE IF NOT EXISTS carros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  ano INT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  quilometragem INT NOT NULL,
  combustivel ENUM('flex', 'gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico') DEFAULT 'flex' NOT NULL,
  transmissao ENUM('manual', 'automatico', 'cvt') DEFAULT 'manual' NOT NULL,
  cor VARCHAR(30) NOT NULL,
  descricao TEXT,
  caracteristicas JSON,
  imagens JSON,
  usuario_id INT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_marca (marca),
  INDEX idx_modelo (modelo),
  INDEX idx_ano (ano),
  INDEX idx_preco (preco),
  INDEX idx_combustivel (combustivel),
  INDEX idx_transmissao (transmissao),
  INDEX idx_usuario (usuario_id),
  INDEX idx_ativo (ativo),
  INDEX idx_data_cadastro (data_cadastro)
);

-- Inserir usuário administrador padrão
-- Senha: password (criptografada com bcrypt)
INSERT INTO usuarios (nome, email, senha, role) VALUES 
('Administrador', 'admin@estoque.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE id = id;

-- Inserir alguns carros de exemplo
INSERT INTO carros (marca, modelo, ano, preco, quilometragem, combustivel, transmissao, cor, descricao, caracteristicas, imagens, usuario_id) VALUES 
('Honda', 'Civic', 2022, 85000.00, 15000, 'flex', 'automatico', 'Branco', 'Civic em excelente estado, único dono, revisões em dia.', 
 '["Ar Condicionado", "Direção Hidráulica", "Vidros Elétricos", "Airbag", "ABS"]', 
 '["https://example.com/civic1.jpg", "https://example.com/civic2.jpg"]', 1),

('Toyota', 'Corolla', 2021, 78000.00, 22000, 'flex', 'cvt', 'Prata', 'Corolla com baixa quilometragem, muito bem conservado.', 
 '["Ar Condicionado", "GPS", "Câmera de Ré", "Sensores de Estacionamento"]', 
 '["https://example.com/corolla1.jpg"]', 1),

('Volkswagen', 'Golf', 2023, 95000.00, 8000, 'flex', 'automatico', 'Azul', 'Golf zero km, acabamento GTI, esportivo.', 
 '["Ar Condicionado", "Som Premium", "Teto Solar", "Bancos de Couro", "Rodas de Liga"]', 
 '["https://example.com/golf1.jpg"]', 1);

-- Verificar se as tabelas foram criadas
SHOW TABLES;

-- Verificar estrutura das tabelas
DESCRIBE usuarios;
DESCRIBE carros;

-- Verificar dados inseridos
SELECT * FROM usuarios;
SELECT * FROM carros; 