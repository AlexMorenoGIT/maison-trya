import type { CartItem } from "./types";

const CART_KEY = "maison-trya-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(items: CartItem[], newItem: CartItem): CartItem[] {
  const existing = items.find(
    (i) => i.product_id === newItem.product_id && i.color === newItem.color && i.size === newItem.size
  );
  if (existing) {
    return items.map((i) =>
      i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
    );
  }
  return [...items, newItem];
}

export function removeFromCart(items: CartItem[], productId: string, color: string, size: string): CartItem[] {
  return items.filter(
    (i) => !(i.product_id === productId && i.color === color && i.size === size)
  );
}

export function updateQuantity(items: CartItem[], productId: string, color: string, size: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeFromCart(items, productId, color, size);
  return items.map((i) =>
    i.product_id === productId && i.color === color && i.size === size ? { ...i, quantity } : i
  );
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
