export interface Product {
  id: string;
  name: string;
  price: number;
  category: "vetements" | "accessoires" | "bijoux" | "lingerie";
  description: string;
  colors: { name: string; hex: string }[];
  images: string[];
  isFeatured: boolean;
}
