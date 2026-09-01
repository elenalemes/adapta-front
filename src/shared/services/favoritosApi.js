import { api } from "./api";

export async function favoritar(jogoId) {
  await api.post(`/api/v1/favoritos/${jogoId}`);
}

export async function desfavoritar(jogoId) {
  await api.delete(`/api/v1/favoritos/${jogoId}`);
}

// Sem paginação — devolve array direto.
export async function listarFavoritos() {
  const { data } = await api.get("/api/v1/favoritos");
  return data;
}
