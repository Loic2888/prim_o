import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";

export default function TopNav() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    function close(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function handleLogout() {
    setDropOpen(false);
    await logout();
    navigate("/login");
  }

  function link(isActive: boolean) {
    return `top-nav-link${isActive ? " top-nav-link--active" : ""}`;
  }

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        {/* Brand */}
        <span className="top-nav-brand">PRIM'O</span>

        {/* 1. Les liens (Gauche) */}
        <nav className="top-nav-links">
          {isAdmin ? (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => link(isActive)}
              >
                Entreprises
              </NavLink>
              <NavLink
                to="/catalogue"
                className={({ isActive }) => link(isActive)}
              >
                Catalogue
              </NavLink>
              <NavLink
                to="/admin/stats"
                className={({ isActive }) => link(isActive)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/bons"
                className={({ isActive }) => link(isActive)}
              >
                Bons d'achat
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={
                  user?.role === "employer"
                    ? "/employer/dashboard"
                    : "/pour-toi"
                }
                className={({ isActive }) => link(isActive)}
              >
                Pour toi
              </NavLink>
              <NavLink
                to="/catalogue"
                className={({ isActive }) => link(isActive)}
              >
                Catalogue
              </NavLink>
              <NavLink
                to="/historique"
                className={({ isActive }) => link(isActive)}
              >
                Historique
              </NavLink>
              <NavLink
                to="/panier"
                className={({ isActive }) => link(isActive)}
              >
                Panier
                {count > 0 && <span className="top-nav-badge">{count}</span>}
              </NavLink>
            </>
          )}

          {/* 2. Le menu "Voir plus" (Juste après le nav) */}
          <div className="top-nav-user" ref={dropRef}>
            <button
              className="top-nav-more-btn"
              onClick={() => setDropOpen((v) => !v)}
              aria-label="Voir plus"
            >
              Voir plus
            </button>
            {dropOpen && (
              <div className="top-nav-dropdown">
                <div className="top-nav-drop-user">
                  <p className="top-nav-drop-name">
                    {user?.first_name || user?.name}
                  </p>
                  <p className="top-nav-drop-email">{user?.email}</p>
                </div>
                <div className="top-nav-divider" />
                {[
                  { label: "Paramètres", path: "/parametres" },
                  { label: "Mes informations", path: "/mes-informations" },
                  { label: "Mot de passe", path: "/mot-de-passe" },
                  { label: "Aide", path: "/service" },
                ].map((item) => (
                  <button
                    key={item.path}
                    className="top-nav-drop-item"
                    onClick={() => {
                      setDropOpen(false);
                      navigate(item.path);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  className="top-nav-drop-item top-nav-drop-item--danger"
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </nav>
        {/* 3. Le bouton Acheter + solde (le plus à droite possible) */}
        {user?.role === "employer" && (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* 1. Bouton Acheter (à gauche du solde) */}
            <NavLink to="/abonnement" className="btn btn-primary">
              Acheter des tokens
            </NavLink>

            {/* 2. Affichage du solde (tout à droite) */}
            <div
              style={{
                color: "rgba(255, 255, 255, 0.75)",
                fontSize: "0.88rem",
                fontWeight: 500,
              }}
            >
              Solde :{" "}
              <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                {user?.token_balance ?? 0}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
