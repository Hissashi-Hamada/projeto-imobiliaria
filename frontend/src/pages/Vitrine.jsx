import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import hero from "@/assets/casa-de-madeira-fotorrealista-com-estrutura-de-madeira.jpg";
import "@/styles/pages/vitrine.css";
import { me } from "@/services/auth";

export default function Vitrine() {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem("user") ?? "null");
    } catch (_) {
      return null;
    }
  });

  useEffect(() => {
    let mounted = true;
    me()
      .then((u) => {
        if (!mounted) return;
        setUser(u);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("user", JSON.stringify(u));
        }
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("user");
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const podeCriar = !!user && (user.is_admin || user.role === "admin");

  return (
    <section className="vitrine-hero" style={{ backgroundImage: `url(${hero})` }}>
      <div className="hero-content">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h1>Tavares Corretora de Imóveis</h1>
            <p>Casas, apartamentos e terrenos selecionados para você.</p>
          </div>

          {podeCriar && (
            <Link
              to="/imoveis/novo"
              className="btn-primary"
              style={{ padding: "0.6rem 1.4rem", borderRadius: "999px", whiteSpace: "nowrap" }}
            >
              + Cadastrar imóvel
            </Link>
          )}
        </div>

        {/* Barra de filtros */}
        <div className="filters-wrap">
          <input type="text" placeholder="Buscar por título, endereço..." />
          <select>
            <option value="todos">Negócio (todos)</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
          <select>
            <option value="todos">Tipo (todos)</option>
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
            <option value="apartamento">Apartamento</option>
          </select>
          <select>
            <option value="recente">Mais recentes</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
          </select>
          <button className="btn-primary">Pesquisar</button>
        </div>
      </div>
    </section>
  );
}

