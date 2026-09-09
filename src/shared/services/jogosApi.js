import { api } from "./api";

export async function listarJogos({ page = 0, size = 20 } = {}) {
  const { data } = await api.get("/api/v1/jogos", {
    params: { page, size },
  });
  return data; // PaginaDto<JogoDto>
}

export async function buscarJogoPorId(id) {
  const { data } = await api.get(`/api/v1/jogos/${id}`);
  return data;
}

export async function listarJogosPorArea(areaId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/api/v1/jogos/area/${areaId}`, {
    params: { page, size },
  });
  return data;
}

export async function listarJogosPorComponente(componenteId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/api/v1/jogos/componente/${componenteId}`, {
    params: { page, size },
  });
  return data;
}

export async function buscarJogosPorTitulo(titulo, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/api/v1/jogos/titulo/${titulo}`, {
    params: { page, size },
  });
  return data;
}

// ---------- Rotas ROLE_ADMIN ----------

export async function criarJogo(dto) {
  const { data } = await api.post("/api/v1/jogos", dto);
  return data; // JogoDto
}

export async function atualizarJogo(id, dto) {
  const { data } = await api.put(`/api/v1/jogos/${id}`, dto);
  return data; // JogoDto
}

export async function excluirJogo(id) {
  await api.delete(`/api/v1/jogos/${id}`);
}

export async function enviarImagemJogo(id, file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/api/v1/jogos/${id}/imagem`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
