import { Routes, Route, Navigate } from "react-router-dom";
import Vitrine from "@/pages/Vitrine";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/imoveis" replace />} />
      <Route path="/imoveis" element={<Vitrine />} />
    </Routes>
  );
}
