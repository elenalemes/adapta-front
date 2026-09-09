import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe sua senha."),
});

export const cadastroSchema = z.object({
  username: z
    .string()
    .min(3, "O nome de usuário deve ter entre 3 e 50 caracteres.")
    .max(50, "O nome de usuário deve ter entre 3 e 50 caracteres."),
  email: z
    .email("Informe um e-mail válido.")
    .max(150, "O e-mail deve ter no máximo 150 caracteres."),
  senha: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres.")
    .max(100, "A senha deve ter no máximo 100 caracteres.")
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/,
      "A senha deve conter ao menos uma letra maiúscula, um número e um símbolo."
    ),
});

export const esqueciSenhaSchema = z.object({
  email: z.email("Informe um e-mail válido."),
});

export const redefinirSenhaSchema = z
  .object({
    novaSenha: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres.")
      .max(100, "A senha deve ter no máximo 100 caracteres.")
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$/,
        "A senha deve conter ao menos uma letra maiúscula, um número e um símbolo."
      ),
    confirmarSenha: z.string(),
  })
  .refine((dados) => dados.novaSenha === dados.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });
