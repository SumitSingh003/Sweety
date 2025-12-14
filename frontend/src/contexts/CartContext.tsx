import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Sweet } from '@/types';

export interface CartItem {
  sweet: Sweet;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (sweet: Sweet, quantity: number) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (sweet: Sweet, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.sweet.id === sweet.id);
      if (existing) {
        return prev.map((item) =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, sweet.quantity) }
            : item
        );
      }
      return [...prev, { sweet, quantity: Math.min(quantity, sweet.quantity) }];
    });
  };

  const removeFromCart = (sweetId: string) => {
    setItems((prev) => prev.filter((item) => item.sweet.id !== sweetId));
  };

  const updateQuantity = (sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.sweet.id === sweetId
          ? { ...item, quantity: Math.min(quantity, item.sweet.quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.sweet.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
