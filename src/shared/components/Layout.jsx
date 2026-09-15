import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-full focus:bg-blue-700 focus:px-6 focus:text-label-lg focus:text-white"
      >
        Pular para o conteúdo principal
      </a>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
