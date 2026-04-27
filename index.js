require("dotenv").config(); // carrega as variáveis do .env

const express = require("express");
const app = express();

const conn = require("./db/conn");

// Rotas
const UserRoutes = require("./routes/UserRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
const OrderRoutes = require("./routes/OrderRoutes");

// Importa os relacionamentos entre os models
const Associations = require("./models/Associations");

// Permite receber dados via formulário e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Registra as rotas
app.use("/users", UserRoutes);
app.use("/products", ProductRoutes);
app.use("/orders", OrderRoutes);

// Sincroniza o banco e inicia o servidor
conn
  .sync()
  .then(() => {
    app.listen(3000);
    console.log("Servidor rodando na porta 3000");
  })
  .catch((err) => {
    console.log(err);
  });