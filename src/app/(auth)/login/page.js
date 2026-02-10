'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); 
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Tecnomexis</h2>
        <p className="text-center text-slate-500 mb-8">Inicia sesión para gestionar equipos</p>
        
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          className="w-full p-3 border border-slate-300 rounded-lg mb-4 text-black outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          className="w-full p-3 border border-slate-300 rounded-lg mb-6 text-black outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Entrar
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿No tienes cuenta? <Link href="/register" className="text-blue-600 font-bold hover:underline">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}