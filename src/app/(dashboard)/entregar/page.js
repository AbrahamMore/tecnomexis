'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function EntregarEquipos() {
  const [equiposListos, setEquiposListos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "equipos"), where("estado", "==", "Listo"));
    const unsubscribe = onSnapshot(q, (snaps) => {
      setEquiposListos(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const confirmarEntrega = async () => {
    if (!seleccionado) return;
    setLoading(true);
    
    // Generamos código único: TX-LetraNombre-Random
    const ticketID = `TX-${seleccionado.cliente.substring(0,2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fechaActual = new Date();
    const fechaGarantia = new Date();
    fechaGarantia.setDate(fechaActual.getDate() + 30); // 1 mes de garantía

    try {
      await updateDoc(doc(db, "equipos", seleccionado.id), {
        estado: "Entregado",
        codigoTicket: ticketID,
        fechaEntrega: serverTimestamp(),
        vencimientoGarantia: fechaGarantia.toISOString(),
        entregadoConfirmado: true
      });
      alert(`Entrega Exitosa. Código: ${ticketID}`);
      setSeleccionado(null);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Módulo de Entrega y Garantías</h2>
      
      <div className="grid gap-4">
        {equiposListos.map(eq => (
          <div key={eq.id} onClick={() => setSeleccionado(eq)} className="bg-white border p-4 rounded-xl shadow-sm cursor-pointer hover:border-emerald-500 transition-all flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-900">{eq.cliente}</p>
              <p className="text-sm text-slate-500">{eq.equipo} - {eq.marca}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">LISTO PARA SALIDA</span>
          </div>
        ))}
      </div>

      {/* MODAL DE TICKET / VISTA PREVIA */}
      {seleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border-t-8 border-red-500">
            <div className="text-center mb-4 border-b pb-4">
              <h3 className="text-xl font-black text-slate-800 uppercase">Tecnomexis</h3>
              <p className="text-[10px] text-slate-400 font-bold">COMPROBANTE DE SALIDA</p>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex justify-between"><span>Cliente:</span> <span className="font-bold">{seleccionado.cliente}</span></div>
              <div className="flex justify-between"><span>Equipo:</span> <span className="font-bold">{seleccionado.equipo}</span></div>
              <div className="flex justify-between"><span>Modelo:</span> <span className="font-bold">{seleccionado.marca}</span></div>
              <div className="flex justify-between"><span>Fecha:</span> <span className="font-bold">{new Date().toLocaleDateString()}</span></div>
              <div className="pt-2 border-t border-dashed">
                <p className="text-center font-bold text-red-600 uppercase text-xs">Garantía válida por: 30 días</p>
                <p className="text-[9px] text-slate-400 text-center italic mt-1">Sujeto a sellos de seguridad intactos.</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => setSeleccionado(null)} className="flex-1 py-2 text-slate-400 font-bold text-sm">CANCELAR</button>
              <button 
                onClick={confirmarEntrega} 
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold text-sm shadow-md"
              >
                {loading ? 'PROCESANDO...' : 'ACEPTAR ENTREGA'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}