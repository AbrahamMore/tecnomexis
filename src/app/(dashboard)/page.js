// src/app/(dashboard)/page.js
'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function DashboardPage() {
  const [stats, setStats] = useState({ espera: 0, proceso: 0, listo: 0 });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "equipos"), (snapshot) => {
      const counts = { espera: 0, proceso: 0, listo: 0 };
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.estado === 'En Espera') counts.espera++;
        if (data.estado === 'En Proceso') counts.proceso++;
        if (data.estado === 'Listo') counts.listo++;
      });
      setStats(counts);
    });
    return () => unsubscribe();
  }, []);

  const cards = [
    { id: 1, t: "En Espera", v: stats.espera, c: "bg-amber-500" },
    { id: 2, t: "En Proceso", v: stats.proceso, c: "bg-blue-600" },
    { id: 3, t: "Listos", v: stats.listo, c: "bg-emerald-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Resumen Tecnomexis</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className={`${card.c} p-6 rounded-2xl text-white shadow-md`}>
            <p className="text-sm font-medium opacity-80 uppercase">{card.t}</p>
            <p className="text-5xl font-bold mt-2">{card.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}