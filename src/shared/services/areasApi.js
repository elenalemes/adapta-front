import { api } from "./api";

/**
 * /areas NÃO é paginado — devolve um array direto, já com os componentes
 * curriculares aninhados. Uma chamada só monta o menu inteiro de categoria
 * + habilidade (os dois dropdowns do wireframe da home).
 */
export async function listarAreas() {
  const { data } = await api.get("/api/v1/areas");
  return data; // AreaDto[]
}
