import { api } from "../../shared/services/api";

export async function listarComentariosDoJogo(jogoId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/api/v1/jogos/${jogoId}/comentarios`, {
    params: { page, size },
  });
  return data;
}

export async function comentarJogo(jogoId, conteudo) {
  const { data } = await api.post(`/api/v1/jogos/${jogoId}/comentarios`, { conteudo });
  return data;
}

export async function listarComentariosDaPostagem(postagemId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/api/v1/postagens/${postagemId}/comentarios`, {
    params: { page, size },
  });
  return data;
}

export async function comentarPostagem(postagemId, conteudo) {
  const { data } = await api.post(`/api/v1/postagens/${postagemId}/comentarios`, { conteudo });
  return data;
}

// Editar é só do dono (o backend recusa com 403 se não for); excluir é do
// dono OU admin — mesmo padrão de moderação usado em postagens.
export async function atualizarComentario(id, conteudo) {
  const { data } = await api.put(`/api/v1/comentarios/${id}`, { conteudo });
  return data;
}

export async function excluirComentario(id) {
  await api.delete(`/api/v1/comentarios/${id}`);
}
