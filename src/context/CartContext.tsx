'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    console.log('Adicionando ao carrinho:', product, quantity);
    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        const updatedCart = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
        console.log('Carrinho atualizado (item existente):', updatedCart);
        return updatedCart;
      }
      const newCart = [...prev, { product, quantity }];
      console.log('Carrinho atualizado (novo item):', newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId: number) => {
    console.log('Removendo do carrinho, productId:', productId);
    setCart((prev) => {
      const updatedCart = prev.filter((item) => item.product.id !== productId);
      console.log('Carrinho após remoção:', updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    console.log('Atualizando quantidade, productId:', productId, 'nova quantidade:', quantity);
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) => {
        const updatedCart = prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        );
        console.log('Carrinho após atualização de quantidade:', updatedCart);
        return updatedCart;
      });
    }
  };

  const clearCart = () => {
    console.log('Limpando carrinho');
    setCart([]);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  console.log('Total do carrinho:', total);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}