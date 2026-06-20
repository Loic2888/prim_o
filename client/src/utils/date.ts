/**
 * Normalise une date PostgreSQL avant parsing.
 * PostgreSQL retourne parfois "2026-05-19 10:00:00+00" (espace au lieu du T)
 * que certains moteurs JS ne parsent pas. On remplace le premier espace par T.
 */
function normalise(date: string): string {
  // "2026-05-19 10:00:00…" → "2026-05-19T10:00:00…"
  return date.replace(' ', 'T');
}

export function fmt(
  date: string | null | undefined,
  opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' },
): string {
  if (!date) return '—';
  const d = new Date(normalise(date));
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', opts);
}

export function fmtShort(date: string | null | undefined): string {
  return fmt(date, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtDateTime(date: string | null | undefined): string {
  if (!date) return '—';
  const d = new Date(normalise(date));
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).replace(' ', ' à ');
}
