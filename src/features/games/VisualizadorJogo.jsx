import { Construction } from "lucide-react";

// "Em desenvolvimento" agora tem um sinal oficial vindo do backend: jogo
// sem urlJogo. Não precisa de timeout nem de detectar erro de carregamento
// — quando o link existe, ele é de verdade.
export function VisualizadorJogo({ urlJogo, titulo }) {
  if (!urlJogo) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center">
        <Construction className="h-8 w-8 text-gray-400" aria-hidden="true" />
        <p className="font-medium text-gray-600">Jogo em desenvolvimento</p>
        <p className="text-sm text-gray-500">Volte em breve pra jogar essa atividade.</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
      <iframe src={urlJogo} title={titulo} className="h-full w-full" allowFullScreen />
    </div>
  );
}
