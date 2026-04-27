const { Sequelize } = require("sequelize");

// Cria a conexão com o banco usando as variáveis do .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // desativa os logs de SQL no terminal
  },
);

// Testa se a conexão com o banco foi estabelecida
sequelize
  .authenticate()
  .then(() => console.log("Conectado!"))
  .catch((err) => console.log("Erro:", err));

module.exports = sequelize;
