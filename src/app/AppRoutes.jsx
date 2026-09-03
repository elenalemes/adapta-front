import { Routes, Route } from "react-router-dom";
import { Layout } from "../shared/components/Layout";
import { RotaAdmin } from "../shared/components/RotaAdmin";
import { RotaProtegida } from "../shared/components/RotaProtegida";
import { EmConstrucao } from "../shared/components/EmConstrucao";
import { HomePage } from "../features/games/HomePage";
import { GameDetailPage } from "../features/games/GameDetailPage";
import { JogosCatalogPage } from "../features/games/JogosCatalogPage";
import { LoginPage } from "../features/auth/LoginPage";
import { CadastroPage } from "../features/auth/CadastroPage";
import { EsqueciSenhaPage } from "../features/auth/EsqueciSenhaPage";
import { RedefinirSenhaPage } from "../features/auth/RedefinirSenhaPage";
import { AdminJogosPage } from "../features/admin/AdminJogosPage";
import { JogoFormPage } from "../features/admin/JogoFormPage";
import { AdminComponentesPage } from "../features/admin/AdminComponentesPage";
import { ComponenteFormPage } from "../features/admin/ComponenteFormPage";
import { AdminUsuariosPage } from "../features/admin/AdminUsuariosPage";
import { ProfilePage } from "../features/profile/ProfilePage";
import { BlogListPage } from "../features/posts/BlogListPage";
import { PostDetailPage } from "../features/posts/PostDetailPage";
import { PostFormPage } from "../features/posts/PostFormPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
        <Route path="/jogos" element={<JogosCatalogPage />} />
        <Route path="/jogos/:id" element={<GameDetailPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:id" element={<PostDetailPage />} />
        <Route path="/sobre-nos" element={<EmConstrucao titulo="Sobre nós" />} />
        <Route path="/ajuda" element={<EmConstrucao titulo="Ajuda" />} />

        <Route element={<RotaProtegida />}>
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/blog/novo" element={<PostFormPage />} />
          <Route path="/blog/:id/editar" element={<PostFormPage />} />
        </Route>

        <Route element={<RotaAdmin />}>
          <Route path="/admin/jogos" element={<AdminJogosPage />} />
          <Route path="/admin/jogos/novo" element={<JogoFormPage />} />
          <Route path="/admin/jogos/:id/editar" element={<JogoFormPage />} />
          <Route path="/admin/componentes" element={<AdminComponentesPage />} />
          <Route path="/admin/componentes/novo" element={<ComponenteFormPage />} />
          <Route path="/admin/componentes/:id/editar" element={<ComponenteFormPage />} />
          <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
