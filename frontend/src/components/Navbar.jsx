import { useMemo, useState } from "react";
import {
  Link,
  NavLink,
  useInRouterContext,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/**
 * Header sem dependência de Tailwind — 100% React + CSS in JS (injetado).
 * - Evita o problema visual quando Tailwind não está configurado (como no seu print).
 * - Mantém fallback seguro para fora do Router (SmartLink).
 * - Rotas do seu projeto: /imoveis, /profile, /login, /register.
 * - Bordas arredondadas configuráveis (props rounded/radius).
 */

// ===== CSS base (injetado apenas uma vez)
let __cssInjected = false;
function injectBaseCss() {
  if (__cssInjected) return;
  const css = `
    /* ================= THEME (Brown) ================= */
    :root {
      --tc-surface: #f8f4f0; /* fundo claro puxado pro marrom */
      --tc-surface-alpha: rgba(248, 244, 240, 0.92);
      --tc-border: #e6ddd6; /* borda com leve tom amarronzado */
      --tc-fg: #2f251f; /* texto principal marrom escuro */
      --tc-muted: #6f5b4e; /* links padrão */
      --tc-accent: #8b5e34; /* marrom principal */
      --tc-accent-600: #7a4e2a;
      --tc-accent-700: #6b4021;
      --tc-hover: #f1e8e1; /* hover claro */
      --tc-shadow: 0 6px 24px rgba(0,0,0,0.06);
      --tc-white: #ffffff;
    }

  /* Shell sticky sem espaçamento superior; header sobrepõe levemente o conteúdo para exibir curvas */
  .tc-shell { position: sticky; top: 0; z-index: 40; padding: 0; background: transparent; }

  /* Levanta o header alguns pixels para sobrepor a imagem abaixo e mostrar bordas arredondadas */
  .tc-header { width: 100%; margin-top: -12px; background: var(--tc-surface-alpha); color: var(--tc-fg); border: 1px solid var(--tc-border); overflow: hidden; box-shadow: var(--tc-shadow); }
    .tc-container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
    .tc-row { height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }

    .tc-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; color: inherit; }
    .tc-logo { height: 32px; width: 32px; border: 1px solid var(--tc-border); border-radius: 12px; background: linear-gradient(135deg, rgba(139,94,52,.12), rgba(107,64,33,.12)); }
    .tc-brand-text { font-weight: 600; letter-spacing: -0.01em; }

    .tc-nav { display: none; align-items: center; gap: 24px; font-size: 14px; }
    .tc-nav a { text-decoration: none; color: var(--tc-muted); padding-bottom: 6px; transition: color .15s ease, box-shadow .15s ease; }
    .tc-nav a:hover { color: var(--tc-accent); box-shadow: inset 0 -2px 0 var(--tc-accent); }
    .tc-nav a[aria-current="page"] { color: var(--tc-accent); font-weight: 600; box-shadow: inset 0 -2px 0 var(--tc-accent); text-decoration: none; }

    .tc-actions { display: none; }

    .tc-btn { padding: 8px 16px; border-radius: 12px; font-size: 14px; cursor: pointer; border: 1px solid transparent; background: transparent; transition: background .15s ease, color .15s ease, border-color .15s ease, box-shadow .15s ease; }
    .tc-btn-outline { border-color: var(--tc-border); color: var(--tc-fg); background: var(--tc-white); }
    .tc-btn-outline:hover { background: var(--tc-hover); border-color: var(--tc-accent-600); }
    .tc-btn-primary { background: var(--tc-accent); color: var(--tc-white); border-color: var(--tc-accent); }
    .tc-btn-primary:hover { background: var(--tc-accent-600); border-color: var(--tc-accent-600); }

    .tc-account { position: relative; }
    .tc-account-btn { padding: 6px 12px; border-radius: 9999px; border: 1px solid var(--tc-border); background: var(--tc-white); cursor: pointer; transition: background .15s ease, border-color .15s ease, box-shadow .15s ease; }
    .tc-account-btn:hover { background: var(--tc-hover); border-color: var(--tc-accent-600); }
    .tc-account-menu { position: absolute; right: 0; margin-top: 8px; width: 224px; border: 1px solid var(--tc-border); background: var(--tc-white); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; }
    .tc-account-menu a, .tc-account-menu button { display: block; width: 100%; text-align: left; padding: 12px 16px; background: var(--tc-white); border: 0; cursor: pointer; font-size: 14px; color: var(--tc-fg); transition: background .15s ease; }
    .tc-account-menu a:hover, .tc-account-menu button:hover { background: var(--tc-hover); }

    .tc-mobile-btn { display: inline-flex; align-items: center; justify-content: center; padding: 8px; border: 1px solid var(--tc-border); border-radius: 12px; background: var(--tc-white); transition: background .15s ease, border-color .15s ease; }
    .tc-mobile-btn:hover { background: var(--tc-hover); border-color: var(--tc-accent-600); }

    .tc-mobile { display: none; border-top: 1px solid var(--tc-border); background: var(--tc-white); }
    .tc-mobile-inner { padding: 16px; max-width: 1200px; margin: 0 auto; }
    .tc-mobile-nav { display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
    .tc-mobile-nav a { padding: 8px 0; text-decoration: none; color: var(--tc-muted); transition: color .15s ease; }
    .tc-mobile-nav a:hover { color: var(--tc-accent); }
    .tc-mobile-actions { padding-top: 8px; }

    /* Acessibilidade: focus visible */
    a:focus-visible, button:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(139,94,52,0.35), 0 0 0 4px rgba(139,94,52,0.18); border-color: var(--tc-accent); }

    /* Breakpoint: md */
    @media (min-width: 768px) {
      .tc-nav { display: flex; }
      .tc-actions { display: block; }
      .tc-mobile-btn { display: none; }
    }
  `;
  const tag = document.createElement('style');
  tag.setAttribute('data-tc-header', '');
  tag.appendChild(document.createTextNode(css));
  document.head.appendChild(tag);
  __cssInjected = true;
}
// Link inteligente: usa Router quando disponível, senão <a>
function SmartLink({ to, children, className, nav = false, ...rest }) {
  const inRouter = useInRouterContext();
  const href = typeof to === "string" ? to : "#";

  if (inRouter) {
    if (nav) {
      return (
        <NavLink to={to} className={className} {...rest}>
          {children}
        </NavLink>
      );
    }
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  const pathname = (typeof window !== "undefined" && window.location && window.location.pathname) || "/";
  const ariaCurrent = pathname === href || (href !== "/" && pathname.startsWith(href)) ? "page" : undefined;

  return (
    <a href={href} className={className} aria-current={ariaCurrent} {...rest}>
      {children}
    </a>
  );
}

/** @typedef {{
 *  isAuthenticated?: boolean,
 *  userName?: string | null,
 *  onLogout?: () => void,
 *  contactHref?: string,
 *  secondaryCta?: { to: string, label: string } | null,
 *  routes?: { home?: string, vitrine?: string, profile?: string, login?: string, register?: string },
 *  rounded?: 'none' | 'bottom' | 'all',
 *  radius?: number,
 * }} HeaderProps */

const DEFAULT_ROUTES = { home: "/", vitrine: "/imoveis", profile: "/profile", login: "/login", register: "/register" };

export default function Header(/** @type {HeaderProps} */ props = {}) {
  injectBaseCss();

  const {
    isAuthenticated = false,
    userName = null,
    onLogout,
    contactHref = "/contato",
    secondaryCta = { to: "/profile", label: "Meu Perfil" },
    routes: routesProp = {},
    rounded = 'bottom',
    radius = 16,
  } = props;

  const routes = { ...DEFAULT_ROUTES, ...routesProp };
  const [isMobileOpen, setMobileOpen] = useState(false);

  const headerStyle = useMemo(() => {
    if (rounded === 'pill') return { borderRadius: 9999, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.06)' };
    if (rounded === 'all') return { borderRadius: radius, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.06)' };
    if (rounded === 'bottom') return { borderBottomLeftRadius: radius, borderBottomRightRadius: radius, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.06)' };
    return { boxShadow: '0 6px 24px rgba(0,0,0,0.06)' };
  }, [rounded, radius]);

  const handleLogout = () => {
    if (typeof onLogout === "function") {
      try { onLogout(); } catch (e) { console.error("onLogout falhou:", e); }
    }
    setMobileOpen(false);
  };

  const AuthButtons = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <SmartLink to={routes.login} className="tc-btn tc-btn-outline">Logar-se</SmartLink>
      <SmartLink to={routes.register} className="tc-btn tc-btn-primary">Registrar-se</SmartLink>
    </div>
  );

  const PrivateButtons = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <SmartLink to={contactHref} className="tc-btn tc-btn-outline">Entre em contato</SmartLink>
      {secondaryCta && (
        <SmartLink to={secondaryCta.to} className="tc-btn tc-btn-primary">{secondaryCta.label}</SmartLink>
      )}
      <button onClick={handleLogout} className="tc-btn tc-btn-outline">Sair</button>
    </div>
  );

  return (
    <div className="tc-shell">
      <header className="tc-header" style={headerStyle}>
      <div className="tc-container">
        <div className="tc-row">
          {/* Marca */}
          <SmartLink to={routes.home} className="tc-brand">
            <div className="tc-logo" />
            <span className="tc-brand-text">Tavares Corretora de Imóveis</span>
          </SmartLink>

          {/* Navegação (desktop) */}
          <nav className="tc-nav" aria-label="Principal">
              <SmartLink to={routes.vitrine} nav>Vitrine</SmartLink>
              {isAuthenticated && (
                <SmartLink to={routes.profile} nav>Meu Perfil</SmartLink>
              )}
            </nav>

          {/* Ações (desktop) */}
          <div className="tc-actions">{isAuthenticated ? <PrivateButtons /> : <AuthButtons />}</div>

          {/* Hamburguer (mobile) */}
          <button className="tc-mobile-btn" onClick={() => setMobileOpen(v => !v)} aria-label="Abrir menu" aria-expanded={isMobileOpen}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile */}
      {isMobileOpen && (
        <div className="tc-mobile">
          <div className="tc-mobile-inner">
            <nav className="tc-mobile-nav" aria-label="Menu móvel">
                <SmartLink to={routes.vitrine} nav>Vitrine</SmartLink>
                {isAuthenticated && (
                  <SmartLink to={routes.profile} nav>Meu Perfil</SmartLink>
                )}
              </nav>
            <div className="tc-mobile-actions" style={{ marginTop: 8 }}>
              {isAuthenticated ? <PrivateButtons /> : <AuthButtons />}
            </div>
          </div>
        </div>
      )}
    </header>
    </div>
  );
}

