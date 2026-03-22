"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { CartItem } from "./types";
import * as cartUtils from "./cart-utils";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateItemQuantity: (productId: string, color: string, size: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(cartUtils.getCart());
  }, []);

  useEffect(() => {
    if (items.length > 0 || cartUtils.getCart().length > 0) {
      cartUtils.saveCart(items);
    }
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => cartUtils.addToCart(prev, item));
  }, []);

  const removeItem = useCallback((productId: string, color: string, size: string) => {
    setItems((prev) => cartUtils.removeFromCart(prev, productId, color, size));
  }, []);

  const updateItemQuantity = useCallback(
    (productId: string, color: string, size: string, qty: number) => {
      setItems((prev) => cartUtils.updateQuantity(prev, productId, color, size, qty));
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
    cartUtils.saveCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateItemQuantity, clearCart,
        total: cartUtils.cartTotal(items),
        count: cartUtils.cartCount(items),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
