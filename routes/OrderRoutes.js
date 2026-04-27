const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const validate = require("../middlewares/validate");
const orderSchema = require("../schemas/orderSchema");

// Todas as rotas de pedido exigem autenticação
router.post("/", auth, validate(orderSchema), OrderController.createOrder); // criar pedido
router.get("/", auth, OrderController.getMyOrders); // Listar apenas os pedidos do usuário logado
router.patch("/:id", auth, OrderController.updateOrderStatus); // atualizar status
router.delete("/:id", auth, OrderController.deleteOrder); // deletar pedido

// Rota protegida — apenas admin pode ver todos os pedidos
router.get("/all", auth, isAdmin, OrderController.getAllOrders); // listar todos pedidos

module.exports = router;
