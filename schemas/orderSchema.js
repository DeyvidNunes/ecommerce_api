const { z } = require("zod");

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number({ message: "deve ser um número" }),
        quantity: z
          .number({ message: "deve ser um número" })
          .min(1, { message: "quantity deve ser no mínimo 1" }),
      }),
    )
    .min(1, { message: "Pedido deve ter pelo menos 1 item" }),
});

module.exports = orderSchema;
