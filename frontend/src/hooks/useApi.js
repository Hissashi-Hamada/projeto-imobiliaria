export default function useApi(){
  const baseURL = "http://localhost:8000/api";
  async function req(path, opts={}){
    const res = await fetch(baseURL + path, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    if(!res.ok){
      const text = await res.text().catch(()=> "");
      throw new Error(`API ${res.status}: ${text || res.statusText}`);
    }
    return res.json();
  }
  return {
    listImoveis: (p={}) => req("/imoveis?" + new URLSearchParams(p).toString()),
    getImovel: (id) => req(`/imoveis/${id}`),
    createImovel: (data) => req("/imoveis", { method:"POST", body: JSON.stringify(data)}),
    updateImovel: (id,data) => req(`/imoveis/${id}`, { method:"PUT", body: JSON.stringify(data)}),
    deleteImovel: (id) => req(`/imoveis/${id}`, { method:"DELETE" }),
  };
}
