/**
 * hooks/usePageMeta.ts — Per-route SEO metadata for the single-page app.
 *
 * The app ships one static index.html, so every route would otherwise share the same <title>
 * and be indexable. This hook, called from a page component, sets the document title, the
 * meta description, the robots directive and (optionally) the canonical URL for as long as
 * that page is mounted, then restores the previous values on unmount. Public pages
 * (home, login, register) declare themselves indexable; the authenticated Layout declares
 * `indexable: false` so connected pages carry `noindex`.
 *
 * Must be called before any early `return` in the component (rules of hooks).
 */
import { useEffect } from 'react';

interface PageMeta {
  /** Document title. Omit to keep the title already in place. */
  title?: string;
  /** Meta description. Omit to keep the default one from index.html. */
  description?: string;
  /** false → `noindex, nofollow`. */
  indexable: boolean;
  /** Path of the canonical URL (e.g. `/login`), resolved against SITE_URL. */
  canonicalPath?: string;
}

/**
 * Production origin. Fixed on purpose: aliases and staging deployments must all declare the
 * production URL as canonical instead of each being their own. Keep in sync with index.html
 * (og:url, og:image), public/sitemap.xml and public/robots.txt if the domain changes.
 */
const SITE_URL = 'https://prim-o.vercel.app';

/** Returns the element matching `selector` in <head>, creating it with `create` if absent. */
function getOrCreate<T extends HTMLElement>(selector: string, create: () => T): { el: T; created: boolean } {
  const existing = document.head.querySelector<T>(selector);
  if (existing) return { el: existing, created: false };
  const el = create();
  document.head.appendChild(el);
  return { el, created: true };
}

function createMeta(name: string): HTMLMetaElement {
  const meta = document.createElement('meta');
  meta.name = name;
  return meta;
}

export function usePageMeta({ title, description, indexable, canonicalPath }: PageMeta) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    const robots = getOrCreate('meta[name="robots"]', () => createMeta('robots'));
    const previousRobots = robots.el.content;
    robots.el.content = indexable ? 'index, follow' : 'noindex, nofollow';

    const desc = getOrCreate('meta[name="description"]', () => createMeta('description'));
    const previousDescription = desc.el.content;
    if (description) desc.el.content = description;

    let canonical: HTMLLinkElement | null = null;
    if (canonicalPath) {
      canonical = getOrCreate('link[rel="canonical"]', () => {
        const link = document.createElement('link');
        link.rel = 'canonical';
        return link;
      }).el;
      canonical.href = `${SITE_URL}${canonicalPath}`;
    }

    return () => {
      document.title = previousTitle;
      robots.el.content = previousRobots || 'index, follow';
      desc.el.content = previousDescription;
      canonical?.remove();
    };
  }, [title, description, indexable, canonicalPath]);
}
