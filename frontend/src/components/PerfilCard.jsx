import { useEffect, useState } from "react";

export default function PerfilCard() {
const [form, setForm] = useState({ name: "", phone: "", email: "" });
const [loading, setLoading] = useState(true);
const [msg, setMsg] = useState("");
const [devLink, setDevLink] = useState("");

useEffect(() => {
    (async () => {
        const r = await fetch("/api/me", { credentials: "include" });
        const me = await r.json();
        setForm({ name: me.name ?? "", phone: me.phone ?? "", email: me.email ?? "" });
        setLoading(false);
    })();
}, []);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setDevLink("");
    const r = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
    });
    const data = await r.json();
    setMsg(data.message || "Atualizado.");
    if (data.confirmation_url) setDevLink(data.confirmation_url);
};

const onChangePassword = async (e) => {
    e.preventDefault();
    const body = {
        current_password: e.target.current_password.value,
        password: e.target.password.value,
        password_confirmation: e.target.password_confirmation.value,
    };
    const r = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    });
    const data = await r.json();
    setMsg(data.message || "Senha alterada.");
    e.target.reset();
};

if (loading) return <div>Carregando…</div>;

return (
    <div className="max-w-2xl mx-auto">
        <div className="card shadow-sm border-0">
            <div className="card-body">
                <h5 className="card-title mb-3">Meu Perfil</h5>

        {msg && <div className="alert alert-success py-2">{msg}</div>}
        {devLink && (
            <div className="alert alert-warning py-2">
                Link de DEV para confirmar e-mail:&nbsp;
                <a href={devLink}>{devLink}</a>
            </div>
        )}

        <form onSubmit={onSubmit} className="mb-4">
            <div className="mb-3">
                <label className="form-label">Nome</label>
                <input className="form-control" name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Telefone</label>
                <input className="form-control" name="phone" value={form.phone} onChange={onChange} />
            </div>
            <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input className="form-control" type="email" name="email" value={form.email} onChange={onChange} required />
                <div className="form-text">Se alterar, enviaremos um link para confirmar (ou use o link de dev).</div>
            </div>
            <button className="btn btn-primary" type="submit">Salvar</button>
        </form>

    <hr />

        <h6 className="mb-3">Trocar senha</h6>
        <form onSubmit={onChangePassword}>
            <div className="mb-2">
                <label className="form-label">Senha atual</label>
                <input className="form-control" type="password" name="current_password" required />
            </div>
            <div className="mb-2">
                <label className="form-label">Nova senha</label>
                <input className="form-control" type="password" name="password" required minLength={8} />
            </div>
            <div className="mb-3">
                    <label className="form-label">Confirmar nova senha</label>
                    <input className="form-control" type="password" name="password_confirmation" required minLength={8} />
            </div>
                <button className="btn btn-outline-primary" type="submit">Atualizar senha</button>
        </form>
            </div>
        </div>
    </div>
);
}