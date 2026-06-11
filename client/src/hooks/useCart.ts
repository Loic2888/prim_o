import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export interface CartItem {
  id: string;
  added_at: string;
}

function cartKey(userId: string) {
  return `primo_cart_${userId}`;
}

function parseSaved(raw: string): CartItem[] {
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  // Migration: support anciens paniers stockés comme string[]
  return parsed.map((entry: unknown) =>
    typeof entry === 'string'
      ? { id: entry, added_at: new Date().toISOString() }
      : entry as CartItem,
  );
}

export function useCart() {
  const { user } = useAuth();
  const key = user?.id ? cartKey(user.id) : null;

  const [saved, setSaved] = useState<CartItem[]>(() => {
    if (!key) return [];
    try {
      return parseSaved(localStorage.getItem(key) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!key) { setSaved([]); return; }
    try {
      setSaved(parseSaved(localStorage.getItem(key) ?? '[]'));
    } catch {
      setSaved([]);
    }
  }, [key]);

  useEffect(() => {
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(saved));
  }, [saved, key]);

  function toggle(id: string) {
    setSaved((prev) =>
      prev.some((v) => v.id === id)
        ? prev.filter((v) => v.id !== id)
        : [...prev, { id, added_at: new Date().toISOString() }],
    );
  }

  function remove(id: string) {
    setSaved((prev) => prev.filter((v) => v.id !== id));
  }

  return {
    saved,
    toggle,
    remove,
    isInCart: (id: string) => saved.some((v) => v.id === id),
    addedAt: (id: string) => saved.find((v) => v.id === id)?.added_at,
    count: saved.length,
  };
}
