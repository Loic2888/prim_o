import { useAuth } from '../context/AuthContext';

export default function TokenBalance() {
  const { user } = useAuth();

  return (
    <div className="stat-card">
      <p className="stat-label">Mes tokens</p>
      <p className="stat-value">{user?.token_balance ?? 0}</p>
      <p className="stat-sub">disponibles à l'échange</p>
    </div>
  );
}
