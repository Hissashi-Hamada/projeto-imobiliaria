import { api } from "../lib/api";

// REGISTRAR (rota web, sem /api)
export async function registrarUsuario({ name, email, password, password_confirmation }) {
  await api.get("/sanctum/csrf-cookie");   // handshake CSRF
  const { data } = await api.post("/register", {
    name, email, password, password_confirmation
  });
  return data;
}

// LOGIN (sessão/cookie)
export async function login({ email, password }) {
  await api.get("/sanctum/csrf-cookie");
  const { data } = await api.post("/login", { email, password });
  return data;
}

// LOGOUT
export async function logout() {
  await api.post("/logout");
}

// PEGAR USUÁRIO LOGADO (protegidO por auth:sanctum)
export async function getUser() {
  const { data } = await api.get("/api/user"); // 401 se não estiver logada
  return data;
}
