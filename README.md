# API Shop

API RESTful de e-commerce desenvolvida como projeto pessoal. Permite o gerenciamento de usuários, produtos e pedidos com autenticação JWT e controle de acesso por perfil (admin/user).

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white)

---

## Tecnologias

- **Node.js** — ambiente de execução
- **Express** — framework para criação das rotas
- **Sequelize** — ORM para comunicação com o banco de dados
- **MySQL** — banco de dados relacional
- **JWT (jsonwebtoken)** — autenticação via token
- **Bcrypt** — criptografia de senhas
- **Zod** — validação de dados
- **Dotenv** — variáveis de ambiente
- **Nodemon** — reinicialização automática do servidor em desenvolvimento
- **Postman** — ferramenta para teste das rotas

---

## Arquitetura

O projeto segue arquitetura em camadas (Routes → Controllers → Models):

```
src/
├── controllers/     # lógica de negócio
├── models/          # definição das tabelas
├── routes/          # definição das rotas
├── middlewares/     # autenticação e autorização
├── schemas/         # validação com Zod
├── db/              # conexão com o banco
└── index.js         # entrada da aplicação
```

---

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- MySQL instalado (XAMPP ou similar)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/DeyvidNunes/ecommerce_api.git

# Entre na pasta
cd api-shop

# Instale as dependências
npm install
```

### Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```
JWT_SECRET=sua_chave_secreta
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=projeto
```

### Rodando o projeto

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

O servidor irá rodar em `http://localhost:3000`

---

## Autenticação

As rotas protegidas exigem um token JWT no header da requisição:

```
Authorization: Bearer <token>
```

O token é gerado ao fazer login em `POST /users/login`.

---

## Rotas

### Usuários `/users`

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/users/add` | Cadastrar usuário | ❌ |
| POST | `/users/login` | Login e geração do token | ❌ |
| PUT | `/users/update` | Atualizar próprio cadastro | ✅ |
| DELETE | `/users/` | Deletar própria conta | ✅ |
| GET | `/users/` | Listar todos os usuários | ✅ Admin |

### Produtos `/products`

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/products` | Listar produtos (suporta paginação: `?page=1&limit=10`) | ❌ |
| GET | `/products/search` | Filtrar por nome e/ou preço (busca parcial) | ❌ |
| GET | `/products/:id` | Buscar produto por ID | ❌ |
| POST | `/products/add` | Criar produto | ✅ Admin |
| PUT | `/products/:id` | Atualizar produto | ✅ Admin |
| DELETE | `/products/:id` | Deletar produto | ✅ Admin |

### Pedidos `/orders`

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/orders` | Criar pedido com itens | ✅ |
| GET | `/orders` | Listar meus pedidos | ✅ |
| GET | `/orders/all` | Listar todos os pedidos (suporta paginação: `?page=1&limit=10`) | ✅ Admin |
| PATCH | `/orders/:id` | Atualizar status do pedido | ✅ |
| DELETE | `/orders/:id` | Deletar pedido | ✅ |

---

## Exemplos de requisição

### Criar usuário
```json
POST /users/add
{
  "name": "Deyvid",
  "email": "deyvid@email.com",
  "password": "123456",
  "role": "user"
}
```

### Login
```json
POST /users/login
{
  "email": "deyvid@email.com",
  "password": "123456"
}
```

### Criar pedido
```json
POST /orders
Authorization: Bearer <token>

{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

### Filtrar produtos
```
GET /products/search?name=cadeira
GET /products/search?minPrice=10&maxPrice=100
GET /products/search?name=cadeira&minPrice=10&maxPrice=100
```

### Listar produtos com paginação
```
GET /products?page=1&limit=10
```

---

## Modelo de dados

```
User
 └── hasMany Order

Order
 └── hasMany OrderItem

Product
 └── hasMany OrderItem

OrderItem
 ├── belongsTo Order
 └── belongsTo Product
```

---

## Autor

Desenvolvido por **Deyvid Nunes** — [github.com/DeyvidNunes](https://github.com/DeyvidNunes)