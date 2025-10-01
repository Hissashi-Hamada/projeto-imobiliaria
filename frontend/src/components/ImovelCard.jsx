export default function ImovelCard({ imovel }){
  const preco = (imovel.preco ?? 0) / 100;
  const foto = imovel.imagens?.[0] || "/assets/placeholder.jpg";
  return (
    <article className="imovel-card">
      <img src={foto} alt={imovel.titulo} loading="lazy" />
      <div className="info">
        <h3>{imovel.titulo}</h3>
        <p>{imovel.endereco}</p>
        <p>{imovel.descricao}</p>
        <p><strong>{imovel.tipo?.toUpperCase()}</strong> • {imovel.status?.toUpperCase()}</p>
        <h4>R$ {preco.toLocaleString("pt-BR",{minimumFractionDigits:2})}</h4>
      </div>
    </article>
  );
}
