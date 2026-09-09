import { api } from "./api";

export async function atualizarPerfil(id, dto) {
  const { data } = await api.put(`/api/v1/users/${id}`, dto);
  return data; // UserDto
}

export async function enviarFotoPerfil(id, file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/api/v1/users/${id}/imagem`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // UserDto
}

export async function excluirConta(id) {
  await api.delete(`/api/v1/users/${id}`);
}

// ---------- Rotas ROLE_ADMIN----------

export async function listarUsuarios({ page = 0, size = 20 } = {}) {
  const { data } = await api.get("/api/v1/users", { params: { page, size } });
  return data; // PaginaDto<UserDto>
}

export async function promoverAdmin(id) {
  const { data } = await api.post(`/api/v1/users/${id}/admin`);
  return data; // UserDto
}

export async function removerAdmin(id) {
  const { data } = await api.delete(`/api/v1/users/${id}/admin`);
  return data; // UserDto
}
