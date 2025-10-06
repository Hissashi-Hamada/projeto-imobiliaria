const baseURL = "http://127.0.0.1:8000/api";

async function req(path, opts = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        ...(opts.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers || {})
    };

    const res = await fetch(baseURL + path, { ...opts, headers, credentials: "include" });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || res.statusText);
    }
    return res.status === 204 ? null : res.json();
}

export default function useApi() {
    return {
        // auth
        register: (d) => req("/register", { method: "POST", body: JSON.stringify(d) }),
        login:    (d) => req("/login",    { method: "POST", body: JSON.stringify(d) }),
        logout:   ()  => req("/logout",   { method: "POST" }),
        profile:  ()  => req("/profile"),
        updateProfile: (data) => req("/profile", { method: "PUT", body: JSON.stringify(data) }),

        // imóveis
        listImoveis: (p = {}) => req("/imoveis?" + new URLSearchParams(p)),
        getImovel:   (id)     => req(`/imoveis/${id}`),
    };
}
