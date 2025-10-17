import { Routes, Route, Navigate } from "react-router-dom";
import Vitrine from "@/pages/Vitrine";
import ImovelDetalhe from "@/pages/ImovelDetalhe";
import ImovelNovo from "@/pages/ImovelNovo";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import Login from "@/pages/Login"; // crie depois, se ainda não existir
import Navbar from "@/components/Navbar";
import useAuth from '@/hooks/useAuth';

export default function App(){
  const { user, isAuthenticated, isAdmin, authChecked, logout } = useAuth();

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        authChecked={authChecked}
        isAdmin={isAdmin}
        userName={user?.name}
        onLogout={logout}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/imoveis" replace/>}/>
        <Route path="/imoveis" element={<Vitrine/>}/>
        <Route path="/imoveis/novo" element={<ImovelNovo/>}/>
        <Route path="/imoveis/:id" element={<ImovelDetalhe/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </>
  );
}
