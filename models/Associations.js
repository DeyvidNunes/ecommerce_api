const User = require("./User");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Product = require("./Product");

// Centraliza todos os relacionamentos entre os models

// Um usuário pode ter vários pedidos
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Um pedido pode ter vários itens
// onDelete CASCADE — ao deletar o pedido, os itens são deletados automaticamente
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Um produto pode estar em vários itens de pedido
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});
