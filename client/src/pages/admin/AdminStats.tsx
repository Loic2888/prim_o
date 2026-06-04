import { useState, useEffect } from 'react';
import { companyService } from '../../services/company.service';
import { marketplaceService } from '../../services/marketplace.service';

interface Stats {
  companies: number;
  vouchers: number;
  redeemed: number;
  available: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      companyService.getAll(),
      marketplaceService.adminGetVouchers(),
      marketplaceService.adminGetHistory(),
    ])
      .then(([companies, vouchers, history]) => {
        setStats({
          companies: companies.length,
          vouchers: vouchers.length,
          redeemed: history.length,
          available: vouchers.filter(v => v.available).length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)' }}>Chargement…</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <p className="stat-label">Entreprises</p>
          <p className="stat-value">{stats?.companies ?? 0}</p>
          <p className="stat-sub">enregistrées</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Bons d'achat</p>
          <p className="stat-value">{stats?.vouchers ?? 0}</p>
          <p className="stat-sub">{stats?.available ?? 0} disponibles</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Rachats totaux</p>
          <p className="stat-value">{stats?.redeemed ?? 0}</p>
          <p className="stat-sub">bons échangés</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Taux de rachat</p>
          <p className="stat-value">
            {stats && stats.vouchers > 0
              ? Math.round((stats.redeemed / stats.vouchers) * 100)
              : 0}%
          </p>
          <p className="stat-sub">rachats / bons créés</p>
        </div>
      </div>
    </div>
  );
}
