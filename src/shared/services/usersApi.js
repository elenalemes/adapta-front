import { api } from "./api";

export async function atualizarPerfil(id, dto) {
  const { data } = await api.put(`/api/v1/users/${id}`, dto);
  return data; // UserDto
}

// Campo do arquivo precisa se chamar "file" — é o que o backend espera.
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

// ---------- Rotas de administração (ROLE_ADMIN) ----------

// Só admin vê e-mail de todo mundo — por isso essa rota é separada da
// pública GET /users/{id} (perfil sem e-mail).
export async function listarUsuarios({ page = 0, size = 20 } = {}) {
  const { data } = await api.get("/api/v1/users", { params: { page, size } });
  return data; // PaginaDto<UserDto>
}

export async function promoverAdmin(id) {
  const { data } = await api.post(`/api/v1/users/${id}/admin`);
  return data; // UserDto
}

// O backend recusa remover o próprio acesso de admin (RegraDeNegocioException)
// pra plataforma nunca ficar sem nenhum administrador.
export async function removerAdmin(id) {
  const { data } = await api.delete(`/api/v1/users/${id}/admin`);
  return data; // UserDto
}
