// frontend/src/pages/Register.jsx
import { useMemo, useState } from "react";
import useApi from "@/hooks/useApi";
import { maskCPF, maskPhone, maskDate } from "@/utils/masks";
import { evaluatePassword } from "@/utils/passwordUtils";
import "@/styles/global.css";
// opcional: se tiver um css próprio para auth
// import "@/styles/auth.css";
// import "@/styles/estilos.css";
// import "@/styles/register.css";

export default function Register() {
  const api = useApi();

 const inputStyle = {
    width: "100%",
    height: 52,
    fontSize: 16,
    borderRadius: 12,
    border: "1px solid #bbb",   // borda visível
    padding: "0 12px",
    outline: "none",
 };

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  // força da senha
  const pwStrength = useMemo(() => evaluatePassword(form.password), [form.password]);

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

    if (pwStrength.score < 2) {
      setErr("Senha muito fraca. Melhore a senha antes de continuar.");
      return;
    }
    if (form.password !== form.password_confirmation) {
      setErr("As senhas não coincidem.");
      return;
    }

    try {
      // envia somente o que o backend espera no /register
      const payload = { name: form.name, email: form.email, password: form.password };
      const res = await api.register(payload); // POST /api/register
      localStorage.setItem("token", res.token);
      setOk(true);
      window.location.href = "/imoveis";
    } catch (e2) {
      setErr(e2.message || "Erro ao cadastrar");
    }
  }

  return (
    <div className="auth-page" style={{ display:"grid", placeItems:"center", minHeight:"calc(100vh - 64px)", padding:"1rem" }}>
      <div className="card" style={{
        width: "min(460px, 92vw)", background:"#fff", border:"1px solid var(--border)",
        borderRadius:"14px", boxShadow:"var(--shadow)", padding:"1.25rem"
      }}>
        <h2 style={{ marginTop:0, marginBottom:".25rem", fontFamily:"Poppins, Inter, sans-serif", color:"var(--primary)" }}>
          Cadastro
        </h2>
        <p style={{ marginTop:0, color:"var(--muted)" }}>Crie sua conta para salvar favoritos e falar com o vendedor.</p>

        <form onSubmit={onSubmit} id="registerForm" className="form">
          <div className="mb-3">
            <label>Nome</label>
            <input
              name="name"
              className="form-control"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={onChange}
              required
              />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="voce@exemplo.com"
              value={form.email}
              onChange={onChange}
              required
              />
          </div>

          <div className="mb-3">
            <label>Senha</label>
            <div className="position-relative" style={{ position:"relative" }}>
              <input
                type={showPw ? "text" : "password"}
                id="inputPassword"
                name="password"
                className="form-control"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={()=> setShowPw(v=>!v)}
                className="password-toggle"
                style={{
                  position:"absolute", right:10, top:10, border:"none", background:"transparent",
                  color:"var(--primary)", cursor:"pointer"
                }}
              >
                {showPw ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {/* barra da força */}
            <div style={{ marginTop: ".4rem", height: 8, background: "#e5e7eb", borderRadius: 999 }}>
              <div style={{
                height: 8,
                width: `${pwStrength.percent}%`,
                background: pwStrength.color,
                borderRadius: 999,
                transition: "width .25s"
              }} />
            </div>
            <small style={{ color:"var(--muted)" }}>
              Força: {pwStrength.label}
            </small>
          </div>

          <div className="mb-3">
            <label>Confirmar senha</label>
            <div className="position-relative" style={{ position:"relative" }}>
              <input
                type={showPw2 ? "text" : "password"}
                id="inputConfirmPassword"
                name="password_confirmation"
                className="form-control"
                placeholder="Repita a senha"
                value={form.password_confirmation}
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={()=> setShowPw2(v=>!v)}
                className="password-toggle"
                style={{
                  position:"absolute", right:10, top:10, border:"none", background:"transparent",
                  color:"var(--primary)", cursor:"pointer"
                }}
              >
                {showPw2 ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {/* campos extras só visuais para demo */}
          <div className="mb-3">
            <label>Data de nascimento</label>
            <input
              type="text"
              id="inputNascimento"
              name="nascimento"
              className="form-control"
              placeholder="DD/MM/AAAA"
              value={form.nascimento}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label>CPF</label>
            <input
              type="text"
              id="inputCPF"
              name="cpf"
              className="form-control"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label>Telefone</label>
            <input
              type="text"
              id="inputTelefone"
              name="telefone"
              className="form-control"
              placeholder="(11) 90000-0000"
              value={form.telefone}
              onChange={onChange}
            />
          </div>

          {err && <p style={{ color:"crimson", marginTop:".25rem" }}>{err}</p>}
          {ok && <p style={{ color:"seagreen", marginTop:".25rem" }}>Cadastro realizado!</p>}

          <button type="submit" className="btn-primary" style={{ width:"100%", height:44, marginTop:".5rem" }}>
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
