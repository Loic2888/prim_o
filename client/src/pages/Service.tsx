export default function Service() {
  return (
    <div>
      <div className="page-header">
        <h1>Service client</h1>
        <p>Nous sommes là pour vous aider</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 520 }}>
        <div className="card">
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Email</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>support@primo.app</p>
        </div>

        <div className="card">
          <p style={{ fontWeight: 600, marginBottom: 6 }}>FAQ</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Consultez notre documentation pour les questions fréquentes sur les tokens,
            les bons d'achat et les paiements.
          </p>
        </div>

        <div className="card">
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Horaires</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Lundi – Vendredi · 9h – 18h (CET)
          </p>
        </div>
      </div>
    </div>
  );
}
