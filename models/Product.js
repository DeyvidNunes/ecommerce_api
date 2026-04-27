const { DataTypes } = require("sequelize");
const db = require("../db/conn");

// Model de produto — armazena os produtos disponíveis para compra
const Product = db.define("Product", {
  // Nome do produto
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Descrição opcional do produto
  description: {
    type: DataTypes.STRING,
  },

  // Preço do produto
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  // Quantidade disponível em estoque
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Product;