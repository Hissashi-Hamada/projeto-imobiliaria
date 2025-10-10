import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/global.css";
import { login } from "@/services/auth";

const inputStyle = {
  width: "100%",
  height: 52,
  fontSize: 16,
  borderRadius: 12,
  border: "1px solid #bbb",
  padding: "0 12px",
};

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const user = await login(email, password); // usa função centralizada
      localStorage.setItem("user", JSON.stringify(user)); // opcional: guardar usuário
      nav("/imoveis");
    } catch (error) {
      setErr(error?.message || "Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-page"
      style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 64px)", padding: "1rem" }}
    >
      <div
        className="card"
        style={{
          width: "min(640px,96vw)",
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "var(--shadow)",
          padding: "1.5rem 1.75rem",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: ".25rem" }}>Entrar</h2>
        <p style={{ marginTop: 0, color: "var(--muted)" }}>
          Acesse sua conta para salvar favoritos e falar com o vendedor.
        </p>

        <form onSubmit={onSubmit} autoComplete="on">
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              required
              style={inputStyle}
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label>Senha</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                style={inputStyle}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "var(--primary)",
                  cursor: "pointer",
                }}
                aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPw ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {err && <p style={{ color: "crimson", marginTop: ".25rem" }}>{err}</p>}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", height: 44, marginTop: ".5rem" }}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
