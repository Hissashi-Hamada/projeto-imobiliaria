import { useState } from "react";
import useApi from "@/hooks/useApi";

export default function Login() {
    const api = useApi();
    const [form, setForm] = useState({ email: "", password: "" });
    const [err, setErr] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await api.login(form);
          localStorage.setItem("token", res.token); // salva token
          window.location.href = "/imoveis"; // redireciona
        } catch (error) {
            setErr(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Senha"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit">Entrar</button>
            {err && <p style={{ color: "red" }}>{err}</p>}
        </form>
    );
}
