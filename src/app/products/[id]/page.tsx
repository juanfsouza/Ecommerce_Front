'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { Product } from '@/types/product';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function fetchProduct(id: string): Promise<Product> {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw new Error('Produto não encontrado');
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  let product: Product;
  try {
    product = await fetchProduct(params.id);
  } catch (error) {
    return notFound();
  }

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= product.stock) {
      addToCart(product, quantity);
      alert('Produto adicionado ao carrinho!');
    } else {
      alert('Quantidade inválida');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{product.description || 'Sem descrição'}</p>
          <p className="text-lg font-semibold mt-2">R$ {product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Em estoque: {product.stock}</p>
        </CardContent>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20"
            />
            <Button onClick={handleAddToCart}>Adicionar ao Carrinho</Button>
          </div>
        </CardContent>
        <CardContent>
          <Button asChild>
            <Link href="/">Voltar para Produtos</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}