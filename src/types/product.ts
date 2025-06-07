export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  stripeProductId?: string | null;
  stripePriceId?: string | null;
  size?: string | null;
  material?: string | null;
  type?: string | null;
  about?: string | null;
  warranty?: string | null;
  createdAt: string;
  updatedAt: string;
}