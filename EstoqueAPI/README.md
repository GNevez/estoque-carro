# 🚗 API do Sistema de Estoque de Carros - MVC + MySQL

API RESTful para gerenciamento de estoque de veículos com arquitetura MVC, MySQL e autenticação JWT.

## 🏗️ Arquitetura

- **MVC (Model-View-Controller)**: Separação clara de responsabilidades
- **MySQL**: Banco de dados relacional
- **Sequelize ORM**: Mapeamento objeto-relacional
- **JWT**: Autenticação segura
- **Express.js**: Framework web

## 📋 Funcionalidades

- ✅ Autenticação com JWT
- ✅ Cadastro e login de usuários
- ✅ Adicionar veículos ao estoque
- ✅ Listar veículos com filtros avançados
- ✅ Upload de imagens
- ✅ Gerenciamento de veículos por usuário
- ✅ Validação de permissões
- ✅ Soft delete
- ✅ Estatísticas dos veículos
- ✅ Paginação e ordenação

## 🚀 Instalação

### 1. Pré-requisitos

- Node.js (v14+)
- MySQL (v8.0+)
- npm ou yarn

### 2. Configurar Banco MySQL

```bash
# Acesse o MySQL
mysql -u root -p

# Execute o script de setup
source database-setup.sql
```

Ou execute manualmente:

```sql
CREATE DATABASE estoque_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Instalar Dependências

```bash
cd EstoqueAPI
npm install
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_jwt_muito_segura_2024
JWT_EXPIRES_IN=24h

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads

# CORS
CORS_ORIGIN=http://localhost:5173

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=estoque_db
DB_USER=root
DB_PASSWORD=sua_senha_mysql
```

### 5. Criar Pasta de Uploads

```bash
mkdir uploads
```

### 6. Iniciar o Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📁 Estrutura do Projeto

```
EstoqueAPI/
├── config/
│   ├── database.js      # Configuração do MySQL
│   └── config.js        # Configurações gerais
├── controllers/
│   ├── AuthController.js # Lógica de autenticação
│   └── CarroController.js # Lógica de veículos
├── middleware/
│   └── auth.js          # Middleware JWT
├── models/
│   ├── Usuario.js       # Modelo de usuário
│   └── Carro.js         # Modelo de veículo
├── routes/
│   ├── auth.js          # Rotas de autenticação
│   └── carros.js        # Rotas de veículos
├── uploads/             # Pasta de uploads
├── database-setup.sql   # Script do banco
├── testes-api.md        # Exemplos de testes
├── server.js            # Servidor principal
└── package.json
```

## 📡 Endpoints da API

### 🔐 Autenticação

| Método | Endpoint                  | Descrição         | Auth |
| ------ | ------------------------- | ----------------- | ---- |
| POST   | `/api/auth/cadastro`      | Cadastrar usuário | ❌   |
| POST   | `/api/auth/login`         | Fazer login       | ❌   |
| POST   | `/api/auth/logout`        | Fazer logout      | ✅   |
| GET    | `/api/auth/verificar`     | Verificar token   | ✅   |
| GET    | `/api/auth/perfil`        | Obter perfil      | ✅   |
| PUT    | `/api/auth/perfil`        | Atualizar perfil  | ✅   |
| PUT    | `/api/auth/alterar-senha` | Alterar senha     | ✅   |

### 🚗 Veículos

| Método | Endpoint                          | Descrição       | Auth |
| ------ | --------------------------------- | --------------- | ---- |
| POST   | `/api/carros`                     | Adicionar carro | ✅   |
| GET    | `/api/carros`                     | Listar carros   | ❌   |
| GET    | `/api/carros/:id`                 | Buscar carro    | ❌   |
| GET    | `/api/carros/usuario/meus-carros` | Meus carros     | ✅   |
| GET    | `/api/carros/estatisticas/geral`  | Estatísticas    | ❌   |
| PUT    | `/api/carros/:id`                 | Atualizar carro | ✅   |
| DELETE | `/api/carros/:id`                 | Deletar carro   | ✅   |

## 🧪 Testando a API

### Usuário de Teste

```
Email: admin@estoque.com
Senha: password
```

### Exemplos de Teste

#### 1. Cadastrar Usuário

```bash
curl -X POST http://localhost:3001/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

#### 2. Fazer Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

#### 3. Adicionar Carro

```bash
curl -X POST http://localhost:3001/api/carros \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "marca=Honda" \
  -F "modelo=Civic" \
  -F "ano=2022" \
  -F "preco=85000" \
  -F "quilometragem=15000" \
  -F "combustivel=flex" \
  -F "transmissao=automatico" \
  -F "cor=Branco"
```

#### 4. Listar Carros

```bash
curl -X GET "http://localhost:3001/api/carros?marca=Honda&anoMin=2020"
```

**📖 Veja mais exemplos em: `testes-api.md`**

## 🔧 Configuração de Autenticação

Para endpoints protegidos, inclua o token JWT no header:

```
Authorization: Bearer seu_token_jwt_aqui
```

## 🗄️ Banco de Dados

### Tabelas Principais

#### usuarios

- `id` (PK)
- `nome`
- `email` (UNIQUE)
- `senha` (criptografada)
- `role` (admin/user)
- `ativo`
- `data_criacao`
- `data_atualizacao`

#### carros

- `id` (PK)
- `marca`
- `modelo`
- `ano`
- `preco`
- `quilometragem`
- `combustivel`
- `transmissao`
- `cor`
- `descricao`
- `caracteristicas` (JSON)
- `imagens` (JSON)
- `usuario_id` (FK)
- `ativo`
- `data_cadastro`
- `data_atualizacao`

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados
- **Sequelize** - ORM
- **JWT** - Autenticação
- **bcryptjs** - Criptografia
- **multer** - Upload de arquivos
- **cors** - Cross-Origin Resource Sharing

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT com expiração
- Validação de permissões por usuário
- Validação de tipos de arquivo
- Limite de tamanho de arquivo
- Soft delete para preservar dados
- Sanitização de inputs

## 📊 Funcionalidades Avançadas

- **Filtros**: Por marca, modelo, ano, preço, combustível, etc.
- **Paginação**: Controle de limite e offset
- **Ordenação**: Por data, preço, ano, etc.
- **Estatísticas**: Total de carros, preço médio, carros por marca
- **Upload múltiplo**: Até 10 imagens por carro
- **Relacionamentos**: Carros vinculados aos usuários

## 🚨 Tratamento de Erros

- Validação de dados de entrada
- Mensagens de erro em português
- Códigos de status HTTP apropriados
- Logs detalhados em desenvolvimento
- Tratamento de erros de upload

## 📝 Notas de Produção

- Configure HTTPS
- Use variáveis de ambiente seguras
- Implemente rate limiting
- Configure backup do banco
- Monitore logs e performance
- Use PM2 ou similar para gerenciar processos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.
