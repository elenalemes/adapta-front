export function EmConstrucao({ titulo }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
      <p className="text-gray-600">Essa página ainda está em construção.</p>
    </div>
  );
}
