
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");

// Copia aquí tu configuración de Firebase
// La encontrarás en tu archivo `src/lib/firebase.ts` o en la consola de Firebase.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Los datos de tu archivo data.ts
const services = [
  {
    id: 'corte-pelo',
    name: 'Corte de Pelo',
    price: 15000,
  },
  {
    id: 'corte-diseno',
    name: 'Corte de Pelo + Diseño Free o Lineas',
    price: 17000,
  },
  {
    id: 'corte-escolar',
    name: 'Corte Escolar Clasico (sin degrade)',
    price: 13000,
  },
  {
    id: 'barba-toalla-caliente',
    name: 'Barba con Toalla Caliente',
    price: 10000,
  },
  {
    id: 'perfilado-cejas',
    name: 'Perfilado de Cejas',
    price: 5000,
  },
  {
    id: 'mascarilla-negra',
    name: 'Mascarilla Negra',
    price: 5000,
  },
];

const stylists = [
  {
    id: 'stiven-vargas',
    name: 'Stiven Vargas',
  },
  {
    id: 'kamilo-fonseca',
    name: 'Kamilo Fonseca',
  },
];

async function seedDatabase() {
  try {
    console.log("Inicializando Firebase...");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firebase inicializado.");

    console.log("Sembrando servicios...");
    const servicesCollection = collection(db, 'services');
    for (const service of services) {
      const docRef = doc(servicesCollection, service.id);
      await setDoc(docRef, service);
      console.log(`  -> Servicio '${service.name}' guardado.`);
    }
    console.log("Servicios sembrados con éxito.");

    console.log("Sembrando estilistas...");
    const stylistsCollection = collection(db, 'stylists');
    for (const stylist of stylists) {
      const docRef = doc(stylistsCollection, stylist.id);
      await setDoc(docRef, stylist);
      console.log(`  -> Estilista '${stylist.name}' guardado.`);
    }
    console.log("Estilistas sembrados con éxito.");

    console.log("\n¡Siembra de la base de datos completada!");
    process.exit(0);
  } catch (error) {
    console.error("Error sembrando la base de datos:", error);
    process.exit(1);
  }
}

seedDatabase();

