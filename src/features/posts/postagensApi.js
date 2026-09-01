import { api } from "../../shared/services/api";

export async function listarPostagens({ page = 0, size = 10 } = {}) {
  const { data } = await api.get("/api/v1/postagens", { params: { page, size } });
  return data; // PaginaDto<PostagemDto> — mais recentes primeiro
}

export async function buscarPostagemPorId(id) {
  const { data } = await api.get(`/api/v1/postagens/${id}`);
  return data; // PostagemDetalheDto — já traz os 5 comentários mais recentes
}

export async function listarPostagensPorAutor(userId, { page = 0, size = 10 } = {}) {
  const { data } = await api.get(`/api/v1/postagens/usuario/${userId}`, {
    params: { page, size },
  });
  return data;
}

export async function buscarPostagensPorTitulo(nome, { page = 0, size = 10 } = {}) {
  const { data } = await api.get(`/api/v1/postagens/nome/${nome}`, {
    params: { page, size },
  });
  return data;
}

export async function criarPostagem(dto) {
  const { data } = await api.post("/api/v1/postagens", dto);
  return data; // PostagemDto
}

export async function atualizarPostagem(id, dto) {
  const { data } = await api.put(`/api/v1/postagens/${id}`, dto);
  return data; // PostagemDto
}

export async function excluirPostagem(id) {
  await api.delete(`/api/v1/postagens/${id}`);
}

// Campo do arquivo precisa se chamar "file" — é o que o backend espera.
export async function enviarImagemPostagem(id, file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/api/v1/postagens/${id}/imagem`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // PostagemDto
}
