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
