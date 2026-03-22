'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function RegistrarEquipo() {
  const initialState = {
    cliente: '',
    equipo: '',
    marca: '',
    falla: '',
    estado: 'En Espera',
    precioTotal: 0,
    adelanto: 0,
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // Cálculo del restante en tiempo real
  const restante = formData.precioTotal - formData.adelanto;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "equipos"), {
        ...formData,
        restante: restante, // Guardamos el restante calculadoa
        pagadoCompletamente: restante <= 0, // Bandera de ayuda
        fechaEntrada: serverTimestamp()
      });
      
      alert("¡Equipo registrado con éxito!");
      setFormData(initialState);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      alert("Error al registrar el equipo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Registrar Entrada de Equipo</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (campos anteriores: cliente, equipo, marca se mantienen igual) ... */}
        
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
              placeholder="Ej: iPhone 13" 
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

        {/* --- NUEVA SECCIÓN DE PAGOS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Precio Total</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full p-2 border border-slate-300 rounded-md text-black"
              value={formData.precioTotal} 
              onChange={(e) => setFormData({...formData, precioTotal: Number(e.target.value)})} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Adelanto</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full p-2 border border-slate-300 rounded-md text-black"
              value={formData.adelanto} 
              onChange={(e) => setFormData({...formData, adelanto: Number(e.target.value)})} 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Restante</label>
            <div className={`p-2 font-bold rounded-md ${restante <= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
              $ {restante}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción del Problema</label>
          <textarea 
            rows="3" 
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