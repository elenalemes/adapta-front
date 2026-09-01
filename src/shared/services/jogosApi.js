import { api } from "./api";

/**
 * Serviço de Jogos — exemplo do padrão a repetir pros outros recursos
 * (postagensApi.js, comentariosApi.js, etc).
 *
 * IMPORTANTE: /jogos é paginado, devolve
 * { conteudo, pagina, tamanho, totalElementos, totalPaginas, primeira, ultima }.
 * `pagina` começa em zero. Outras rotas (areas, componentes, favoritos)
 * devolvem array puro — não têm esse envelope. Cada serviço documenta o
 * formato que a sua rota realmente devolve, pra quem for usar não ter que
 * adivinhar nem checar no Swagger toda vez.
 */

export async function listarJogos({ page = 0, size = 20 } = {}) {
  const { data } = await api.get("/api/v1/jogos", {
    params: { page, size },
  });
  return data; // PaginaDto<JogoDto>
}

export async function buscarJogoPorId(id) {
  const { data } = await api.get(`/api/v1/jogos/${id}`);
  return data; // JogoDetalheDto — já traz favoritado, minhaNota, comentarios (5 mais recentes)
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

// ---------- Rotas de administração (ROLE_ADMIN) ----------

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

// Campo do arquivo precisa se chamar "file" — é o que o backend espera.
export async function enviarImagemJogo(id, file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/api/v1/jogos/${id}/imagem`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
