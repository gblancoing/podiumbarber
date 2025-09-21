#!/usr/bin/env node

// Script para eliminar Andrés Leyton de Firebase
// Este script debe ejecutarse con las variables de entorno de Vercel

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, deleteDoc, getDocs } = require('firebase/firestore');

// Las variables de entorno deben estar configuradas en Vercel
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
    console.log('🔍 Verificando configuración de Firebase...');
    
    if (!firebaseConfig.apiKey) {
      console.error('❌ Error: NEXT_PUBLIC_FIREBASE_API_KEY no está configurada');
      console.log('💡 Solución: Ejecuta este script en Vercel o configura las variables de entorno localmente');
      process.exit(1);
    }

    console.log('✅ Firebase configurado correctamente');
    console.log('🚀 Inicializando conexión...');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('📋 Buscando estilistas en Firebase...');
    const stylistsCollection = collection(db, 'stylists');
    const stylistsSnapshot = await getDocs(stylistsCollection);
    
    console.log(`📊 Encontrados ${stylistsSnapshot.size} estilistas:`);
    
    let andresFound = false;
    const stylistsToDelete = [];
    
    stylistsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`   - ${doc.id}: ${data.name}`);
      
      if (data.name && data.name.toLowerCase().includes('andres')) {
        console.log(`🎯 ENCONTRADO: ${data.name} (ID: ${doc.id})`);
        stylistsToDelete.push({ id: doc.id, name: data.name, ref: doc.ref });
        andresFound = true;
      }
    });

    if (andresFound) {
      console.log(`\n🗑️ Eliminando ${stylistsToDelete.length} estilista(s) llamado(s) Andrés...`);
      
      for (const stylist of stylistsToDelete) {
        console.log(`   Eliminando: ${stylist.name} (${stylist.id})`);
        await deleteDoc(stylist.ref);
        console.log(`   ✅ Eliminado exitosamente`);
      }
      
      console.log('\n🎉 ¡Andrés Leyton eliminado de Firebase!');
      console.log('🌐 El sitio web debería actualizarse automáticamente en unos minutos.');
      console.log('🔍 Verifica en: https://podiumbarber.cl/');
    } else {
      console.log('\n❌ No se encontró ningún estilista llamado Andrés en Firebase.');
      console.log('🤔 El problema puede estar en:');
      console.log('   - Caché del sitio web');
      console.log('   - Datos hardcodeados en el frontend');
      console.log('   - Otra fuente de datos');
    }

  } catch (error) {
    console.error('💥 Error eliminando Andrés Leyton:', error);
    process.exit(1);
  }
}

deleteAndresLeyton();
