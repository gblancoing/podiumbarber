import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, deleteDoc, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function deleteAndresLeyton() {
  try {
    console.log('Inicializando Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('Buscando estilistas en Firebase...');
    const stylistsCollection = collection(db, 'stylists');
    const stylistsSnapshot = await getDocs(stylistsCollection);
    
    console.log(`Encontrados ${stylistsSnapshot.size} estilistas en Firebase:`);
    
    let andresFound = false;
    stylistsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${doc.id}: ${data.name}`);
      
      if (data.name && data.name.toLowerCase().includes('andres')) {
        console.log(`🎯 ENCONTRADO: ${data.name} (ID: ${doc.id})`);
        andresFound = true;
      }
    });

    if (andresFound) {
      console.log('\n🗑️ Eliminando Andrés Leyton de Firebase...');
      
      // Buscar y eliminar documentos que contengan "andres" en el nombre
      stylistsSnapshot.forEach(async (doc) => {
        const data = doc.data();
        if (data.name && data.name.toLowerCase().includes('andres')) {
          console.log(`Eliminando: ${data.name} (${doc.id})`);
          await deleteDoc(doc.ref);
          console.log(`✅ Eliminado exitosamente`);
        }
      });
      
      console.log('\n🎉 ¡Andrés Leyton eliminado de Firebase!');
      console.log('El sitio web debería actualizarse automáticamente.');
    } else {
      console.log('\n❌ No se encontró Andrés Leyton en Firebase.');
      console.log('El problema puede estar en el caché del sitio web.');
    }

  } catch (error) {
    console.error('Error eliminando Andrés Leyton:', error);
    process.exit(1);
  }
}

deleteAndresLeyton();
