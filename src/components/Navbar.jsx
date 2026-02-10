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
    <nav className="bg-slate-900 text-white p-4 shadow-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter text-blue-400">
          TECNOMEXIS
        </Link>
        
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className="hover:text-blue-400 font-medium transition">Inicio</Link>
          <Link href="/registrar" className="hover:text-blue-400 font-medium transition">Registrar</Link>
          <Link href="/listado" className="hover:text-blue-400 font-medium transition">Listado</Link>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-full text-xs font-bold uppercase transition shadow-lg"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}