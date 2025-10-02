import { Link } from "react-router-dom";

export default function ImovelCard({ imovel }){
  const preco = (imovel.preco ?? 0) / 100;
  const foto = imovel.imagens?.[0] || "/assets/placeholder.jpg";
  return (
    <article className="imovel-card">
      <img src={foto} alt={imovel.titulo} loading="lazy" />
      <div className="info">
        <h3><Link to={`/imoveis/${imovel.id}`} style={{textDecoration:"none", color:"inherit"}}>{imovel.titulo}</Link></h3>
        <p style={{color:"var(--muted)", margin:"0 0 .5rem"}}>{imovel.endereco}</p>
        <div className="badges">
          <span className="badge primary">{(imovel.tipo||"").toUpperCase()}</span>
          <span className="badge">{(imovel.status||"").toUpperCase()}</span>
        </div>
        <p style={{margin:".25rem 0 .5rem", color:"var(--muted)"}}>
          {imovel.descricao}
        </p>
        <div className="price">R$ {preco.toLocaleString("pt-BR",{minimumFractionDigits:2})}</div>
      </div>
    </article>
  );
}
