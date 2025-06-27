# 🧪 Testes da API - Exemplos cURL para Postman

## 📋 Configuração Base

- **Base URL**: `http://localhost:3001`
- **Content-Type**: `application/json`

---

## 🔐 Autenticação

### 1. Cadastrar Usuário

```bash
curl -X POST http://localhost:3001/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

### 3. Verificar Token

```bash
curl -X GET http://localhost:3001/api/auth/verificar \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 4. Obter Perfil

```bash
curl -X GET http://localhost:3001/api/auth/perfil \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 5. Atualizar Perfil

```bash
curl -X PUT http://localhost:3001/api/auth/perfil \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "João Silva Atualizado",
    "email": "joao.novo@email.com"
  }'
```

### 6. Alterar Senha

```bash
curl -X PUT http://localhost:3001/api/auth/alterar-senha \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "senhaAtual": "123456",
    "novaSenha": "654321"
  }'
```

### 7. Logout

```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🚗 Veículos

### 8. Adicionar Carro (com imagens)

```bash
curl -X POST http://localhost:3001/api/carros \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -F "marca=Honda" \
  -F "modelo=Civic" \
  -F "ano=2022" \
  -F "preco=85000" \
  -F "quilometragem=15000" \
  -F "combustivel=flex" \
  -F "transmissao=automatico" \
  -F "cor=Branco" \
  -F "descricao=Civic em excelente estado, único dono" \
  -F "caracteristicas=[\"Ar Condicionado\", \"Direção Hidráulica\", \"Vidros Elétricos\"]" \
  -F "imagens=@/caminho/para/imagem1.jpg" \
  -F "imagens=@/caminho/para/imagem2.jpg"
```

### 9. Adicionar Carro (sem imagens)

```bash
curl -X POST http://localhost:3001/api/carros \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "marca": "Toyota",
    "modelo": "Corolla",
    "ano": 2021,
    "preco": 78000,
    "quilometragem": 22000,
    "combustivel": "flex",
    "transmissao": "cvt",
    "cor": "Prata",
    "descricao": "Corolla com baixa quilometragem",
    "caracteristicas": ["Ar Condicionado", "GPS", "Câmera de Ré"]
  }'
```

### 10. Listar Todos os Carros

```bash
curl -X GET "http://localhost:3001/api/carros"
```

### 11. Listar Carros com Filtros

```bash
curl -X GET "http://localhost:3001/api/carros?marca=Honda&anoMin=2020&precoMax=90000&limit=10&offset=0"
```

### 12. Buscar Carro por ID

```bash
curl -X GET http://localhost:3001/api/carros/1
```

### 13. Listar Carros do Usuário Logado

```bash
curl -X GET http://localhost:3001/api/carros/usuario/meus-carros \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 14. Atualizar Carro

```bash
curl -X PUT http://localhost:3001/api/carros/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "preco": 82000,
    "descricao": "Preço atualizado - Civic em excelente estado"
  }'
```

### 15. Deletar Carro

```bash
curl -X DELETE http://localhost:3001/api/carros/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 16. Estatísticas dos Carros

```bash
curl -X GET http://localhost:3001/api/carros/estatisticas/geral
```

---

## 📊 Exemplos de Respostas

### Resposta de Login (Sucesso)

```json
{
  "message": "Login realizado com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "user",
    "ativo": true,
    "data_criacao": "2024-01-15T10:30:00.000Z",
    "data_atualizacao": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Resposta de Listagem de Carros

```json
{
  "carros": [
    {
      "id": 1,
      "marca": "Honda",
      "modelo": "Civic",
      "ano": 2022,
      "preco": "85000.00",
      "quilometragem": 15000,
      "combustivel": "flex",
      "transmissao": "automatico",
      "cor": "Branco",
      "descricao": "Civic em excelente estado",
      "caracteristicas": ["Ar Condicionado", "Direção Hidráulica"],
      "imagens": ["/uploads/imagem1.jpg"],
      "ativo": true,
      "data_cadastro": "2024-01-15T10:30:00.000Z",
      "usuario": {
        "id": 1,
        "nome": "João Silva",
        "email": "joao@email.com"
      }
    }
  ],
  "total": 1,
  "limit": 20,
  "offset": 0,
  "paginas": 1
}
```

---

## 🚨 Exemplos de Erros

### Erro de Autenticação

```json
{
  "error": "Acesso negado. Token não fornecido."
}
```

### Erro de Validação

```json
{
  "error": "Todos os campos obrigatórios devem ser preenchidos"
}
```

### Erro de Permissão

```json
{
  "error": "Você não tem permissão para editar este carro"
}
```

---

## 📝 Notas para Postman

1. **Para endpoints com upload de arquivos**: Use `form-data` em vez de `raw JSON`
2. **Para headers de autorização**: Adicione `Authorization: Bearer SEU_TOKEN`
3. **Para variáveis**: Use `{{base_url}}` e `{{token}}` no Postman
4. **Para testes**: Configure variáveis de ambiente no Postman

### Variáveis de Ambiente Sugeridas

```
base_url: http://localhost:3001
token: (será preenchido após login)
```

### Script de Teste para Login (Postman)

```javascript
// Test script para salvar token automaticamente
pm.test("Login successful", function () {
  pm.response.to.have.status(200);

  var jsonData = pm.response.json();
  if (jsonData.token) {
    pm.environment.set("token", jsonData.token);
  }
});
```
