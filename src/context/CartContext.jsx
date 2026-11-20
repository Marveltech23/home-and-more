import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../components/common/Toast';

const STORAGE_KEY = 'home_and_more_cart_v1';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (product, quantity = 1, options = {}) => {
      if (!product) return;
      const { selectedColor = product.colors?.[0] || 'Default', selectedMaterial = product.material || '' } = options;
      
      const cartItemId = `${product.id}-${selectedColor}-${selectedMaterial}`.replace(/\s+/g, '-');

      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          return [
            ...prev,
            {
              cartItemId,
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              discountPrice: product.discountPrice,
              image: product.image,
              sku: product.sku,
              selectedColor,
              selectedMaterial,
              quantity,
            },
          ];
        }
      });

      addToast({
        message: `${product.name} added to your shopping bag.`,
        type: 'success',
      });
      setIsOpen(true);
    },
    [addToast]
  );

  const updateQuantity = useCallback((cartItemId, delta) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  }, []);

  const removeFromCart = useCallback(
    (cartItemId, itemName = 'Item') => {
      setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
      addToast({
        message: `${itemName} removed from your bag.`,
        type: 'info',
      });
    },
    [addToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
