import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import ImovelCard from "@/components/ImovelCard";

export default function Vitrine(){
  const api = useApi();
  const [status,setStatus] = useState("todos");
  const [tipo,setTipo]     = useState("todos");
  const [busca,setBusca]   = useState("");
  const [ordem,setOrdem]   = useState("recente");
  const [page,setPage]     = useState(1);
  const per_page = 6;

  const [data,setData]     = useState(null);
  const [loading,setLoading] = useState(false);
  const [err,setErr]       = useState("");

  useEffect(()=>{ setPage(1); }, [status,tipo,busca,ordem]);

  useEffect(()=>{
    setLoading(true); setErr("");
    api.listImoveis({ q:busca, status, tipo, ordem, page, per_page })
      .then(setData)
      .catch(e => setErr(e.message))
      .finally(()=> setLoading(false));
  }, [status,tipo,busca,ordem,page]);

  const list = data?.data || [];
  const totalPages = data?.last_page || 1;

  return (
    <section className="vitrine">
<header className="controls">
  <input placeholder="Buscar por título, endereço..." value={busca} onChange={e=>setBusca(e.target.value)}/>
  <select value={status} onChange={e=>setStatus(e.target.value)}>
    <option value="todos">Negócio (todos)</option>
    <option value="venda">Venda</option>
    <option value="aluguel">Aluguel</option>
  </select>
  <select value={tipo} onChange={e=>setTipo(e.target.value)}>
    <option value="todos">Tipo (todos)</option>
    <option value="casa">Casa</option>
    <option value="terreno">Terreno</option>
    <option value="apartamento">Apartamento</option>
  </select>
  <select value={ordem} onChange={e=>setOrdem(e.target.value)}>
    <option value="recente">Mais recentes</option>
    <option value="menor-preco">Menor preço</option>
    <option value="maior-preco">Maior preço</option>
  </select>
  <button className="btn-primary" onClick={()=>setPage(1)}>Pesquisar</button> 
</header>


      {loading && <p>Carregando…</p>}
      {err && <p style={{color:"crimson"}}>{err}</p>}

      <div className="grid">
        {list.map(i => <ImovelCard key={i.id} imovel={i}/>)}
      </div>

      <nav className="paginacao">
        <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Anterior</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Próxima</button>
      </nav>
    </section>
  );
}
