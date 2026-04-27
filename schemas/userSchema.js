const { z } = require("zod");

const userSchema = z.object({
  name: z
    .string({ message: "Nome deve ser um texto" })
    .min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  email: z.email({ message: "Email inválido, deve seguir o formato: exemplo@email.com" }),
  password: z
    .string({ message: "Senha deve ser um texto" })
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
  role: z.enum(["admin", "user"], { message: "Role deve ser admin ou user" }),
});

module.exports = userSchema;
