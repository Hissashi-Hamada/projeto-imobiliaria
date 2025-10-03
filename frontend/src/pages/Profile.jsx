import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";

export default function Profile(){
const api = useApi();

const [loading, setLoading] = useState(true);
const [err, setErr] = useState("");
const [ok, setOk] = useState("");

const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
});

    useEffect(() => {
    (async () => {
        try {
        const me = await api.profile(); // GET /api/profile (precisa token no localStorage)
        setForm(f => ({
            ...f,
            name:  me.name  ?? "",
            email: me.email ?? "",
            phone: me.phone ?? "",
        }));
        } catch (e) {
            setErr("Faça login para acessar o perfil.");
        } finally {
            etLoading(false);
        }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onChange(e){
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    }

    async function onSubmit(e){
    e.preventDefault();
    setErr(""); setOk("");

    if (form.password && form.password !== form.password_confirmation){
        return setErr("As senhas não coincidem.");
    }

    try {
        const payload = {
        name: form.name,
        phone: form.phone,
        };
      if (form.email)    payload.email    = form.email;     // permitir trocar email (opcional)
      if (form.password) payload.password = form.password;  // só envia se quiser trocar senha

      await api.updateProfile(payload); // PUT /api/profile
        setOk("Perfil atualizado com sucesso!");
      setForm(f => ({ ...f, password:"", password_confirmation:"" })); // limpa campos de senha
    } catch (e2) {
        setErr(e2.message || "Erro ao atualizar perfil.");
    }
}

    if (loading) return <div style={{padding:"1rem"}}>Carregando...</div>;

    return (
    <div style={{maxWidth:720, margin:"18px auto", padding:"0 16px"}}>
        <h2 style={{margin:"8px 0 18px"}}>Meu Perfil</h2>

        {err && <div style={{color:"crimson", marginBottom:10}}>{err}</div>}
        {ok  && <div style={{color:"seagreen", marginBottom:10}}>{ok}</div>}

    <form onSubmit={onSubmit} className="form" style={{display:"grid", gap:12}}>
        <div className="mb-3">
            <label>Nome</label>
            <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="form-control"
                style={{height:44, width:"100%"}}
                required
            />
        </div>

        <div className="mb-3">
            <label>Email</label>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="form-control"
                style={{height:44, width:"100%"}}
            />
        </div>

        <div className="mb-3">
            <label>Telefone</label>
            <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="form-control"
                placeholder="(11) 90000-0000"
                style={{height:44, width:"100%"}}
            />
        </div>

        <hr style={{margin:"6px 0 6px"}} />

        <div className="mb-3">
            <label>Nova senha (opcional)</label>
            <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="form-control"
                style={{height:44, width:"100%"}}
                placeholder="Deixe vazio para não alterar"
            />
        </div>

        <div className="mb-3">
            <label>Confirmar nova senha</label>
            <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={onChange}
                className="form-control"
                style={{height:44, width:"100%"}}
            />
        </div>

            <button type="submit" className="btn-primary" style={{height:44}}>
                Salvar alterações
            </button>
        </form>
    </div>
);
}