import { api } from "./api";

export async function listarComponentes() {
  const { data } = await api.get("/api/v1/componentes");
  return data; // ComponenteDto[]
}

export async function buscarComponentePorId(id) {
  const { data } = await api.get(`/api/v1/componentes/${id}`);
  return data;
}

export async function criarComponente(dto) {
  const { data } = await api.post("/api/v1/componentes", dto);
  return data;
}

export async function atualizarComponente(id, dto) {
  const { data } = await api.put(`/api/v1/componentes/${id}`, dto);
  return data;
}

export async function excluirComponente(id) {
  await api.delete(`/api/v1/componentes/${id}`);
}
