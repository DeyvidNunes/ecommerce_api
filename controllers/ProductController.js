const { Op } = require("sequelize");
const Product = require("../models/Product");

module.exports = class ProductController {
  // Cadastrar produto
  static async createProduct(req, res) {
    try {
      const { name, description, price, stock } = req.body;

      // Verifica se já existe um produto com o mesmo nome
      const productExist = await Product.findOne({ where: { name } });
      if (productExist) {
        return res.status(400).json({ message: "Produto já cadastrado" });
      }

      const product = { name, description, price, stock };
      await Product.create(product);

      return res.status(201).json({ message: "Produto criado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao criar produto." });
    }
  }

  // Consultar todos os produtos com paginação
  static async getAllProducts(req, res) {
    try {
      // Se não vier page e limit na query, usa 1 e 10 como padrão
      const { page = 1, limit = 10 } = req.query;

      // Converte pra inteiro antes de usar nos cálculos
      const parsedLimit = parseInt(limit);

      const parsedPage = parseInt(page);

      // Calcula quantos registros pular baseado na página atual
      const offset = (parsedPage - 1) * parsedLimit;

      // Busca os produtos e o total de registros no banco
      const { count, rows } = await Product.findAndCountAll({
        limit: parsedLimit, // quantos produtos retornar por página
        offset, // quantos pular
      });

      // Retorna os dados com informações de paginação
      return res.status(200).json({
        total: count, // total de produtos no banco
        page: parsedPage, // página atual
        totalPages: Math.ceil(count / parsedLimit), // total de páginas
        data: rows, // produtos da página atual
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao consultar produtos." });
    }
  }

  // Consultar produto por ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findOne({ where: { id } });

      // Verifica se o produto existe
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao consultar produto." });
    }
  }

  // Consultar produto por nome e/ou faixa de preço
  static async getProductByname(req, res) {
    try {
      const { name, minPrice, maxPrice } = req.query;

      const where = {};

      if (name) {
        // Op.like com % faz busca parcial — "cad" acha "Cadeira", "Caderno" etc
        where.name = { [Op.like]: `%${name}%` };
      }

      if (minPrice && maxPrice) {
        // Op.between filtra produtos com preço entre minPrice e maxPrice
        where.price = { [Op.between]: [minPrice, maxPrice] };
      }

      const products = await Product.findAll({ where });

      // findAll retorna array vazio quando não acha nada, por isso verifica o length
      if (products.length === 0) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao consultar produto." });
    }
  }

  // Atualizar produto
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;

      const product = await Product.findOne({ where: { id } });

      // Verifica se o produto existe antes de atualizar
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      await product.update({ name, description, price });

      return res
        .status(200)
        .json({ message: "Produto atualizado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao atualizar produto." });
    }
  }

  // Deletar produto
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findOne({ where: { id } });

      // Verifica se o produto existe antes de deletar
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      await product.destroy();

      return res.status(200).json({ message: "Produto deletado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao deletar produto." });
    }
  }
};
