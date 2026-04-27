const { z } = require("zod");

const productSchema = z.object({
  name: z
    .string({ message: "Nome deve ser um texto" })
    .min(2, { message: "Nome deve ter no mínimo 3 caracteres" }),

  description: z.string({ message: "Descrição deve ser um texto" })
  .optional(),

  price: z
    .number({ message: "Preço deve ser um número" })
    .min(0.01, { message: "Preço deve ser maior que zero" }),

  stock: z
    .number({ message: "Estoque deve ser um número" })
    .int({ message: "Estoque deve ser um número inteiro" })
    .min(0, { message: "Estoque não pode ser negativo" }),
});

module.exports = productSchema;
