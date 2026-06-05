import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { marketplaceService } from '../../services/marketplace.service';
import { useCart } from '../../hooks/useCart';
import type { Voucher } from '../../types';

/* ── Category mapping (partner → category) ─────────────── */
const CATEGORY_MAP: Record<string, string> = {
  'Amazon':         'Tech & High-Tech',
  'Fnac':           'Tech & High-Tech',
  'Darty':          'Tech & High-Tech',
  'Décathlon':      'Sport & Loisirs',
  'Uber Eats':      'Alimentation',
  'McDonald\'s':    'Alimentation',
  'Netflix':        'Divertissement',
  'Spotify':        'Divertissement',
  'Canal+':         'Divertissement',
  'Sephora':        'Beauté',
  'Yves Rocher':    'Beauté',
  'Zalando':        'Mode',
  'H&M':            'Mode',
  'IKEA':           'Maison',
  'Maisons du Monde': 'Maison',
};

const CATEGORY_ORDER = [
  'Tech & High-Tech',
  'Alimentation',
  'Divertissement',
  'Sport & Loisirs',
  'Beauté',
  'Mode',
  'Maison',
];

function getCategory(partner: string): string {
  return CATEGORY_MAP[partner] ?? 'Autres';
}

/* ── Icons ──────────────────────────────────────────────── */
function IconBookmark({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ width: 16, height: 16 }}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

/* ── Single voucher card ────────────────────────────────── */
function VoucherCard({
  voucher, onRedeem, redeeming, promoCode, canAfford,
}: {
  voucher: Voucher;
  onRedeem: (v: Voucher) => void;
  redeeming: boolean;
  promoCode?: string;
  canAfford: boolean;
}) {
  const { toggle, isInCart } = useCart();
  const saved = isInCart(voucher.id);

  return (
    <div className="voucher-card-carousel">
      <div className="voucher-card-carousel-top">
        <div className="voucher-card-partner">{voucher.partner}</div>
        <button
          className={`btn-bookmark ${saved ? 'btn-bookmark--saved' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggle(voucher.id); }}
          aria-label={saved ? 'Retirer du panier' : 'Sauvegarder'}
        >
          <IconBookmark filled={saved} />
        </button>
      </div>

      <p className="voucher-card-carousel-title">{voucher.title}</p>

      <div className="voucher-card-carousel-footer">
        <span className="token-badge">{voucher.token_cost}</span>

        {promoCode ? (
          <span className="promo-code" style={{ fontSize: '0.72rem' }}>{promoCode}</span>
        ) : !voucher.available ? (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Indisponible</span>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            disabled={redeeming || !canAfford}
            onClick={() => onRedeem(voucher)}
          >
            {redeeming ? '…' : 'Racheter'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Carousel row ───────────────────────────────────────── */
function CarouselRow({
  title, vouchers, onRedeem, redeeming, promoCodes, userBalance,
}: {
  title: string;
  vouchers: Voucher[];
  onRedeem: (v: Voucher) => void;
  redeeming: string | null;
  promoCodes: Record<string, string>;
  userBalance: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 220 : -220, behavior: 'smooth' });
  }

  if (vouchers.length === 0) return null;

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        <div className="carousel-controls">
          <button className="carousel-btn" onClick={() => scroll('left')} aria-label="Précédent">
            <IconChevronLeft />
          </button>
          <button className="carousel-btn" onClick={() => scroll('right')} aria-label="Suivant">
            <IconChevronRight />
          </button>
        </div>
      </div>
      <div className="carousel-track" ref={scrollRef}>
        {vouchers.map(v => (
          <VoucherCard
            key={v.id}
            voucher={v}
            onRedeem={onRedeem}
            redeeming={redeeming === v.id}
            promoCode={promoCodes[v.id]}
            canAfford={userBalance >= v.token_cost}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function Catalogue() {
  const { user, refreshUser } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [promoCodes, setPromoCodes] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    marketplaceService.getItems().then(setVouchers).finally(() => setLoading(false));
  }, []);

  async function handleRedeem(voucher: Voucher) {
    setError('');
    setRedeeming(voucher.id);
    try {
      const { promo_code } = await marketplaceService.redeem(voucher.id);
      setPromoCodes(prev => ({ ...prev, [voucher.id]: promo_code }));
      setVouchers(prev => prev.map(v => v.id === voucher.id ? { ...v, available: false } : v));
      await refreshUser();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error ?? 'Erreur lors du rachat.');
    } finally {
      setRedeeming(null);
    }
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--text-muted)' }}>Chargement…</div>;

  const userBalance = user?.token_balance ?? 0;

  /* Catégories présentes dans les données */
  const presentCategories = Array.from(new Set(vouchers.map(v => getCategory(v.partner))));
  const orderedCategories = [
    ...CATEGORY_ORDER.filter(c => presentCategories.includes(c)),
    ...presentCategories.filter(c => !CATEGORY_ORDER.includes(c)),
  ];

  /* Filtre recherche + catégorie active */
  const searchLower = search.toLowerCase();
  const filtered = vouchers.filter(v => {
    const matchSearch = !search ||
      v.partner.toLowerCase().includes(searchLower) ||
      v.title.toLowerCase().includes(searchLower);
    const matchCat = !activeCategory || getCategory(v.partner) === activeCategory;
    return matchSearch && matchCat;
  });

  /* "Populaires" = les 6 moins chers (plus accessibles) */
  const populaires = [...vouchers]
    .filter(v => v.available)
    .sort((a, b) => a.token_cost - b.token_cost)
    .slice(0, 6);

  const showSearch = !!search || !!activeCategory;

  return (
    <div>
      <div className="page-header">
        <h1>Catalogue</h1>
        <p>Échangez vos tokens contre des bons d'achat</p>
      </div>

      {/* Barre de recherche */}
      <div style={{ marginBottom: 14 }}>
        <input
          className="form-input"
          type="search"
          placeholder="Rechercher un bon d'achat…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filtres catégorie — scroll horizontal */}
      <div className="category-chips">
        <button
          className={`category-chip ${!activeCategory ? 'category-chip--active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          Tous
        </button>
        {orderedCategories.map(cat => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? 'category-chip--active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}

      {/* Vue recherche / filtre → grille plate */}
      {showSearch ? (
        filtered.length === 0 ? (
          <p className="empty-state">Aucun bon trouvé.</p>
        ) : (
          <div className="grid-3">
            {filtered.map(v => (
              <VoucherCard
                key={v.id}
                voucher={v}
                onRedeem={handleRedeem}
                redeeming={redeeming === v.id}
                promoCode={promoCodes[v.id]}
                canAfford={userBalance >= v.token_cost}
              />
            ))}
          </div>
        )
      ) : (
        /* Vue normale → carousels par catégorie */
        <>
          <CarouselRow
            title="⭐ Populaires"
            vouchers={populaires}
            onRedeem={handleRedeem}
            redeeming={redeeming}
            promoCodes={promoCodes}
            userBalance={userBalance}
          />
          {orderedCategories.map(cat => (
            <CarouselRow
              key={cat}
              title={cat}
              vouchers={vouchers.filter(v => getCategory(v.partner) === cat)}
              onRedeem={handleRedeem}
              redeeming={redeeming}
              promoCodes={promoCodes}
              userBalance={userBalance}
            />
          ))}
        </>
      )}
    </div>
  );
}
