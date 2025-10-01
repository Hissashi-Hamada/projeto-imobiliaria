export default function useApi(){
    const baseURL = "http://localhost:8000/api";

    async function req(path, opts={}){
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(opts.headers || {})
        };
    
            const res = await fetch(baseURL + path, { ...opts, headers });
        if(!res.ok){
            const text = await res.text().catch(()=> "");
            throw new Error(`API ${res.status}: ${text || res.statusText}`);
        }
        return res.json();
    }


    return {
      // imóveis
        listImoveis: (p={}) => req("/imoveis?" + new URLSearchParams(p).toString()),
        getImovel: (id) => req(`/imoveis/${id}`),
        createImovel: (data) => req("/imoveis", { method:"POST", body: JSON.stringify(data)}),
        updateImovel: (id,data) => req(`/imoveis/${id}`, { method:"PUT", body: JSON.stringify(data)}),
        deleteImovel: (id) => req(`/imoveis/${id}`, { method:"DELETE" }),

      // auth e perfil
        register: (data) => req('/register', { method:'POST', body: JSON.stringify(data) }),
        login: (data) => req('/login', { method:'POST', body: JSON.stringify(data) }),
        logout: () => req('/logout', { method:'POST' }),
        profile: () => req('/profile'),
        updateProfile: (data) => req('/profile', { method:'PUT', body: JSON.stringify(data) }),
    };
}
