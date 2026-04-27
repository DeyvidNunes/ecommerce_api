const { DataTypes } = require("sequelize");
const db = require("../db/conn");

// Model de itens do pedido — armazena cada produto dentro de um pedido
// Nome e preço são salvos aqui para manter o histórico caso o produto seja alterado
const OrderItem = db.define("OrderItem", {
  // FK do pedido ao qual o item pertence
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // FK do produto referenciado
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // Nome do produto no momento da compra
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Preço do produto no momento da compra
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  // Quantidade do produto no pedido
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = OrderItem;