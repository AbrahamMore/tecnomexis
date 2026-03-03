// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#D0182B] text-white/90 py-4 mt-auto shadow-inner shadow-black/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-center md:text-left">
            <p className="text-base font-bold tracking-tight text-white">
              TECNOMEXIS
            </p>
            <p className="text-xs text-white/70 mt-0.5">
              Sistema de Gestión de Reparaciones
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-white/90 text-xs md:text-sm">
              © {new Date().getFullYear()} Todos los derechos reservados
            </p>
            <p className="mt-1 text-white/60 text-xs italic font-light">
              "Calidad y rapidez en cada reparación"
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-[10px] text-white/50">
              Versión 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}