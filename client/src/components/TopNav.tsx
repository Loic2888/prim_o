import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';

export default function TopNav() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    function close(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  async function handleLogout() {
    setDropOpen(false);
    await logout();
    navigate('/login');
  }

  function link(isActive: boolean) {
    return `top-nav-link${isActive ? ' top-nav-link--active' : ''}`;
  }

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        {/* Brand */}
        <span className="top-nav-brand">PRIM'O</span>

        {/* Links — admin vs other roles */}
        <nav className="top-nav-links">
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => link(isActive)}>Entreprises</NavLink>
              <NavLink to="/catalogue"       className={({ isActive }) => link(isActive)}>Catalogue</NavLink>
              <NavLink to="/admin/stats"     className={({ isActive }) => link(isActive)}>Dashboard</NavLink>
              <NavLink to="/admin/bons"      className={({ isActive }) => link(isActive)}>Bons d'achat</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/catalogue"  className={({ isActive }) => link(isActive)}>Catalogue</NavLink>
              <NavLink to={user?.role === 'employer' ? '/employer/dashboard' : '/profil'} className={({ isActive }) => link(isActive)}>Comptes</NavLink>
              <NavLink to="/historique" className={({ isActive }) => link(isActive)}>Historique</NavLink>
              <NavLink to="/panier"     className={({ isActive }) => link(isActive)}>
                Panier
                {count > 0 && <span className="top-nav-badge">{count}</span>}
              </NavLink>
            </>
          )}
        </nav>

        {/* User menu */}
        <div className="top-nav-user" ref={dropRef}>
          <button
            className="top-nav-avatar"
            onClick={() => setDropOpen((v) => !v)}
            aria-label="Menu utilisateur"
          >
            {(user?.first_name || user?.name || '?').charAt(0).toUpperCase()}
          </button>

          {dropOpen && (
            <div className="top-nav-dropdown">
              <div className="top-nav-drop-user">
                <p className="top-nav-drop-name">{user?.first_name || user?.name}</p>
                <p className="top-nav-drop-email">{user?.email}</p>
                <span className="menu-sheet-role">{user?.role}</span>
              </div>
              <div className="top-nav-drop-divider" />
              <button
                className="top-nav-drop-item"
                onClick={() => { setDropOpen(false); navigate('/parametres'); }}
              >
                Paramètres
              </button>
              <button
                className="top-nav-drop-item"
                onClick={() => { setDropOpen(false); navigate('/service'); }}
              >
                Service client
              </button>
              <button
                className="top-nav-drop-item top-nav-drop-item--danger"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
