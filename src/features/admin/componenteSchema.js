import { z } from "zod";

// Mesmas regras do ComponenteDtoPut no backend (nome, código e descrição
// aqui; areaId é validado à parte porque é um <select>, não um campo livre).
export const componenteSchema = z.object({
  nome: z
    .string()
    .min(1, "O nome do componente curricular é obrigatório.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),
  codigo: z
    .string()
    .min(1, "O código é obrigatório.")
    .max(40, "O código deve ter no máximo 40 caracteres.")
    .regex(
      /^[A-Z][A-Z0-9_]*$/,
      "O código deve conter apenas letras maiúsculas, números e underscore (ex.: LINGUA_PORTUGUESA)."
    ),
  descricao: z.string().max(500, "A descrição deve ter no máximo 500 caracteres.").optional().or(z.literal("")),
  areaId: z.string().min(1, "Selecione uma área do conhecimento."),
});
