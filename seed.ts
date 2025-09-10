
import * as fs from 'fs';
import * as path from 'path';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { services, stylists } from './src/lib/data';

// Función para analizar el contenido del archivo .env
function parseEnv(envContent: string) {
    const envConfig: { [key: string]: string } = {};
    const lines = envContent.split('\n');
    for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            // Eliminar comillas circundantes
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
                value = value.slice(1, -1);
            }
            envConfig[key] = value;
        }
    }
    return envConfig;
}

async function seedDatabase() {
    try {
        // Leer y analizar .env.local
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            throw new Error(".env.local file not found!");
        }
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const envConfig = parseEnv(envContent);

        // Crear configuración de Firebase
        const firebaseConfig = {
            apiKey: envConfig.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: envConfig.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: envConfig.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: envConfig.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: envConfig.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: envConfig.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        // Verificar si todos los valores de configuración están presentes
        for (const key in firebaseConfig) {
            if (!firebaseConfig[key as keyof typeof firebaseConfig]) {
                throw new Error(`Missing Firebase config value in .env.local for: ${key}`);
            }
        }

        // Inicializar la aplicación de Firebase
        let app;
        const appName = "database-seeder";
        if (getApps().find(app => app.name === appName)) {
            app = getApp(appName);
        } else {
            app = initializeApp(firebaseConfig, appName);
        }

        const db = getFirestore(app);

        console.log("Iniciando la siembra de la base de datos...");

        const servicesCollection = collection(db, 'services');
        const stylistsCollection = collection(db, 'stylists');

        // Sembrar servicios
        const servicesBatch = writeBatch(db);
        services.forEach(service => {
            const docRef = doc(servicesCollection, service.id);
            servicesBatch.set(docRef, service);
        });
        await servicesBatch.commit();
        console.log(`${services.length} servicios han sido sembrados/actualizados exitosamente.`);

        // Sembrar estilistas
        const stylistsBatch = writeBatch(db);
        stylists.forEach(stylist => {
            const docRef = doc(stylistsCollection, stylist.id);
            stylistsBatch.set(docRef, stylist);
        });
        await stylistsBatch.commit();
        console.log(`${stylists.length} estilistas han sido sembrados/actualizados exitosamente.`);

        console.log("¡La base de datos ha sido sembrada exitosamente!");

    } catch (error) {
        console.error("Error sembrando la base de datos:", error);
        process.exit(1); // Salir con un código de error
    }
}

seedDatabase();
