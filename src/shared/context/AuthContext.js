import { createContext } from "react";

// Só o objeto de contexto mora aqui — separado do Provider e do hook
// porque o Fast Refresh do Vite exige que um arquivo .jsx só exporte
// componentes (regra react-refresh/only-export-components).
export const AuthContext = createContext(null);
