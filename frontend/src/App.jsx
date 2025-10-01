import ImovelDetalhe from "@/pages/ImovelDetalhe";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/imoveis" replace />} />
      <Route path="/imoveis" element={<Vitrine />} />
      <Route path="/imoveis/:id" element={<ImovelDetalhe />} /> {/* nova rota */}
    </Routes>
  );
}
