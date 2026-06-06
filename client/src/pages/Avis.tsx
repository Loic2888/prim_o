import { useNavigate, useLocation } from 'react-router-dom';

export default function Avis() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  return (
    <div>
      <div className="faq-topbar">
        <button className="back-btn" onClick={() => navigate(from, { state: { reopenMenu: true } })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour
        </button>
        <h1 className="faq-topbar-title">Nous noter</h1>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <p className="empty-state">Fonctionnalité à venir.</p>
      </div>
    </div>
  );
}