/* ==================== TEST CASES ====================
1) Fora do Router (NÃO DEVE QUEBRAR):
   <Header />

2) Fora do Router, autenticado (NÃO DEVE QUEBRAR):
   <Header isAuthenticated userName="Iza" />

3) Dentro do Router com rotas do SEU projeto:
   <HeaderTest_WithRouter_UserRoutes />

4) onLogout indefinido (NÃO DEVE QUEBRAR):
   <Header isAuthenticated userName="Iza" />

5) onLogout válido (deve ser chamado):
   <Header isAuthenticated userName="Iza" onLogout={() => console.log("logout ok")} />

6) Bordas arredondadas TODAS (24px):
   <Header rounded="all" radius={24} />

7) Header formato "pill" (super arredondado):
   <Header rounded="pill" />

8) Sem bordas arredondadas:
   <Header rounded="none" />
====================================================== */

// ===== Demos =====
export function HeaderTest_NoRouter_Anon() { return <Header />; }
export function HeaderTest_NoRouter_Auth() { return <Header isAuthenticated userName="Iza" onLogout={() => console.log("logout")} />; }
export function HeaderTest_WithRouter_UserRoutes() {
  return (
    <BrowserRouter>
      <Header rounded="pill" routes={{ vitrine: "/imoveis", profile: "/profile", login: "/login", register: "/register" }} />
      <main style={{ padding: 16, fontSize: 14 }}>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/imoveis" element={<div>Vitrine de imóveis</div>} />
          <Route path="/profile" element={<div>Meu Perfil</div>} />
          <Route path="/login" element={<div>Página de Login</div>} />
          <Route path="/register" element={<div>Página de Cadastro</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

// Verificação visual rápida de duplicados
export function HeaderTest_NoDup_Unauth() {
  return (
    <BrowserRouter>
      <Header isAuthenticated={false} rounded="pill" routes={{ vitrine: "/imoveis", profile: "/profile", login: "/login", register: "/register" }} />
    </BrowserRouter>
  );
}
export function HeaderTest_NoDup_Auth() {
  return (
    <BrowserRouter>
      <Header isAuthenticated userName="Iza" rounded="pill" routes={{ vitrine: "/imoveis", profile: "/profile", login: "/login", register: "/register" }} />
    </BrowserRouter>
  );
}
