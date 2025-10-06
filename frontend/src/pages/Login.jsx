import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useApi from "@/hooks/useApi";
import "@/styles/global.css";

/** Reaproveita o mesmo inputStyle do Register */
const inputStyle = {
width: "100%",
height: 52,
fontSize: 16,
borderRadius: 12,
border: "1px solid #bbb",
padding: "0 12px",
};

export default function Login() {
const api = useApi();
const nav = useNavigate();

const [form, setForm] = useState({ email: "", password: "" });
const [showPw, setShowPw] = useState(false);
const [err, setErr] = useState("");
const [loading, setLoading] = useState(false);

function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
}

async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // Se seu useApi() tiver api.login, use:
    if (api.login) {
        await api.login({ email: form.email, password: form.password });
    } else {
        // >>> fallback caso seu hook não tenha login():
        // import { api as axiosApi, ensureCsrf } from "../api";
        // await ensureCsrf();
        // await axiosApi.post("/login", { email: form.email, password: form.password });
        }
      nav("/imoveis"); // redireciona após login
    } catch (e2) {
setErr(e2.message || "Email ou senha inválidos.");
    } finally {
setLoading(false);
    }
}

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
        }}>

        <h2 style={{ marginTop: 0, marginBottom: ".25rem" }}>Entrar</h2>
        <p style={{ marginTop: 0, color: "var(--muted)" }}>
            Acesse sua conta para salvar favoritos e falar com o vendedor.
        </p>

        <form onSubmit={onSubmit} className="form">
        <div className="mb-3">
            <label>Email</label>
            <input
                type="email"
                name="email"
                placeholder="voce@exemplo.com"
                value={form.email}
                onChange={onChange}
                required
                style={inputStyle}
            />
        </div>

        <div className="mb-3">
            <label>Senha</label>
            <div style={{ position: "relative" }}>
            <input
                type={showPw ? "text" : "password"}
                name="password"
                placeholder="Sua senha"
                value={form.password}
                onChange={onChange}
                required
                style={inputStyle}
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
                aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}>

                {showPw ? "Ocultar" : "Mostrar"}
            </button>
        </div>
    </div>

        {err && <p style={{ color: "crimson", marginTop: ".25rem" }}>{err}</p>}

        <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", height: 44, marginTop: ".5rem" }}
            disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
        </button>

            <div style={{ marginTop: "0.75rem", textAlign: "center", color: "var(--muted)" }}>
            </div>
        </form>
    </div>
</div>
  );
}
