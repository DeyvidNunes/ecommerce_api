const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const validate = require("../middlewares/validate");
const userSchema = require("../schemas/userSchema");
const UserController = require("../controllers/Usercontrollers");

// Rotas públicas — não precisam de autenticação
router.post("/", validate(userSchema), UserController.createUser); // cadastrar usuário
router.post("/login", UserController.loginUser); // login e geração do token

// Rotas protegidas — precisam de autenticação
router.put("/update", auth, UserController.updateUser); // atualizar próprio cadastro
router.delete("/", auth, UserController.deleteUser); // deletar própria conta

// Rotas protegidas — apenas admin
router.get("/", auth, isAdmin, UserController.getAllUsers); // listar todos os usuários

module.exports = router;
