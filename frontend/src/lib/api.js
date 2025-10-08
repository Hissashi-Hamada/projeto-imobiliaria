// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,            // envia/recebe cookies (XSRF-TOKEN, laravel_session)
  xsrfCookieName: "XSRF-TOKEN",     // ajuda o axios a identificar o cookie
  xsrfHeaderName: "X-XSRF-TOKEN",   // nome do header que o Laravel lê
});

// Garante o header X-XSRF-TOKEN mesmo em cross-origin
api.interceptors.request.use((config) => {
  const m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
  const xsrf = m ? decodeURIComponent(m[1]) : null;
  if (xsrf) {
    config.headers["X-XSRF-TOKEN"] = xsrf;
    // opcional: envia também esse alias que o Laravel aceita
    config.headers["X-CSRF-TOKEN"] = xsrf;
  }
  return config;
});

export default api;
