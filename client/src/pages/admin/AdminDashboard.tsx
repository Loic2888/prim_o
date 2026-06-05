import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/company.service';
import type { Company } from '../../types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    companyService
      .getAll()
      .then(setCompanies)
      .catch(() => setError('Impossible de charger les entreprises.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)' }}>Chargement…</div>;

  const totalTokens = companies.reduce((sum, c) => sum + c.token_balance, 0);

  return (
    <div>
      <div className="page-header">
        <h1>Administration</h1>
        <p>Bienvenue, {user?.name}</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="grid-3" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <p className="stat-label">Entreprises</p>
          <p className="stat-value">{companies.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Tokens en circulation</p>
          <p className="stat-value">{totalTokens}</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 600 }}>
          Entreprises
        </h2>
        {companies.length === 0 ? (
          <p className="empty-state">Aucune entreprise enregistrée.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Ville</th>
                  <th>Tokens disponibles</th>
                  <th>Créée le</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.city ?? '—'}</td>
                    <td>
                      <span className="token-badge">{c.token_balance}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(c.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
