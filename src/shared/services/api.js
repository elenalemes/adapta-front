import axios from "axios";
import { getToken, clearToken } from "./token";

/**
 * Instância única do Axios usada por todos os serviços de recurso
 * (jogosApi.js, postagensApi.js, etc). Centraliza duas coisas que a API
 * do Adapta exige em toda chamada autenticada:
 *
 * 1. Anexar o header Authorization com o token JWT.
 * 2. Tratar 401 de forma global: o token dura 2h e não tem refresh, então
 *    qualquer 401 significa "a sessão acabou", em qualquer tela.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      // TODO: quando o AuthContext e o React Router estiverem no ar,
      // trocar por um redirecionamento via navigate() em vez de location —
      // assim a SPA não recarrega a página inteira. Por enquanto isto
      // garante que qualquer sessão expirada leve para o login.
      if (window.location.pathname !== "/entrar") {
        window.location.href = "/entrar";
      }
    }
    return Promise.reject(error);
  }
);
