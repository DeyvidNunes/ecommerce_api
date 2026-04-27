const { DataTypes } = require("sequelize");
const db = require("../db/conn");

// Model de usuário — armazena os dados de autenticação e permissão
const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Define o nível de acesso — user (padrão) ou admin
  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
  },
});

module.exports = User;