'use server';

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Este archivo es SOLO para el servidor.

// Comprobamos si el SDK de Admin ya ha sido inicializado.
// Esto es importante en entornos de desarrollo para evitar errores de recarga en caliente.
if (!admin.apps.length) {
  try {
    // El SDK de Admin se configura de forma más segura usando una "Service Account".
    // Esta es una clave JSON que se debe almacenar en una variable de entorno privada.
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK inicializado con éxito.");

  } catch (error) {
    console.error('Error CRÍTICO en la inicialización de Firebase Admin SDK:', error);
    // Si esto falla, es un problema de configuración del entorno que debe ser solucionado.
    // La aplicación no podrá escribir en la base de datos.
  }
}

// Exportamos la instancia de la base de datos de Firestore para usarla en las acciones del servidor.
// Si la inicialización falló, `dbAdmin` podría no funcionar, pero el error ya se habrá registrado.
const dbAdmin = getFirestore();

export { dbAdmin };
