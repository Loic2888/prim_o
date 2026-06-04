import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <TopNav />

      {/* Mobile only — sticky brand bar */}
      <header className="top-bar">
        <span className="top-bar-brand">PRIM'O</span>

        {user && (
          <div className="top-bar-right">
            {user.role === 'employer' && (
              <button
                className="top-bar-buy"
                onClick={() => navigate('/abonnement')}
                aria-label="Acheter des tokens"
              >
                + Acheter
              </button>
            )}
            <div className="top-bar-tokens">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{user.token_balance ?? 0}</span>
            </div>
          </div>
        )}
      </header>

      <main className="app-main">{children}</main>

      <BottomNav />
    </div>
  );
}
