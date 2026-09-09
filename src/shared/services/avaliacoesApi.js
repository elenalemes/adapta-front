import { api } from "./api";
export async function avaliar(jogoId, nota) {
  const { data } = await api.post("/api/v1/avaliacoes", { jogoId, nota });
  return data;
}
