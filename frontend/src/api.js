import axios from "axios"; // ← essa linha vem no topo

const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost";

export const api = axios.create({
    baseURL: `${BASE}/api`,
    withCredentials: true,
});

export async function ensureCsrf() {
    await api.get("/sanctum/csrf-cookie", { baseURL: BASE });
}