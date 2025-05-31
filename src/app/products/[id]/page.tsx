import { notFound } from 'next/navigation';
import api from '@/lib/api';
import { Product } from '@/types/product';
import ProductDetails from '@/components/ProductDetails';

async function fetchProduct(id: string): Promise<Product> {
  console.log('Buscando produto com id:', id);
  try {
    const response = await api.get(`/products/${id}`);
    console.log('Resposta da API para produto:', response.data);
    return response.data as Product;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw new Error('Produto não encontrado');
  }
}

async function fetchRelatedProducts(): Promise<Product[]> {
  console.log('Buscando produtos relacionados');
  try {
    const response = await api.get('/products');
    console.log('Resposta da API para produtos relacionados:', response.data);
    return response.data.slice(0, 4) as Product[];
  } catch (error) {
    console.error('Erro ao buscar produtos relacionados:', error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  console.log('ProductPage renderizado com id:', params.id);

  // Buscar dados de forma assíncrona
  const product = await fetchProduct(params.id);
  const relatedProducts = await fetchRelatedProducts();

  if (!product) {
    console.log('Produto não encontrado para id:', params.id);
    notFound();
  }

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}