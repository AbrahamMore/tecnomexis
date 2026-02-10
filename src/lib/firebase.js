// src/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBypEAEP6hcKCe8eUVW34akVXoCOJEM5rk",
  authDomain: "tecnomexis-5e13e.firebaseapp.com",
  projectId: "tecnomexis-5e13e",
  storageBucket: "tecnomexis-5e13e.firebasestorage.app",
  messagingSenderId: "62822071498",
  appId: "1:62822071498:web:bf7bbe0d290896a48b0833"
};

// Si ya existe una instancia de la app, úsala; si no, inicialízala.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Exportamos las herramientas para usarlas en otros archivos
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;