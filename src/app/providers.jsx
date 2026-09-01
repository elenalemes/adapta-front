import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { AuthProvider } from "./AuthContext";

// Ponto único de "providers globais" do app: rotas, cache de servidor e
// autenticação, todos aninhados aqui em vez de crescerem soltos no main.jsx.
export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
