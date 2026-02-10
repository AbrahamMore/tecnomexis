// src/app/(dashboard)/listado/page.js
'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

export default function ListadoEquipos() {
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    // Consulta los equipos ordenados por fecha de entrada
    const q = query(collection(db, "equipos"), orderBy("fechaEntrada", "desc"));
    
    // Escucha cambios en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setEquipos(docs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Equipos en Taller</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600 uppercase text-xs font-bold">
              <th className="p-4">Cliente</th>
              <th className="p-4">Equipo</th>
              <th className="p-4">Falla</th>
              <th className="p-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
            {equipos.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-medium">{item.cliente}</td>
                <td className="p-4">{item.equipo} ({item.marca})</td>
                <td className="p-4 text-sm italic">{item.falla}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.estado === 'En Espera' ? 'bg-yellow-100 text-yellow-700' : 
                    item.estado === 'Listo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {equipos.length === 0 && (
          <p className="text-center py-10 text-slate-400 italic">No hay equipos registrados aún.</p>
        )}
      </div>
    </div>
  );
}