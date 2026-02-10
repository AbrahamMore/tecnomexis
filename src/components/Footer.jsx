// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-600 py-6 mt-auto border-t">
      <div className="container mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} Tecnomexis - Sistema de Gestión de Reparaciones</p>
        <p className="mt-2 text-slate-400 italic">"Calidad y rapidez en cada reparación"</p>
      </div>
    </footer>
  );
}