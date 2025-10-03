// frontend/src/pages/Vitrine.jsx
import hero from "@/assets/casa-de-madeira-fotorrealista-com-estrutura-de-madeira.jpg";
import "@/styles/pages/vitrine.css";

export default function Vitrine() {
  return (
    <section
      className="vitrine-hero"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="hero-content">
        <h1>Tavares Coretora De Imoveis</h1>
        <p>Casas, apartamentos e terrenos selecionados para você.</p>
        
        {/* Barra de filtros */}
        <div className="filters-wrap">
          <input type="text" placeholder="Buscar por título, endereço..." />
          <select>
            <option value="todos">Negócio (todos)</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
          <select>
            <option value="todos">Tipo (todos)</option>
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
            <option value="apartamento">Apartamento</option>
          </select>
          <select>
            <option value="recente">Mais recentes</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
          </select>
          <button className="btn-primary">Pesquisar</button>
        </div>
      </div>
    </section>
  );
}
