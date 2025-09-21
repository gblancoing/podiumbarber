// Script para sobrescribir Firebase con datos correctos (solo 2 estilistas)
// Este script se ejecutará en Vercel donde están las variables de entorno

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Datos correctos (solo 2 estilistas)
const correctStylists = [
  {
    id: 'stiven-vargas',
    name: 'Stiven Vargas',
    bio: 'Especialista en cortes modernos y diseños de barba. Stiven combina precisión técnica con un estilo urbano para crear looks únicos y a la vanguardia.',
    avatarUrl: '/img/steven.png',
    specialties: ['Cortes Urbanos', 'Diseño de Barba', 'Color'],
    services: ['corte-pelo', 'corte-diseno', 'corte-escolar', 'barba-toalla-caliente', 'perfilado-cejas', 'mascarilla-negra'],
    workingHours: {
      lunes: { start: '10:00', end: '19:00' },
      martes: { start: '10:00', end: '19:00' },
      miércoles: { start: '10:00', end: '19:00' },
      jueves: { start: '10:00', end: '19:00' },
      viernes: { start: '10:00', end: '19:00' },
      sábado: { start: '10:00', end: '16:00' },
      domingo: null,
    },
  },
  {
    id: 'kamilo-fonseca',
    name: 'Kamilo Fonseca',
    bio: 'Un maestro de la barbería clásica y los cortes tradicionales. Kamilo se enfoca en la experiencia del cliente, asegurando un servicio relajante y un acabado impecable en cada visita.',
    avatarUrl: '/img/camilo.png',
    specialties: ['Cortes Clásicos', 'Afeitado Tradicional', 'Barbería'],
    services: ['corte-pelo', 'corte-diseno', 'corte-escolar', 'barba-toalla-caliente', 'perfilado-cejas', 'mascarilla-negra'],
    workingHours: {
      lunes: { start: '10:00', end: '19:00' },
      martes: { start: '10:00', end: '19:00' },
      miércoles: { start: '10:00', end: '19:00' },
      jueves: { start: '10:00', end: '19:00' },
      viernes: { start: '10:00', end: '19:00' },
      sábado: { start: '10:00', end: '16:00' },
      domingo: null,
    },
  },
];

async function fixStylistsInFirebase() {
  try {
    console.log('🔧 Iniciando corrección de estilistas en Firebase...');
    
    if (!firebaseConfig.apiKey) {
      console.error('❌ Variables de Firebase no configuradas');
      process.exit(1);
    }

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('📝 Sobrescribiendo estilistas en Firebase...');
    
    const stylistsCollection = collection(db, 'stylists');
    const batch = writeBatch(db);
    
    // Sobrescribir cada estilista correcto
    correctStylists.forEach(stylist => {
      const docRef = doc(stylistsCollection, stylist.id);
      batch.set(docRef, stylist);
      console.log(`✅ Configurado: ${stylist.name}`);
    });
    
    await batch.commit();
    
    console.log('🎉 ¡Firebase actualizado correctamente!');
    console.log('🌐 El sitio web debería mostrar solo Stiven Vargas y Kamilo Fonseca');
    console.log('🔍 Verifica en: https://podiumbarber.cl/stylists');
    
  } catch (error) {
    console.error('💥 Error actualizando Firebase:', error);
    process.exit(1);
  }
}

fixStylistsInFirebase();
