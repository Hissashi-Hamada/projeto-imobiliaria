import { useMemo, useState } from "react";
import { maskCPF, maskPhone, maskDate } from "@/utils/masks";
import { evaluatePassword } from "@/utils/passwordUtils";
import api from "@/lib/api";
import "@/styles/global.css";

const inputStyle = {
  width: "100%",
  height: 52,
  fontSize: 16,
  borderRadius: 12,
  border: "1px solid #bbb",
  padding: "0 12px"
};

const API_URL = "http://localhost:8000"; // Laravel (php artisan serve --port=8000)

export default function Register() {
  // state do form
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    nascimento: "",
    cpf: "",
    telefone: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  // força da senha
  const pwStrength = useMemo(
    () => evaluatePassword(form.password || ""),
    [form.password]
  );

  function onChange(e) {
    const { name, value } = e.target;
    if (name === "cpf") return setForm(f => ({ ...f, cpf: maskCPF(value) }));
    if (name === "telefone") return setForm(f => ({ ...f, telefone: maskPhone(value) }));
    if (name === "nascimento") return setForm(f => ({ ...f, nascimento: maskDate(value) }));
    setForm(f => ({ ...f, [name]: value }));
  }


async function onSubmit(e) {
  e.preventDefault();
  setErr(""); setOk(false);

  if (pwStrength.score < 2) return setErr("Senha muito fraca.");
  if (form.password !== form.password_confirmation) return setErr("As senhas não coincidem.");

  try {
    // 1) CSRF cookie
    await api.get("/sanctum/csrf-cookie");

    // 2) POST /register (WEB, não /api)
    await api.post("http://127.0.0.1:8000/register", {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
    });

    // 3) Confirma sessão
    const { data: me } = await api.get("/api/me");

    setOk(true);
    window.location.href = "/imoveis";
  } catch (err) {
    if (err?.response?.status === 422) {
      const first = err.response.data?.errors && Object.values(err.response.data.errors)[0]?.[0];
      setErr(first || "Dados inválidos");
      return;
    }
    if (err?.response?.status === 419) {
      setErr("Sessão expirada (CSRF). Tente novamente.");
      return;
    }
    setErr(err?.response?.data?.message || `Erro ${err?.response?.status || ""}`.trim());
  }
}


  return (
    <div className="auth-page" style={{ display:"grid", placeItems:"center", minHeight:"calc(100vh - 64px)", padding:"1rem" }}>
      <div className="card" style={{
        width:"min(640px,96vw)", background:"#fff", border:"1px solid var(--border)",
        borderRadius:"16px", boxShadow:"var(--shadow)", padding:"1.5rem 1.75rem"
      }}>
        <h2 style={{ marginTop:0, marginBottom:".25rem" }}>Cadastro</h2>
        <p style={{ marginTop:0, color:"var(--muted)" }}>Crie sua conta para salvar favoritos e falar com o vendedor.</p>

        <form onSubmit={onSubmit} id="registerForm" className="form" autoComplete="on">
          <div className="mb-3">
            <label>Nome</label>
            <input
              name="name"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={onChange}
              required
              style={inputStyle}
              autoComplete="name"
              type="text"
            />
          </div>

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
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label>Senha</label>
            <div style={{ position:"relative" }}>
              <input
                type={showPw ? "text" : "password"}
                name="password"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={onChange}
                required
                style={inputStyle}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={()=>setShowPw(v=>!v)}
                style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", border:"none", background:"transparent", color:"var(--primary)", cursor:"pointer" }}
                aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPw ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div style={{ marginTop:".4rem", height:8, background:"#e5e7eb", borderRadius:999 }}>
              <div style={{ height:8, width:`${pwStrength.percent}%`, background:pwStrength.color, borderRadius:999, transition:"width .25s" }} />
            </div>
            <small style={{ color:"var(--muted)" }}>Força: {pwStrength.label}</small>
          </div>

          <div className="mb-3">
            <label>Confirmar senha</label>
            <div style={{ position:"relative" }}>
              <input
                type={showPw2 ? "text" : "password"}
                name="password_confirmation"
                placeholder="Repita a senha"
                value={form.password_confirmation}
                onChange={onChange}
                required
                style={inputStyle}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={()=>setShowPw2(v=>!v)}
                style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", border:"none", background:"transparent", color:"var(--primary)", cursor:"pointer" }}
                aria-label={showPw2 ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
              >
                {showPw2 ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label>Data de nascimento</label>
            <input
              type="text"
              name="nascimento"
              placeholder="DD/MM/AAAA"
              value={form.nascimento}
              onChange={onChange}
              style={inputStyle}
              autoComplete="bday"
              inputMode="numeric"
            />
          </div>

          <div className="mb-3">
            <label>CPF</label>
            <input
              type="text"
              name="cpf"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={onChange}
              style={inputStyle}
              autoComplete="off"
              inputMode="numeric"
            />
          </div>

          <div className="mb-3">
            <label>Telefone</label>
            <input
              type="tel"
              name="telefone"
              placeholder="(11) 90000-0000"
              value={form.telefone}
              onChange={onChange}
              style={inputStyle}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          {err && <p style={{ color:"crimson" }}>{err}</p>}
          {ok  && <p style={{ color:"seagreen" }}>Cadastro realizado!</p>}

          <button type="submit" className="btn-primary" style={{ width:"100%", height:44, marginTop:".5rem" }}>
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
