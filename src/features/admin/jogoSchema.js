import { z } from "zod";

// Só os campos de texto simples vão pelo react-hook-form + zod. Componentes
// (checkbox group) e a faixa de anos (regra que envolve dois campos juntos)
// são validados à mão no JogoFormPage — tentar forçar isso dentro do zod
// deixaria o schema mais confuso do que o problema que resolve.
export const jogoSchema = z.object({
  titulo: z
    .string()
    .min(1, "O título do jogo é obrigatório.")
    .max(150, "O título deve ter no máximo 150 caracteres."),
  descricao: z
    .string()
    .min(1, "A descrição do jogo é obrigatória.")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres."),
  // Opcional de propósito: um jogo pode ser cadastrado ainda sem link,
  // enquanto está em desenvolvimento.
  urlJogo: z
    .string()
    .max(500)
    .regex(/^https?:\/\/.+/, "A URL do jogo deve começar com http:// ou https://")
    .optional()
    .or(z.literal("")),
});
