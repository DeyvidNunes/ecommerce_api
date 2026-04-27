const { DataTypes } = require("sequelize");
const db = require("../db/conn");

// Model de pedido — armazena o resumo do pedido
const Order = db.define("Order", {
  // FK do usuário que fez o pedido
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // Valor total calculado a partir dos itens
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  // Status do pedido — começa como pending por padrão
  status: {
    type: DataTypes.ENUM(
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
    ),
    defaultValue: "pending",
  },
});

module.exports = Order;