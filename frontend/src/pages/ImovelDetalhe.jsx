import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useApi from "@/hooks/useApi";

export default function ImovelDetalhe() {
    const { id } = useParams();
    const api = useApi();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
    setLoading(true);
    api.getImovel(id)
        .then(setData)
        .catch(e => setErr(e.message))
        .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Carregando…</p>;
    if (err) return <p style={{ color: "crimson" }}>{err}</p>;
    if (!data) return <p>Nenhum dado encontrado.</p>;

    const preco = (data.preco ?? 0) / 100;

    return (
    <section className="detalhe">
        <Link to="/imoveis">← Voltar</Link>
        <h2>{data.titulo}</h2>
        <p><strong>Endereço:</strong> {data.endereco}</p>
        <p><strong>Tipo:</strong> {data.tipo}</p>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Descrição:</strong> {data.descricao}</p>
        <h3>Preço: R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
        {data.imagens?.length > 0 && (
        <div className="galeria">
            {data.imagens.map((img, i) => (
            <img key={i} src={img} alt={`foto-${i}`} width="300" />
            ))}
        </div>
        )}
    </section>
    );
}
