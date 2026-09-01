import { api } from "./api";

// Avaliar de novo sobrescreve a nota anterior, não duplica — não precisa
// checar se já existe antes de mandar.
export async function avaliar(jogoId, nota) {
  const { data } = await api.post("/api/v1/avaliacoes", { jogoId, nota });
  return data;
}
