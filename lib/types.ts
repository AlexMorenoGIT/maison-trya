export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  collection: "vulnerabilite" | "eveil" | "ferocite";
  category: "pret-a-porter" | "lingerie" | "accessoires";
  subcategory: string;
  description: string;
  colors: { name: string; hex: string }[];
  images: string[];
  sizes: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: CartItem[];
  total: number;
  status: string;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image: string;
}
