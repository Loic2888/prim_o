import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';

/* ── Inline SVG icons ─────────────────────────────────── */
function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function IconCatalogue() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}
function IconComptes() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconHistorique() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconPanier({ count }: { count: number }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span style={{
          position: 'absolute', top: -6, right: -8,
          background: 'var(--primary)', color: '#fff',
          fontSize: '0.6rem', fontWeight: 700, borderRadius: '999px',
          minWidth: 16, height: 16, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '0 3px',
        }}>{count}</span>
      )}
    </div>
  );
}
function IconBuilding() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  );
}
function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function IconTicket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z" />
      <line x1="9" y1="9" x2="9" y2="15" strokeDasharray="1 2" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function IconService() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.13 1 .38 1.97.72 2.9a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.18-1.18a2 2 0 012.11-.45c.93.34 1.9.59 2.9.72A2 2 0 0122 14.92v2z" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/* ── Component ────────────────────────────────────────── */
export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  function active(path: string) {
    return location.pathname.startsWith(path);
  }
  function go(path: string) { navigate(path); }

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  }

  /* ── Items selon le rôle ── */
  const isAdmin = user?.role === 'admin';

  const items = isAdmin
    ? [
        { label: 'Menu',        icon: <IconMenu />,      onClick: () => setMenuOpen(true), isActive: menuOpen },
        { label: 'Entreprises', icon: <IconBuilding />,  onClick: () => go('/admin/dashboard'), isActive: active('/admin/dashboard') },
        { label: 'Catalogue',   icon: <IconCatalogue />, onClick: () => go('/catalogue'),       isActive: active('/catalogue') },
        { label: 'Dashboard',   icon: <IconDashboard />, onClick: () => go('/admin/stats'),     isActive: active('/admin/stats') },
        { label: 'Bons',        icon: <IconTicket />,    onClick: () => go('/admin/bons'),      isActive: active('/admin/bons') },
      ]
    : [
        { label: 'Menu',       icon: <IconMenu />,                    onClick: () => setMenuOpen(true),    isActive: menuOpen },
        { label: 'Catalogue',  icon: <IconCatalogue />,               onClick: () => go('/catalogue'),     isActive: active('/catalogue') },
        { label: 'Comptes',    icon: <IconComptes />,                 onClick: () => go(user?.role === 'employer' ? '/employer/dashboard' : '/profil'), isActive: active('/employer/dashboard') || active('/profil') },
        { label: 'Historique', icon: <IconHistorique />,              onClick: () => go('/historique'),    isActive: active('/historique') },
        { label: 'Panier',     icon: <IconPanier count={count} />,    onClick: () => go('/panier'),        isActive: active('/panier') },
      ];

  return (
    <>
      <nav className="bottom-nav">
        {items.map((item) => (
          <button
            key={item.label}
            className={`bottom-nav-item ${item.isActive ? 'bottom-nav-item--active' : 'bottom-nav-item--inactive'}`}
            onClick={item.onClick}
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Menu sheet ── */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="menu-sheet-handle" />
            {user && (
              <div className="menu-sheet-user">
                <div className="menu-sheet-avatar">
                  {(user.first_name || user.name).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="menu-sheet-name">{user.first_name || user.name}</p>
                  <p className="menu-sheet-email">{user.email}</p>
                  <span className="menu-sheet-role">{user.role}</span>
                </div>
              </div>
            )}
            <div className="menu-divider" />
            <div className="menu-sheet-actions">
              <button className="menu-sheet-action" onClick={() => { setMenuOpen(false); go('/parametres'); }}>
                <span className="menu-sheet-action-icon"><IconSettings /></span>
                Paramètres
              </button>
              <button className="menu-sheet-action" onClick={() => { setMenuOpen(false); go('/service'); }}>
                <span className="menu-sheet-action-icon"><IconService /></span>
                Service client
              </button>
              <button className="menu-sheet-action menu-sheet-action--danger" onClick={handleLogout}>
                <span className="menu-sheet-action-icon"><IconLogout /></span>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
