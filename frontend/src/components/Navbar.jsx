// frontend/src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Navbar(){
  const { pathname } = useLocation();
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="dot" />
          <span>Tavares Coretora De Imoveis </span>
        </div>
        <nav className="nav-links">
          <Link className="nav-link" to="/imoveis"  aria-current={pathname.startsWith("/imoveis")?"page":undefined}>Vitrine</Link>
          <Link className="nav-link" to="/profile"  aria-current={pathname==="/profile"?"page":undefined}>Meu Perfil</Link>
          <Link className="nav-link" to="/login"    aria-current={pathname==="/login"?"page":undefined}>Logar-se</Link>
          <Link className="nav-link" to="/register" aria-current={pathname==="/register"?"page":undefined}>Registrar-se</Link>
        </nav>
      </div>
    </header>
  );
}
