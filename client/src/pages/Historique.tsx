import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/user.service';
import { marketplaceService } from '../services/marketplace.service';
import { tokenService } from '../services/token.service';
import type { TokenTransaction, Redemption } from '../types';

type Tab = 'tokens' | 'achats' | 'equipe';

function fmt(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function Historique() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('tokens');
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [teamTx, setTeamTx] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const tasks: Promise<unknown>[] = [
      userService.getHistory(user.id).then(setTransactions).catch(() => {}),
      marketplaceService.getOrders().then(setRedemptions).catch(() => {}),
    ];

    if (user.role === 'employer') {
      tasks.push(
        tokenService.getTransactions().then(setTeamTx).catch(() => {}),
      );
    }

    Promise.all(tasks).finally(() => setLoading(false));
  }, [user?.id, user?.role]);

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)' }}>Chargement…</div>;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'tokens', label: 'Mes tokens' },
    { key: 'achats', label: 'Mes achats' },
    ...(user?.role === 'employer' ? [{ key: 'equipe' as Tab, label: 'Mon équipe' }] : []),
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Historique</h1>
        <p>Suivi de vos tokens et de vos échanges</p>
      </div>

      {/* Tabs */}
      <div className="hist-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`hist-tab ${tab === t.key ? 'hist-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Mes tokens */}
      {tab === 'tokens' && (
        <div className="card" style={{ marginTop: 16 }}>
          {transactions.length === 0 ? (
            <p className="empty-state">Aucune transaction de tokens.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td><span className="token-badge">+{tx.amount}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{tx.reason || '—'}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{fmt(tx.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Mes achats */}
      {tab === 'achats' && (
        <div className="card" style={{ marginTop: 16 }}>
          {redemptions.length === 0 ? (
            <p className="empty-state">Aucun bon d'achat racheté.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Code promo</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className="promo-code">{r.promo_code}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        {fmt(r.redeemed_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Mon équipe (employer only) */}
      {tab === 'equipe' && (
        <div className="card" style={{ marginTop: 16 }}>
          {teamTx.length === 0 ? (
            <p className="empty-state">Aucune allocation effectuée.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employé</th>
                    <th>Tokens</th>
                    <th>Motif</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {teamTx
                    .filter((tx) => tx.sender_id === user?.id)
                    .map((tx) => (
                      <tr key={tx.id}>
                        <td style={{ fontWeight: 500, fontSize: '0.82rem' }}>
                          {(tx as TokenTransaction & { receiver?: { name?: string; first_name?: string } }).receiver?.first_name
                            || (tx as TokenTransaction & { receiver?: { name?: string } }).receiver?.name
                            || tx.receiver_id?.slice(0, 8)}
                        </td>
                        <td><span className="token-badge">{tx.amount}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{tx.reason || '—'}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{fmt(tx.created_at)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
