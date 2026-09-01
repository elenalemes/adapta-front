import { z } from "zod";

// Espelha o UserDtoPut do backend — a edição de perfil não tem campo de
// senha de propósito (só muda pelo fluxo de recuperação por e-mail).
export const perfilSchema = z.object({
  username: z
    .string()
    .min(3, "O nome de usuário deve ter entre 3 e 50 caracteres.")
    .max(50, "O nome de usuário deve ter entre 3 e 50 caracteres."),
  email: z
    .email("Informe um e-mail válido.")
    .max(150, "O e-mail deve ter no máximo 150 caracteres."),
});
