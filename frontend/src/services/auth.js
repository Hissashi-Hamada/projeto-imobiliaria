import api from "@/lib/api";

export async function getCsrf() {
  await api.get("/sanctum/csrf-cookie");
}

export async function login(email, password) {
  await getCsrf();
  await api.post("/api/login", { email, password });
  const { data } = await api.get("/api/me");
  return data;
}

export async function register(payload) {
  await getCsrf();
  await api.post("/api/register", payload);
  const { data } = await api.get("/api/me");
  return data;
}

export async function logout() {
  await api.post("/api/logout");
}

export async function me() {
  const { data } = await api.get("/api/me");
  return data;
}

