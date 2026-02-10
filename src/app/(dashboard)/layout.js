// src/app/(dashboard)/layout.js
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// IMPORTANTE: Tienes que importar los componentes aquí
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* 1. Ponemos el Navbar arriba */}
      <Navbar />

      {/* 2. El contenido de las páginas (Dashboard, Registrar, etc.) */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 3. Ponemos el Footer abajo */}
      <Footer />
    </div>
  );
}