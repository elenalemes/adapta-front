import { z } from "zod";

// Espelha o PostagemDtoPut do backend.
export const postagemSchema = z.object({
  titulo: z
    .string()
    .min(1, "O título da postagem é obrigatório.")
    .max(200, "O título deve ter no máximo 200 caracteres."),
  conteudo: z
    .string()
    .min(10, "O conteúdo deve ter entre 10 e 5000 caracteres.")
    .max(5000, "O conteúdo deve ter entre 10 e 5000 caracteres."),
});
