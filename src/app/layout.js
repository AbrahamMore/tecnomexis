// src/app/layout.js
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/* Aquí solo el body base, sin clases de diseño pesadas */}
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}