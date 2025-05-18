'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          E-commerce
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-sm">Bem-vindo, {user.name}</span>
              <Button variant="ghost" asChild>
                <Link href="/orders">Meus Pedidos</Link>
              </Button>
              <Button variant="ghost" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/register">Registrar</Link>
              </Button>
            </>
          )}
          <Button variant="ghost" asChild>
            <Link href="/cart">Carrinho</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}