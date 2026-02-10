'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Cuenta creada con éxito");
      router.push('/'); 
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-slate-800">Registro</h2>
        <p className="text-center text-slate-500 mb-8">Crea tu cuenta de administrador</p>
        
        <input 
          type="email" 
          placeholder="Correo nuevo" 
          className="w-full p-3 border border-slate-300 rounded-lg mb-4 text-black outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Contraseña (mínimo 6 caracteres)" 
          className="w-full p-3 border border-slate-300 rounded-lg mb-6 text-black outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition">
          Crear Cuenta
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600 font-bold hover:underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}