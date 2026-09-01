// Guarda o token JWT no localStorage. Isolado num arquivo só pra facilitar
// trocar a estratégia de armazenamento depois, se precisar, sem mexer em
// quem usa (api.js e o futuro AuthContext).

const TOKEN_KEY = "adapta_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
