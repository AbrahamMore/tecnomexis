'use client';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  return (
    <nav className="bg-[#D0182B] text-white p-4 shadow-xl shadow-black/20 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl font-black tracking-tighter text-white hover:text-yellow-300 transition-all duration-300 hover:scale-105"
        >
          TECNOMEXIS
        </Link>
        
        <div className="hidden md:flex space-x-8 items-center">
          <Link 
            href="/" 
            className="hover:text-yellow-300 font-semibold transition-all duration-300 hover:scale-105"
          >
            Inicio
          </Link>
          <Link 
            href="/registrar" 
            className="hover:text-yellow-300 font-semibold transition-all duration-300 hover:scale-105"
          >
            Registrar
          </Link>
          <Link 
            href="/listado" 
            className="hover:text-yellow-300 font-semibold transition-all duration-300 hover:scale-105"
          >
            Listado
          </Link>
          <button 
            onClick={handleLogout}
            className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-full font-bold uppercase transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/30 active:scale-95"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}