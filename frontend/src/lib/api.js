// src/lib/api.js
import axios from "axios";

function getCookie(name) {
  const m = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return m ? m[1] : null;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? "http://localhost:8000",
  withCredentials: true,
});

// Injeta o XSRF do cookie no cabeçalho esperado pelo Laravel
api.interceptors.request.use((config) => {
  const xsrf = getCookie("XSRF-TOKEN");
  if (xsrf) config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrf);
  return config;
});

export default api;
