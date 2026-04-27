const { where } = require("sequelize");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");

// Controller de pedidos
module.exports = class OrderController {
  // Criar pedido
  static async createOrder(req, res) {
    try {
      const userId = req.userId;
      const { items } = req.body;

      // Verifica se items existe ou está vazio
      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({ message: "O pedido precisa ter pelo menos um item." });
      }

      // Busca todos os produtos do pedido de uma vez pelo productId
      const productIds = items.map((item) => item.productId);
      const products = await Product.findAll({ where: { id: productIds } });

      // Indexa os produtos por id para acesso rápido
      const productMap = {};
      for (const product of products) {
        productMap[product.id] = product;
      }

      // Valida se todos os produtos existem no banco
      for (const item of items) {
        if (!productMap[item.productId]) {
          return res.status(400).json({
            message: `Produto ${item.productId} não encontrado.`,
          });
        }
      }

      //Controle de estoque
      const product = await Promise.all(
        items.map((item) => {
          return Product.findOne({ where: { id: item.productId } });
        }),
      );

      for (let i = 0; i < items.length; i++) {
        const pro = product[i];
        const { quantity } = items[i];

        if (quantity > pro.stock) {
          return res.status(400).json({
            message: `Estoque insuficiente para o produto ${pro.name}. Quantidade disponível: ${pro.stock}`,
          });
        }
      }

      await Promise.all(
        product.map((prod, index) => {
          const newStock = prod.stock - items[index].quantity;

          return prod.update({ stock: newStock });
        }),
      );

      // Calcula o total do pedido usando o preço do banco
      const total = items.reduce((acc, item) => {
        return (
          acc +
          parseFloat(productMap[item.productId].price) * parseInt(item.quantity)
        );
      }, 0);

      // Adiciona pedido na tabela orders
      const order = await Order.create({ userId, total });

      // Adiciona o orderId em cada item para vincular ao pedido criado
      // Nome e preço também vêm do banco para evitar inconsistências
      const orderItems = items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        name: productMap[item.productId].name,
        price: productMap[item.productId].price,
      }));

      // Salva todos os itens no banco de uma vez
      await OrderItem.bulkCreate(orderItems);

      return res.status(201).json(order);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao criar pedido." });
    }
  }

  // Listar TODOS os pedidos — apenas admin pode acessar - com paginação
  static async getAllOrders(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const offset = (parsedPage - 1) * parsedLimit;

      const { count, rows } = await Order.findAndCountAll({
        limit: parsedLimit,
        offset,
        include: [{ model: OrderItem, as: "items" }],
      });

      return res.status(200).json({
        total: count, // total de pedidos no banco
        page: parsedPage, //pagina atual
        totalPages: Math.ceil(count / parsedLimit), 
        data: rows, // pedidos da página atual
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao consultar pedidos." });
    }
  }

  // Listar apenas os pedidos do usuário logado
  static async getMyOrders(req, res) {
    try {
      // Inclui os itens ao pedido

      const allOrders = await Order.findAll({
        where: { userId: req.userId },
        include: [{ model: OrderItem, as: "items" }],
      });

      return res.status(200).json(allOrders);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao consultar pedidos." });
    }
  }

  // Atualizar status do pedido
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({ message: "Pedido não existe" });
      }
      await order.update({ status });

      return res.status(200).json(order);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao atualizar status." });
    }
  }

  // Deletar pedido
  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }
      await order.destroy();

      return res.status(200).json({ message: "Pedido deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao deletar pedido." });
    }
  }
};
