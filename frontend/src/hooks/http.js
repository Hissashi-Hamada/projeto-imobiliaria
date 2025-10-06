import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:8000", // sem /api aqui
  withCredentials: true,
});
let gotCsrf = false;
api.interceptors.request.use(async (config) => {
  const needs = /post|put|patch|delete/i.test(config.method);
  if (needs && !gotCsrf) { await api.get("/sanctum/csrf-cookie"); gotCsrf = true; }
  return config;
});
export default api;
