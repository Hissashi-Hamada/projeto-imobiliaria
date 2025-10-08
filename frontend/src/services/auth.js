// src/services/auth.js
import api from "@/lib/api";

export async function login(email, password) {
  // 1) Garante os cookies XSRF-TOKEN e laravel_session
  await api.get("/sanctum/csrf-cookie");

  try {
    // 2) Faz o POST /login já com X-XSRF-TOKEN injetado pelo interceptor
    const { data } = await api.post("/login", { email, password });
    return data;
  } catch (err) {
    // Normaliza mensagem
    const status = err?.response?.status;
    const payload = err?.response?.data;

    if (status === 419) {
      throw new Error("Sessão expirada ou CSRF inválido. Atualize a página e tente novamente.");
    }
    if (status === 422) {
      // validação (ex.: credenciais inválidas no Fortify)
      const msg =
        payload?.message ||
        payload?.errors?.email?.[0] ||
        payload?.errors?.password?.[0] ||
        "Email ou senha inválidos.";
      throw new Error(msg);
    }
    if (status === 401) {
      throw new Error(payload?.message || "Não autorizado. Verifique suas credenciais.");
    }
    throw new Error(payload?.message || "Erro ao entrar. Tente novamente.");
  }
}

export async function logout() {
  await api.post("/logout"); // se estiver usando rotas web/fortify
}
