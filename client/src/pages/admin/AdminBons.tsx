import { useState, useEffect, useCallback } from 'react';
import { marketplaceService } from '../../services/marketplace.service';
import type { AdminVoucher, AdminRedemption } from '../../types';

type Tab = 'gerer' | 'historique' | 'top';

function fmt(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Onglet Gérer ── */
function OngletGerer() {
  const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState('');
  const [title, setTitle]     = useState('');
  const [cost, setCost]       = useState('');
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    marketplaceService.adminGetVouchers().then(setVouchers).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!partner.trim() || !title.trim() || !cost) return;
    setSaving(true);
    try {
      await marketplaceService.createItem({ partner: partner.trim(), title: title.trim(), token_cost: Number(cost) });
      setSuccess('Bon ajouté avec succès.');
      setPartner(''); setTitle(''); setCost('');
      load();
    } catch {
      setError('Erreur lors de l\'ajout du bon.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce bon définitivement ?')) return;
    try {
      await marketplaceService.deleteItem(id);
      load();
    } catch {
      setError('Erreur lors de la suppression.');
    }
  }

  async function handleToggle(v: AdminVoucher) {
    try {
      await marketplaceService.updateItem(v.id, { available: !v.available });
      load();
    } catch {
      setError('Erreur lors de la mise à jour.');
    }
  }

  if (loading) return <p className="empty-state">Chargement…</p>;

  return (
    <div>
      {/* Formulaire d'ajout */}
      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Ajouter un bon d'achat</p>
        <form onSubmit={handleAdd}>
          <div className="grid-2" style={{ marginBottom: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Partenaire</label>
              <input className="form-input" placeholder="Fnac, Amazon…" value={partner} onChange={e => setPartner(e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Titre</label>
              <input className="form-input" placeholder="Bon d'achat 20 €" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
          </div>
          <div className="form-group" style={{ maxWidth: 200 }}>
            <label className="form-label">Coût en tokens</label>
            <input className="form-input" type="number" min="1" placeholder="100" value={cost} onChange={e => setCost(e.target.value)} required />
          </div>
          {error   && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Ajout…' : '+ Ajouter'}
          </button>
        </form>
      </div>

      {/* Liste des bons */}
      <div className="card">
        <p style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>
          {vouchers.length} bon{vouchers.length > 1 ? 's' : ''} au total
        </p>
        {vouchers.length === 0 ? (
          <p className="empty-state">Aucun bon enregistré.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Partenaire</th>
                  <th>Titre</th>
                  <th>Tokens</th>
                  <th>Rachats</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.partner}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{v.title}</td>
                    <td><span className="token-badge">{v.token_cost}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {v.redemptions?.length ?? 0}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggle(v)}
                        style={{
                          fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px',
                          borderRadius: 999, border: 'none', cursor: 'pointer',
                          background: v.available ? '#dcfce7' : '#fee2e2',
                          color: v.available ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {v.available ? 'Disponible' : 'Indispo'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Supprimer
                      </button>
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

/* ── Onglet Historique ── */
function OngletHistorique({ data }: { data: AdminRedemption[] }) {
  if (data.length === 0) return <p className="empty-state">Aucun rachat enregistré.</p>;
  return (
    <div className="card">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Bon</th>
              <th>Tokens</th>
              <th>Code</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.id}>
                <td>
                  <p style={{ fontWeight: 600, fontSize: '0.82rem' }}>{r.user?.first_name || r.user?.name || '—'}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{r.user?.email}</p>
                </td>
                <td>
                  <p style={{ fontWeight: 600, fontSize: '0.82rem' }}>{r.voucher?.partner}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{r.voucher?.title}</p>
                </td>
                <td><span className="token-badge">{r.voucher?.token_cost}</span></td>
                <td><span className="promo-code">{r.promo_code}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  {fmt(r.redeemed_at || r.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Onglet Top ventes ── */
function OngletTop({ data }: { data: AdminRedemption[] }) {
  const counts: Record<string, { partner: string; title: string; cost: number; count: number }> = {};
  data.forEach(r => {
    const key = r.voucher?.id;
    if (!key) return;
    if (!counts[key]) counts[key] = { partner: r.voucher.partner, title: r.voucher.title, cost: r.voucher.token_cost, count: 0 };
    counts[key].count++;
  });

  const sorted = Object.entries(counts)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.count - a.count);

  if (sorted.length === 0) return <p className="empty-state">Aucun rachat enregistré pour l'instant.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sorted.map((v, i) => (
        <div key={v.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.9rem',
            color: i < 3 ? '#fff' : 'var(--primary)',
          }}>
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{v.partner}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{v.title}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{v.count}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>rachat{v.count > 1 ? 's' : ''}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page principale ── */
export default function AdminBons() {
  const [tab, setTab] = useState<Tab>('gerer');
  const [history, setHistory] = useState<AdminRedemption[]>([]);
  const [histLoading, setHistLoading] = useState(true);

  useEffect(() => {
    marketplaceService.adminGetHistory().then(setHistory).finally(() => setHistLoading(false));
  }, []);

  const tabs = [
    { key: 'gerer' as Tab,      label: 'Gérer' },
    { key: 'historique' as Tab, label: 'Historique des achats' },
    { key: 'top' as Tab,        label: 'Top ventes' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Bons d'achat</h1>
        <p>Gestion du catalogue et suivi des rachats</p>
      </div>

      <div className="hist-tabs" style={{ marginBottom: 24 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            className={`hist-tab ${tab === t.key ? 'hist-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'gerer'      && <OngletGerer />}
      {tab === 'historique' && (histLoading ? <p className="empty-state">Chargement…</p> : <OngletHistorique data={history} />)}
      {tab === 'top'        && (histLoading ? <p className="empty-state">Chargement…</p> : <OngletTop data={history} />)}
    </div>
  );
}
