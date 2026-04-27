const jwt = require("jsonwebtoken");

// Middleware de autenticação — verifica se o usuário está logado
const auth = (req, res, next) => {
  // Pega o token do header da requisição
  const authHeader = req.headers.authorization;

  // Verifica se o header foi enviado
  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  // Separa o "Bearer" do token em si
  // "Bearer eyJhbGci..." → ["Bearer", "eyJhbGci..."]
  const token = authHeader.split(" ")[1];

  try {
    // Verifica se o token é válido e não foi alterado
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Salva o id do usuário na requisição pra usar no controller
    req.userId = decoded.id;

    // Salva o role do usuário na requisição pra usar no controller
    req.userRole = decoded.role;

    // Libera pra continuar pra rota
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};

module.exports = auth;
