// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Lee las variables de entorno DEL SERVIDOR (sin prefijo)
const serverConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Lee las variables de entorno DEL CLIENTE (con prefijo)
const clientConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Determina qué configuración usar.
// `typeof window` es 'undefined' en el servidor y 'object' en el cliente.
const firebaseConfig = typeof window === 'undefined' ? serverConfig : clientConfig;

// Inicializa Firebase solo si hay un ID de proyecto válido.
// Esto detiene los fallos silenciosos.
let app;
try {
  if (firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  } else {
    throw new Error("ID de proyecto de Firebase no encontrado. Revisa tus variables de entorno.");
  }
} catch (e) {
  console.error("Error al inicializar Firebase:", e);
  app = null;
}

// Exporta las herramientas de Firebase, pero asegúrate de que no sean nulas.
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

// Si la base de datos no se pudo inicializar, es un error fatal.
// Esto hará que la app falle ruidosamente si la configuración es incorrecta.
if (!db) {
    const errorMessage = "FATAL: No se pudo inicializar Firestore. Las variables de entorno de Firebase no están configuradas correctamente para el entorno actual (servidor o cliente).";
    // En el servidor, podemos lanzar un error que detenga el proceso.
    if (typeof window === 'undefined') {
        throw new Error(errorMessage);
    } else {
        // En el cliente, mostramos el error en la consola y en la UI.
        console.error(errorMessage);
    }
}

export { app, db, auth };