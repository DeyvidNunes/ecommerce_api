const validate = (schema) => (req, res, next) => {
  // Testa se o body bate com o schema
  const result = schema.safeParse(req.body);
    console.log(result)

  if (!result.success) {
    // Formata os erros para retornar ao usuário

    const errors = result.error.issues.map((e) => ({
      campo: e.path.join("."),
      menssagem: e.message,
    }));
    return res.status(400).json({ errors });
  }

  next(); // Body válido, segue para o controller
};

module.exports = validate;

