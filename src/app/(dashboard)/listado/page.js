'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';

function ListadoContenido() {
  const [equipos, setEquipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [abonos, setAbonos] = useState({}); // Estado local para manejar los inputs de abono
  const searchParams = useSearchParams();
  const router = useRouter();
  const filtroURL = searchParams.get('filtro');

  useEffect(() => {
    if (filtroURL && filtroURL !== "Deuda") {
      setBusqueda(filtroURL);
    } else if (!filtroURL) {
      setBusqueda("");
    }

    const q = query(collection(db, "equipos"), orderBy("fechaEntrada", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setEquipos(docs);
    });
    return () => unsubscribe();
  }, [filtroURL]);

  // Función para registrar un abono parcial
  const registrarAbono = async (id, restanteActual, adelantoActual) => {
    const montoAbono = Number(abonos[id]);

    if (!montoAbono || montoAbono <= 0) {
      alert("Por favor ingresa un monto válido para abonar.");
      return;
    }

    if (montoAbono > restanteActual) {
      alert("El abono no puede ser mayor a lo que el cliente debe.");
      return;
    }

    const nuevoRestante = restanteActual - montoAbono;
    const nuevoAdelanto = adelantoActual + montoAbono;

    try {
      await updateDoc(doc(db, "equipos", id), {
        adelanto: nuevoAdelanto,
        restante: nuevoRestante,
        pagadoCompletamente: nuevoRestante === 0
      });
      
      // Limpiar el input de abono después de actualizar
      setAbonos({ ...abonos, [id]: "" });
      alert(nuevoRestante === 0 ? "¡Deuda liquidada!" : `Abono de $${montoAbono} registrado.`);
    } catch (e) {
      console.error("Error al abonar:", e);
    }
  };

  const manejarCambioAbono = (id, valor) => {
    setAbonos({ ...abonos, [id]: valor });
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, "equipos", id), { estado: nuevoEstado });
    } catch (e) { console.error(e); }
  };

  const equiposFiltrados = equipos.filter((item) => {
    if (filtroURL === "Deuda") return Number(item.restante) > 0;
    const termino = busqueda.toLowerCase();
    return (
      item.cliente?.toLowerCase().includes(termino) ||
      item.equipo?.toLowerCase().includes(termino) ||
      item.marca?.toLowerCase().includes(termino) ||
      item.estado?.toLowerCase().includes(termino)
    );
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800">
            {filtroURL === 'Deuda' ? 'Control de Pagos y Abonos 💰' : 'Equipos en Taller'}
          </h1>
          {filtroURL && (
            <button 
              onClick={() => router.push('/dashboard')} 
              className="text-[10px] bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-md font-bold transition"
            >
              ← VOLVER AL DASHBOARD
            </button>
          )}
        </div>
        {/* ... Buscador se mantiene igual ... */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">
              <th className="p-4">Cliente / Equipo</th>
              <th className="p-4 text-center">Estado Técnico</th>
              <th className="p-4 text-right">Situación Financiera</th>
            </tr>
          </thead>
          <tbody className="divide-y text-slate-700">
            {equiposFiltrados.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4">
                  <p className="font-bold text-slate-900">{item.cliente}</p>
                  <p className="text-xs text-slate-500">{item.equipo} ({item.marca})</p>
                </td>
                
                <td className="p-4 text-center">
                  <select
                    value={item.estado}
                    onChange={(e) => actualizarEstado(item.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border-none outline-none cursor-pointer ${
                      item.estado === 'En Espera' ? 'bg-amber-100 text-amber-700' : 
                      item.estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' : 
                      'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <option value="En Espera">⏳ En Espera</option>
                    <option value="En Proceso">⚙️ En Proceso</option>
                    <option value="Listo">✅ Listo</option>
                  </select>
                </td>

                <td className="p-4 text-right">
                  {Number(item.restante) > 0 ? (
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs">
                        <span className="text-slate-400">Total: ${item.precioTotal} | </span>
                        <span className="text-red-500 font-bold italic text-sm underline">Debe: ${item.restante}</span>
                      </div>
                      
                      {/* Únicamente disponible en la lógica de cobro */}
                      <div className="flex gap-1 items-center justify-end">
                        <input 
                          type="number"
                          placeholder="Monto $"
                          value={abonos[item.id] || ""}
                          onChange={(e) => manejarCambioAbono(item.id, e.target.value)}
                          className="w-20 p-1 text-xs border border-slate-300 rounded outline-none focus:ring-1 focus:ring-blue-500 text-black"
                        />
                        <button 
                          onClick={() => registrarAbono(item.id, item.restante, item.adelanto)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2 py-1.5 rounded transition"
                        >
                          ABONAR
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Precio Total: ${item.precioTotal}</p>
                      <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200">
                        PAGADO TOTAL ✅
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ListadoEquipos() {
    return ( <Suspense fallback={null}><ListadoContenido /></Suspense> );
}