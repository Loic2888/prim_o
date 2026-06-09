import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function cartKey(userId: string) {
  return `primo_cart_${userId}`;
}

export function useCart() {
  const { user } = useAuth();
  const key = user?.id ? cartKey(user.id) : null;

  const [saved, setSaved] = useState<string[]>(() => {
    if (!key) return [];
    try {
      return JSON.parse(localStorage.getItem(key) ?? '[]');
    } catch {
      return [];
    }
  });

  // Reload cart when user changes (login/logout/switch)
  useEffect(() => {
    if (!key) { setSaved([]); return; }
    try {
      setSaved(JSON.parse(localStorage.getItem(key) ?? '[]'));
    } catch {
      setSaved([]);
    }
  }, [key]);

  useEffect(() => {
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(saved));
  }, [saved, key]);

  function toggle(id: string) {
    setSaved((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  function remove(id: string) {
    setSaved((prev) => prev.filter((v) => v !== id));
  }

  return {
    saved,
    toggle,
    remove,
    isInCart: (id: string) => saved.includes(id),
    count: saved.length,
  };
}
