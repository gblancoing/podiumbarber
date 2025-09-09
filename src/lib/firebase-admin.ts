'use server';

import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// --- Variable para almacenar la instancia de la base de datos ---
let dbAdmin: admin.firestore.Firestore;

/**
 * Función para obtener la instancia de Firestore Admin.
 * Sigue el patrón Singleton para asegurar una única inicialización.
 */
function getDbAdmin() {
    // Si la instancia ya fue creada, la retornamos.
    if (dbAdmin) {
        return dbAdmin;
    }

    // Si el SDK de Admin aún no se ha inicializado en ninguna parte de la aplicación...
    if (!admin.apps.length) {
        try {
            // Verificamos si la variable de entorno con la clave está presente.
            if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
                throw new Error('La variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY no está definida.');
            }

            // Parseamos la clave de la cuenta de servicio desde la variable de entorno.
            const serviceAccount = JSON.parse(
                process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
            );

            // Inicializamos la aplicación de Firebase Admin.
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });

            console.log("Firebase Admin SDK inicializado con éxito.");

        } catch (error) {
            console.error('Error CRÍTICO en la inicialización de Firebase Admin SDK:', error);
            // Si la inicialización falla, lanzamos un error para que la acción que lo llamó lo capture.
            // Esto evita que la aplicación se caiga por completo.
            throw new Error('No se pudo inicializar Firebase Admin. La configuración del servidor es incorrecta.');
        }
    }

    // Obtenemos la instancia de Firestore y la guardamos en la variable local.
    dbAdmin = getFirestore();
    return dbAdmin;
}

// Exportamos la función que obtiene la instancia de la base de datos.
// De esta forma, cualquier acción que necesite la base de datos llamará a esta función.
export { getDbAdmin };
