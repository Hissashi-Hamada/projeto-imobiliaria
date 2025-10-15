import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import "@/styles/global.css";

export default function Profile() {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    avatar: null, // arquivo de imagem
  });

  useEffect(() => {
    (async () => {
      try {
        const me = await api.profile();
        setUser(me);
        setForm(f => ({
          ...f,
          name: me.name ?? "",
          email: me.email ?? "",
          phone: me.phone ?? "",
        }));
        if (me.avatar) setAvatarPreview(me.avatar);
      } catch (e) {
        setErr("Faça login para acessar o perfil.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, avatar: file }));
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (form.password && form.password !== form.password_confirmation) {
      setErr("As senhas não coincidem.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      if (form.password) fd.append("password", form.password);
      if (form.avatar) fd.append("avatar", form.avatar);

      await api.updateProfile(fd);
      setOk("Perfil atualizado com sucesso!");
      setUser(u =>
        u
          ? {
              ...u,
              name: form.name,
              email: form.email,
              phone: form.phone,
            }
          : u
      );
      setForm(f => ({ ...f, password: "", password_confirmation: "" }));
    } catch (e2) {
      setErr(e2.message || "Erro ao atualizar perfil.");
    }
  }

  if (loading) {
    return <div style={{ textAlign: "center", padding: "3rem" }}>Carregando...</div>;
  }

  if (!user) {
    return (
      <div
        className="auth-page"
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "calc(100vh - 64px)",
          padding: "1rem",
        }}
      >
        <div
          className="card"
          style={{
            width: "min(420px, 90vw)",
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            boxShadow: "var(--shadow)",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Você não está autenticado</h2>
          <p style={{ color: "var(--muted)" }}>
            {err || "Entre com sua conta para visualizar e editar o perfil."}
          </p>
          <a
            href="/login"
            className="btn-primary"
            style={{ display: "inline-block", marginTop: "1rem", padding: "0.6rem 1.2rem" }}
          >
            Ir para login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="auth-page"
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "calc(100vh - 64px)",
        padding: "1rem",
      }}
    >
      <div
        className="card"
        style={{
          width: "min(640px, 96vw)",
          background: "#fff",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          boxShadow: "var(--shadow)",
          padding: "1.5rem 1.75rem",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: ".25rem",
            fontFamily: "Poppins, Inter, sans-serif",
            color: "var(--primary)",
          }}
        >
          Meu Perfil
        </h2>
        <p style={{ marginTop: 0, color: "var(--muted)" }}>
          Edite suas informações e foto de perfil.
        </p>

        <div
          style={{
            background: "rgba(15, 228, 26, 0.12)",
            color: "#2e7d32",
            padding: ".75rem",
            borderRadius: 12,
            fontWeight: 600,
            marginBottom: ".75rem",
          }}
        >
          Logado como <span>{user.name || user.email}</span>
        </div>

        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {ok && <p style={{ color: "seagreen" }}>{ok}</p>}

        <form onSubmit={onSubmit} id="profileForm" className="form">
          {/* Avatar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid var(--primary)",
                marginBottom: 10,
              }}
            >
              <img
                src={
                  avatarPreview ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <label
              htmlFor="avatar"
              style={{
                background: "var(--primary)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Trocar foto
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onFileChange}
            />
          </div>

          {/* Campos */}
          <div className="mb-3">
            <label>Nome</label>
            <input
              name="name"
              className="form-control"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={onChange}
              required
              style={{ width: "100%", height: 52, fontSize: 16, borderRadius: 12 }}
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
              style={{ width: "100%", height: 52, fontSize: 16, borderRadius: 12 }}
            />
          </div>

          <div className="mb-3">
            <label>Telefone</label>
            <input
              name="phone"
              className="form-control"
              placeholder="(11) 90000-0000"
              value={form.phone}
              onChange={onChange}
              style={{ width: "100%", height: 52, fontSize: 16, borderRadius: 12 }}
            />
          </div>

          <hr style={{ margin: "1.2rem 0" }} />

          <div className="mb-3">
            <label>Nova Senha (opcional)</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Deixe em branco para não alterar"
              value={form.password}
              onChange={onChange}
              style={{ width: "100%", height: 52, fontSize: 16, borderRadius: 12 }}
            />
          </div>

          <div className="mb-3">
            <label>Confirmar Nova Senha</label>
            <input
              type="password"
              name="password_confirmation"
              className="form-control"
              value={form.password_confirmation}
              onChange={onChange}
              placeholder="Repita a nova senha"
              style={{ width: "100%", height: 52, fontSize: 16, borderRadius: 12 }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              height: 44,
              marginTop: ".5rem",
              borderRadius: 10,
            }}
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
