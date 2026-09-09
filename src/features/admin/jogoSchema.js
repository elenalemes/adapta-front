import { z } from "zod";

export const jogoSchema = z.object({
  titulo: z
    .string()
    .min(1, "O título do jogo é obrigatório.")
    .max(150, "O título deve ter no máximo 150 caracteres."),
  descricao: z
    .string()
    .min(1, "A descrição do jogo é obrigatória.")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres."),
  urlJogo: z
    .string()
    .max(500)
    .regex(/^https?:\/\/.+/, "A URL do jogo deve começar com http:// ou https://")
    .optional()
    .or(z.literal("")),
});
