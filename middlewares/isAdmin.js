// Middleware que verifica se o usuário autenticado é admin
const isAdmin = (req, res, next) => {
  // Verifica se o role do token é admin
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Acesso negado." });
  }

  next();
};

module.exports = isAdmin;