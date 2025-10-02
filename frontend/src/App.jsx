import { Routes, Route, Navigate } from "react-router-dom";
import Vitrine from "@/pages/Vitrine";
import ImovelDetalhe from "@/pages/ImovelDetalhe";
import Profile from "@/pages/Profile";
import Navbar from "@/components/Navbar";

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/imoveis" replace/>}/>
        <Route path="/imoveis" element={<Vitrine/>}/>
        <Route path="/imoveis/:id" element={<ImovelDetalhe/>}/>
        <Route path="/profile" element={<Profile/>}/>
        {/* suas rotas de login/register se aplicam */}
      </Routes>
    </>
  );
}
