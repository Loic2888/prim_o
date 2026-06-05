import { useState, useEffect } from 'react';

const KEY = 'primo_cart';

export function useCart() {
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved]);

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
