export interface Product {
  id: number;
  name: string;
  description?: string | null;
  imageUrl: string;
  price: number;
  stock: number;
  size?: string | null;
  stripeProductId?: string;
  stripePriceId?: string;
  images?: string[];
  specifications?: { key: string; value: string }[];
  createdAt: string;
  updatedAt: string;
}