import Profile from "@/pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/imoveis" replace />} />
      <Route path="/imoveis" element={<Vitrine />} />
      <Route path="/imoveis/:id" element={<ImovelDetalhe />} />
      <Route path="/profile" element={<Profile />} /> {/* aqui */}
    </Routes>
  );
}
