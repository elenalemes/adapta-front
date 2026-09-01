import { api } from "../../shared/services/api";

export async function login({ email, senha }) {
  const { data } = await api.post("/api/v1/login", { email, senha });
  return data; // { token }
}

export async function cadastrar({ username, email, senha }) {
  const { data } = await api.post("/api/v1/users", { username, email, senha });
  return data; // UserDto
}

export async function buscarUsuarioLogado() {
  const { data } = await api.get("/api/v1/users/me");
  return data; // UserDto completo, incluindo `perfis` (decide se é admin)
}

// Sempre responde 200 com a mesma mensagem, exista ou não a conta —
// proposital, pra não revelar quais e-mails estão cadastrados.
export async function esqueciSenha(email) {
  const { data } = await api.post("/api/v1/senha/esqueci", { email });
  return data; // { mensagem }
}

// token vem do link do e-mail (?token=), vale 1h e só funciona uma vez.
export async function redefinirSenha(token, novaSenha) {
  const { data } = await api.post("/api/v1/senha/redefinir", { token, novaSenha });
  return data; // { mensagem }
}
