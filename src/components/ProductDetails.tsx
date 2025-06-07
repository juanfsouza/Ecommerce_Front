'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Star } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizes = product.size ? product.size.split(', ').map((s) => s.trim()) : [];

  return (
    <div className="container mx-auto py-8 text-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Galeria de Imagens */}
        <div className="md:col-span-1">
          <Card className="border-none rounded-xl overflow-hidden">
            <CardContent className="p-4">
              <Image
                src={product.imageUrl || 'https://placehold.co/400x400'}
                alt={product.name}
                width={400}
                height={400}
                className="object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/400x400';
                }}
                unoptimized
              />
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((_, index) => (
                  <Image
                    key={index}
                    src={product.imageUrl || 'https://placehold.co/80x80'}
                    alt={`Miniatura ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover rounded-md cursor-pointer hover:opacity-80"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/80x80';
                    }}
                    unoptimized
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Produto */}
        <div className="md:col-span-2">
          <Card className="border-none rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-5 w-5 text-orange-500 fill-current" />
                ))}
                <Star className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-400">(123 avaliações)</span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg font-bold text-orange-500">R$ {product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">Em estoque: {product.stock}</p>
              {product.size && (
                <div className="mt-2">
                  <label className="text-sm text-gray-400">Tamanho:</label>
                  <select
                    className="ml-2 p-1 border rounded"
                    value={selectedSize || ''}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    <option value="" disabled>
                      Selecione um tamanho
                    </option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {product.material && <p className="text-sm text-gray-400 mt-1">Material: {product.material}</p>}
              {product.type && <p className="text-sm text-gray-400 mt-1">Tipo: {product.type}</p>}
              <div className="flex items-center space-x-4 mt-4">
                <Button
                  className="bg-black text-white hover:bg-gray-700 transition-colors"
                  disabled={product.size && !selectedSize}
                  onClick={() =>
                    alert(
                      `Adicionado ao carrinho: ${product.name}${selectedSize ? `, Tamanho: ${selectedSize}` : ''}`,
                    )
                  }
                >
                  Adicionar ao Carrinho
                </Button>
                <Button
                  className="bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                  disabled={product.size && !selectedSize}
                  onClick={() =>
                    alert(
                      `Compra iniciada: ${product.name}${selectedSize ? `, Tamanho: ${selectedSize}` : ''}`,
                    )
                  }
                >
                  Comprar Agora
                </Button>
              </div>
            </CardContent>
            <CardContent className="p-6">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="bg-black">
                  <TabsTrigger value="description">Descrição</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                </TabsList>
                <TabsContent value="description">
                  <p className="text-gray-500">{product.description || 'Sem descrição disponível.'}</p>
                  {product.about && (
                    <div className="mt-4">
                      <h3 className="font-semibold">Sobre o Produto</h3>
                      <p className="text-gray-500">{product.about}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="reviews">
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold">João Silva</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="h-4 w-4 text-orange-500 fill-current" />
                        ))}
                        <Star className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-gray-300">Ótimo produto, recomendo!</p>
                    </div>
                    <div>
                      <p className="font-semibold">Maria Oliveira</p>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((star) => (
                          <Star key={star} className="h-4 w-4 text-orange-500 fill-current" />
                        ))}
                        <Star className="h-4 w-4 text-gray-400" />
                        <Star className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-gray-300">Bom, mas a entrega demorou.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="details">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Especificações</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 text-gray-500">
                          {product.material && <li>Material: {product.material}</li>}
                          {product.type && <li>Tipo: {product.type}</li>}
                          {product.size && <li>Tamanho: {product.size}</li>}
                          <li>Peso: 500g</li> {/* Ajuste conforme necessário */}
                          <li>Origem: Nacional</li> {/* Ajuste conforme necessário */}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Garantia</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-500">
                          {product.warranty || 'Garantia de 1 ano contra defeitos de fabricação.'}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardContent className="p-6">
              <Button
                asChild
                className="bg-orange-500 text-white border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <Link href="/">Voltar para Produtos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}