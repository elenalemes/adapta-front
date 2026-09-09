import { api } from "./api";
export async function listarAreas() {
  const { data } = await api.get("/api/v1/areas");
  return data; // AreaDto[]
}
