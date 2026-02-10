// src/app/(dashboard)/registrar/page.js
'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function RegistrarEquipo() {
  const [formData, setFormData] = useState({
    cliente: '',
    equipo: '',
    marca: '',
    falla: '',
    estado: 'En Espera'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "equipos"), {
        ...formData,
        fechaEntrada: serverTimestamp()
      });
      alert("¡Equipo registrado con éxito!");
      // Limpiar formulario
      setFormData({ cliente: '', equipo: '', marca: '', falla: '', estado: 'En Espera' });
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      alert("Error al registrar el equipo. Revisa las reglas de tu base de datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Registrar Entrada de Equipo</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre del Cliente</label>
          <input 
            type="text" 
            required 
            className="w-full p-3 border border-slate-300 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.cliente} 
            onChange={(e) => setFormData({...formData, cliente: e.target.value})} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Equipo</label>
            <input 
              type="text" 
              placeholder="Ej: iPhone 13, Laptop Dell" 
              required 
              className="w-full p-3 border border-slate-300 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.equipo} 
              onChange={(e) => setFormData({...formData, equipo: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Marca/Modelo</label>
            <input 
              type="text" 
              required 
              className="w-full p-3 border border-slate-300 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.marca} 
              onChange={(e) => setFormData({...formData, marca: e.target.value})} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción del Problema</label>
          <textarea 
            rows="4" 
            required 
            className="w-full p-3 border border-slate-300 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.falla} 
            onChange={(e) => setFormData({...formData, falla: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 rounded-lg transition duration-200`}
        >
          {loading ? 'Guardando...' : 'Guardar en Sistema'}
        </button>
      </form>
    </div>
  );
}