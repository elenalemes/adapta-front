import { api } from "./api";

// /componentes NÃO é paginado — são só 9 componentes da BNCC cadastrados via
// data.sql, uma lista simples já basta pra tela de administração.
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

// O backend recusa (400) excluir um componente vinculado a algum jogo — a
// mensagem já vem pronta pra mostrar direto à pessoa administradora.
export async function excluirComponente(id) {
  await api.delete(`/api/v1/componentes/${id}`);
}
