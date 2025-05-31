'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get('/api/products')
      .then((res) => {
        const allProducts = res.data as Product[];
        setProducts(allProducts);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentProducts = allProducts.filter(
          (product: Product) => new Date(product.createdAt) > sevenDaysAgo
        );
        setNewProducts(recentProducts);
      })
      .catch((error) => {
        console.error('Erro ao carregar produtos:', error);
        setError('Falha ao carregar produtos. Tente novamente mais tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCheckout = async (priceId: string) => {
    if (!stripePromise) {
      console.error('Stripe não carregado. Verifique a chave pública.');
      return;
    }
    const stripe = await stripePromise;
    if (!stripe) {
      console.error('Stripe não inicializado.');
      return;
    }
    await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cancel`,
    });
  };

  const bannerSlides = [
    ...newProducts.length > 0
      ? [
          {
            image: newProducts[0].imageUrl,
            title: newProducts[0].name,
            description: `Novo! ${newProducts[0].description || 'Confira nosso novo produto.'}`,
            isNewProduct: true,
          },
        ]
      : [],
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      title: 'Bem-vindo à Nossa Loja!',
      description: 'Explore nossa coleção de produtos incríveis.',
    },
    {
      image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      title: 'Ofertas Especiais',
      description: 'Aproveite descontos de até 50%!',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <section className="relative w-full h-[500px] mb-12">
        <Carousel className="w-full h-full">
          <CarouselContent>
            {bannerSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-[500px]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover rounded-lg"
                    priority={index === 0}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/300x300';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
                    <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-lg">{slide.description}</p>
                    {slide.isNewProduct && (
                      <Badge className="mt-4 bg-orange-500 text-white">Novo</Badge>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white">
            <ChevronLeft className="h-8 w-8" />
          </CarouselPrevious>
          <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white">
            <ChevronRight className="h-8 w-8" />
          </CarouselNext>
        </Carousel>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Catálogo de Produtos</h1>
        {loading ? (
          <p className="text-center">Carregando produtos...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="border-none hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
              >
                <CardHeader className="p-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-48"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/300x300';
                    }}
                    unoptimized
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold text-white line-clamp-1">
                    {product.name}
                  </CardTitle>
                  <p className="text-gray-300 text-md mt-1 line-clamp-2">{product.description}</p>
                  {product.size && (
                    <p className="text-sm text-gray-400 mt-1">Tamanho: {product.size}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">Estoque: {product.stock || 0}</p>
                  <p className="text-lg font-bold mt-2 text-orange-500">R$ {product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 flex flex-col gap-2">
                  <Button
                    className="w-full bg-black text-white hover:bg-gray-700 transition-colors"
                    onClick={() => product.stripePriceId && handleCheckout(product.stripePriceId)}
                    disabled={!product.stripePriceId}
                  >
                    Adicionar ao Carrinho
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    onClick={() => console.log(`Navegando para /products/${product.id}`)}
                  >
                    <Link href={`/products/${product.id}`}>Ver Detalhes</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-6">
          <a
            className="flex items-center gap-2 hover:underline"
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/file.svg" alt="File icon" width={16} height={16} />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline"
            href="https://vercel.com/templates?framework=next.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/window.svg" alt="Window icon" width={16} height={16} />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/globe.svg" alt="Globe icon" width={16} height={16} />
            Go to nextjs.org →
          </a>
        </div>
      </footer>
    </div>
  );
}