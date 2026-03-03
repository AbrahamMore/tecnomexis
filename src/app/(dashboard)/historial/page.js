'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function HistorialGarantias() {
  const [entregados, setEntregados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos"); // todos, activa, vencida

  useEffect(() => {
    // Traemos solo los que ya fueron entregados
    const q = query(
      collection(db, "equipos"), 
      where("estado", "==", "Entregado"),
      orderBy("fechaEntrega", "desc")
    );

    const unsubscribe = onSnapshot(q, (snaps) => {
      const data = snaps.docs.map(d => {
        const item = d.data();
        // Lógica para saber si la garantía venció
        const hoy = new Date();
        const vencimiento = new Date(item.vencimientoGarantia);
        const estaVencida = hoy > vencimiento;
        
        return { id: d.id, ...item, estaVencida };
      });
      setEntregados(data);
    });
    return () => unsubscribe();
  }, []);

  const resultados = entregados.filter(eq => {
    const termino = busqueda.toLowerCase();
    const coincideBusqueda = 
      eq.cliente?.toLowerCase().includes(termino) || 
      eq.codigoTicket?.toLowerCase().includes(termino) ||
      eq.equipo?.toLowerCase().includes(termino);

    if (filtroStatus === "activa") return coincideBusqueda && !eq.estaVencida;
    if (filtroStatus === "vencida") return coincideBusqueda && eq.estaVencida;
    return coincideBusqueda;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Historial de Salidas</h1>
          <p className="text-slate-500 text-sm">Consulta códigos de ticket y estados de garantía.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="🔍 Buscar por Código o Cliente..." 
            className="p-3 border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-red-500 text-black w-full sm:w-80"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select 
            className="p-3 border rounded-xl bg-white text-black text-sm font-bold"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Ver Todos</option>
            <option value="activa">Garantía Activa</option>
            <option value="vencida">Garantía Vencida</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {resultados.length > 0 ? (
          resultados.map(eq => (
            <div key={eq.id} className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border">
                    {eq.codigoTicket || 'SIN CÓDIGO'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">{eq.cliente}</h3>
                </div>
                <p className="text-sm text-slate-600">{eq.equipo} - <span className="italic">{eq.marca}</span></p>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
                  Entregado el: {eq.fechaEntrega?.toDate().toLocaleDateString()}
                </p>
              </div>

              <div className="text-center md:text-right">
                <div className={`text-xs font-black px-4 py-2 rounded-lg border-2 mb-1 ${
                  eq.estaVencida 
                  ? 'border-red-100 bg-red-50 text-red-600' 
                  : 'border-emerald-100 bg-emerald-50 text-emerald-600'
                }`}>
                  {eq.estaVencida ? '❌ GARANTÍA VENCIDA' : '✅ GARANTÍA ACTIVA'}
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Vence: {new Date(eq.vencimientoGarantia).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed">
            <p className="text-slate-400 font-medium">No se encontraron registros que coincidan.</p>
          </div>
        )}
      </div>
    </div>
  );
}