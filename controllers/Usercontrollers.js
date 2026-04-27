const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class UserController {
  // Cadastrar novo usuário
  static async createUser(req, res) {
    try {
      const { name, email, password } = req.body;

      // Verifica se já existe um usuário com esse email
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }

      // Criptografa a senha antes de salvar no banco
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user",
      });

      return res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro ao criar usuário", erro: err.message });
    }
  }

  // Login do usuário
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Busca o usuário pelo email no banco
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Compara a senha digitada com o hash salvo no banco
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      // Gera o token JWT com id, email e role do usuário
      // O token expira em 1 dia e é assinado com a chave secreta do .env
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      return res
        .status(200)
        .json({ message: "Login realizado com sucesso", token });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro ao fazer login", erro: err.message });
    }
  }

  // Listar todos os usuários (apenas admin)
  static async getAllUsers(req, res) {
    try {
      const allUsers = await User.findAll();

      return res.status(200).json(allUsers);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao consultar usuários." });
    }
  }

  // Atualizar dados do próprio usuário
  static async updateUser(req, res) {
    try {
      const id = req.userId;
      const { name, email, password } = req.body;

      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Monta só os campos que vieram no body para não sobrescrever os outros
      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) {
        // Criptografa a nova senha antes de salvar
        updateData.password = await bcrypt.hash(password, 10);
      }

      await user.update(updateData); // ✅ atualiza direto no objeto

      return res
        .status(200)
        .json({ message: "Cadastro atualizado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
  }

  // Deletar a própria conta
  static async deleteUser(req, res) {
    try {
      const id = req.userId;

      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      await user.destroy();

      return res.status(200).json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro ao deletar usuário." });
    }
  }
};
