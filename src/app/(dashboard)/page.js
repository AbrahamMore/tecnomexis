'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import * as motion from "motion/react-client";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [stats, setStats] = useState({ espera: 0, proceso: 0, listo: 0, entregado: 0 });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "equipos"), (snapshot) => {
      const counts = { espera: 0, proceso: 0, listo: 0, entregado: 0 };
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.estado === 'En Espera') counts.espera++;
        if (data.estado === 'En Proceso') counts.proceso++;
        if (data.estado === 'Listo') counts.listo++;
        if (data.estado === 'Entregado') counts.entregado++;
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 tracking-tight">
        Resumen Tecnomexis
      </h1>
      
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
            <p className="text-[10px] mt-4 opacity-80 font-medium">
              Abrir apartado →
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}