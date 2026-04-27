const express = require("express");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const validate = require("../middlewares/validate");
const productSchema = require("../schemas/productSchema");

// Rotas públicas — qualquer pessoa pode consultar produtos
router.get("/", ProductController.getAllProducts);          // listar todos com paginação
router.get("/search", ProductController.getProductByname); // filtrar por nome e/ou preço
router.get("/:id", ProductController.getProductById);      // buscar por id

// Rotas protegidas — apenas admin pode gerenciar produtos
router.post("/", auth, isAdmin,validate(productSchema), ProductController.createProduct);    // criar produto
router.put("/:id", auth, isAdmin,validate(productSchema.partial()), ProductController.updateProduct);     // editar produto
router.delete("/:id", auth, isAdmin, ProductController.deleteProduct);  // deletar produto

module.exports = router;