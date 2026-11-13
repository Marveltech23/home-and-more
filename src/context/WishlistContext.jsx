import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/common/Toast';

const STORAGE_KEY = 'home_and_more_wishlist';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  }, [items]);

  const has = useCallback((id) => items.includes(id), [items]);

  const toggle = useCallback((id, productName = 'Item') => {
    setItems((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        addToast({ message: `${productName} removed from wishlist`, type: 'info' });
        return prev.filter((item) => item !== id);
      } else {
        addToast({ message: `${productName} added to wishlist!`, type: 'success' });
        return [...prev, id];
      }
    });
  }, [addToast]);

  const add = useCallback((id, productName = 'Item') => {
    setItems((prev) => {
      if (prev.includes(id)) return prev;
      addToast({ message: `${productName} added to wishlist!`, type: 'success' });
      return [...prev, id];
    });
  }, [addToast]);

  const remove = useCallback((id, productName = 'Item') => {
    setItems((prev) => {
      if (!prev.includes(id)) return prev;
      addToast({ message: `${productName} removed from wishlist`, type: 'info' });
      return prev.filter((item) => item !== id);
    });
  }, [addToast]);

  const clear = useCallback(() => {
    setItems([]);
    addToast({ message: 'Wishlist cleared', type: 'info' });
  }, [addToast]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        has,
        toggle,
        add,
        remove,
        clear,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
