
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- Configuración de Firebase ---
// Esta configuración se utiliza tanto en el cliente como en el servidor.
// Las variables de entorno con el prefijo NEXT_PUBLIC_ están disponibles en ambos lados.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// --- Inicialización de la Aplicación de Firebase ---

let app;
// getApps() devuelve un array de todas las apps de Firebase inicializadas.
// Si el array no está vacío, significa que ya hemos inicializado la app,
// así que la reutilizamos con getApp(). Si no, la creamos con initializeApp().
// Esto previene errores de "Firebase app ya existe" en entornos de desarrollo con recarga rápida (HMR).
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// --- Exportación de los Servicios de Firebase ---

// getFirestore() nos da acceso a la base de datos de Firestore.
const db = getFirestore(app);

// getAuth() nos da acceso al servicio de autenticación de Firebase.
const auth = getAuth(app);

// --- Verificación de la Inicialización ---
// Si la base de datos no se pudo inicializar, es un error fatal.
// Esto hará que la app falle ruidosamente si la configuración es incorrecta.
if (!db) {
    const errorMessage = "FATAL: No se pudo inicializar Firestore. Las variables de entorno de Firebase no están configuradas correctamente.";
    // En el servidor, lanzamos un error que detiene el proceso.
    if (typeof window === 'undefined') {
        throw new Error(errorMessage);
    } else {
        // En el cliente, lo mostramos en la consola para depuración.
        console.error(errorMessage);
    }
}

export { app, db, auth };
