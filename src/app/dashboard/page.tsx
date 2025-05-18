'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="container mx-auto py-8">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo, {user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Este é o seu dashboard. Aqui você pode gerenciar seus pedidos e perfil.</p>
        </CardContent>
      </Card>
    </div>
  );
}