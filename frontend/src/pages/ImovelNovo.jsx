import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { me } from "@/services/auth";

export default function ImovelNovo() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;
    me()
      .then((user) => {
        if (!mounted) return;
        if (user.is_admin || user.role === "admin") {
          setStatus("ok");
        } else {
          setStatus("denied");
        }
      })
      .catch(() => {
        if (!mounted) return;
        setStatus("denied");
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (status !== "denied") return;
    const timer = setTimeout(() => navigate("/imoveis"), 1500);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  if (status === "checking") {
    return <p style={{ padding: "2rem" }}>Carregando...</p>;
  }

  if (status === "denied") {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Acesso negado</h2>
        <p>Somente administradores podem cadastrar imóveis. Voltando para a vitrine...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Cadastro de imóvel</h1>
      <p>
        Aqui vai o formulário de criação. Preencha os campos e envie para <code>POST /api/imoveis</code>,
        garantindo que inclua o cookie de sessão do admin logado.
      </p>
    </div>
  );
}
