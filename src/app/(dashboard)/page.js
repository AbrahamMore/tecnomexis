'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import * as motion from "motion/react-client";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [stats, setStats] = useState({ 
    espera: 0, proceso: 0, listo: 0, entregado: 0,
    dineroRecaudado: 0, dineroPendiente: 0 
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "equipos"), (snapshot) => {
      const counts = { 
        espera: 0, proceso: 0, listo: 0, entregado: 0, 
        dineroRecaudado: 0, dineroPendiente: 0 
      };
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        if (data.estado === 'En Espera') counts.espera++;
        if (data.estado === 'En Proceso') counts.proceso++;
        if (data.estado === 'Listo') counts.listo++;
        if (data.estado === 'Entregado') counts.entregado++;

        counts.dineroRecaudado += (Number(data.adelanto) || 0);
        
        if (data.estado === 'Entregado') {
            counts.dineroRecaudado += (Number(data.restante) || 0);
        } else {
            counts.dineroPendiente += (Number(data.restante) || 0);
        }
      });
      
      setStats(counts);
    });
    return () => unsubscribe();
  }, []);

  const cards = [
    { id: 1, t: "En Espera", v: stats.espera, c: "bg-amber-500", path: "/listado?filtro=En Espera" },
    { id: 2, t: "En Proceso", v: stats.proceso, c: "bg-blue-600", path: "/listado?filtro=En Proceso" },
    { id: 3, t: "Listos", v: stats.listo, c: "bg-emerald-600", path: "/listado?filtro=Listo" },
    { id: 4, t: "Entregar", v: stats.listo, c: "bg-red-500", path: "/entregar" },
    { id: 5, t: "Historial y Garantías", v: stats.entregado, c: "bg-slate-800", path: "/historial" },
  ];

  const totalFinanciero = stats.dineroRecaudado + stats.dineroPendiente || 1;
  const porcentajeRecaudado = (stats.dineroRecaudado / totalFinanciero) * 100;
  const strokeDasharray = `${porcentajeRecaudado} ${100 - porcentajeRecaudado}`;

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6"></div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800 tracking-tight flex items-center gap-2">
        <span className="p-2 bg-white rounded-lg shadow-sm">🚀</span> Resumen Tecnomexis
      </h1>
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6"></div>
      {/* Tus tarjetas originales */}
      <div className="flex flex-wrap gap-4 lg:gap-6">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(card.path)}
            className={`${card.c} flex-1 min-w-[180px] p-5 rounded-2xl text-white shadow-lg cursor-pointer border-b-4 border-black/20`}
          >
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold opacity-90 uppercase tracking-widest">{card.t}</p>
              <span className="text-lg">
                {card.id === 4 ? '📦' : card.id === 5 ? '📋' : '⚙️'}
              </span>
            </div>
            <p className="text-4xl font-extrabold mt-2">{card.v}</p>
            <p className="text-[10px] mt-4 opacity-80 font-medium">Abrir apartado →</p>
          </motion.div>
        ))}
      </div>

      {/* --- NUEVA SECCIÓN: GRÁFICA DE PASTEL --- */}
      {/* Se cambió mt-10 por mt-20 para duplicar el espacio superior */}
      <div className="mt-30 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8"
        >
          {/* Gráfica Circular (SVG) */}
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3"></circle>
              <motion.circle
                cx="18" cy="18" r="15.915"
                fill="transparent"
                stroke="#10b981" 
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset="25"
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              ></motion.circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-800">{Math.round(porcentajeRecaudado)}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Cobrado</span>
            </div>
          </div>

          {/* Leyenda y Datos */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Balance de Caja</h2>
              <p className="text-sm text-slate-500">Visualización de ingresos vs deuda actual.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Recaudado (Adelantos + Pagos)</p>
                <p className="text-2xl font-black text-emerald-700">${stats.dineroRecaudado.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-xs font-bold text-amber-600 uppercase mb-1">Por Cobrar (Pendiente)</p>
                <p className="text-2xl font-black text-amber-700">${stats.dineroPendiente.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta de Meta rápida */}
        <div className="bg-slate-800 p-6 rounded-3xl text-white flex flex-col justify-center">
          <p className="text-slate-400 text-sm font-medium">Valor total del inventario en taller</p>
          <p className="text-4xl font-black mt-2 text-white">
            ${(stats.dineroRecaudado + stats.dineroPendiente).toLocaleString()}
          </p>
          <div className="mt-6 h-2 bg-slate-700 rounded-full overflow-hidden">
             <div 
              className="h-full bg-blue-500 transition-all duration-1000" 
              style={{ width: `${porcentajeRecaudado}%` }}
             ></div>
          </div>
          <p className="text-[11px] mt-3 text-slate-400 italic">"El éxito no es el final, el cobro sí lo es."</p>
        </div>
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6"></div>

      </div>
    </div>
  );
}