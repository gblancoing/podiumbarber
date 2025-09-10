'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, orderBy, writeBatch, doc } from 'firebase/firestore';
import type { Booking, Service, Stylist } from '../../../lib/types';
import { services as staticServices, stylists as staticStylists } from '../../../lib/data';
import { DashboardStats } from './DashboardStats';
import { RecentBookings } from './RecentBookings';

export const dynamic = 'force-dynamic';

// Esta función fuerza la sincronización de los datos estáticos con Firestore.
// Esto asegura que la información de servicios y estilistas sea consistente en toda la aplicación.
async function syncFirestoreData() {
  if (!db) {
    console.error("Firestore no está inicializado.");
    return;
  }

  const batch = writeBatch(db);

  // Sobrescribe la colección de 'services' con los datos de /lib/data.ts
  staticServices.forEach(service => {
    const docRef = doc(db, 'services', service.id);
    batch.set(docRef, service);
  });

  // Sobrescribe la colección de 'stylists' con los datos de /lib/data.ts
  staticStylists.forEach(stylist => {
    const docRef = doc(db, 'stylists', stylist.id);
    batch.set(docRef, stylist);
  });

  try {
    await batch.commit();
    console.log("Datos de Firestore sincronizados con éxito.");
  } catch (error) {
    console.error("Error al sincronizar datos con Firestore:", error);
    throw new Error("No se pudieron sincronizar los datos base.");
  }
}

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setError("Error crítico: Conexión con la base de datos no disponible.");
            setLoading(false);
            return;
        }

        // Primero, se fuerza la sincronización de los datos, y luego se cargan las reservas.
        syncFirestoreData().then(() => {
            const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
            const servicesQuery = query(collection(db, 'services'));
            const stylistsQuery = query(collection(db, 'stylists'));

            // Escucha las reservas
            const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
                const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
                setBookings(bookingsData);
            }, (err) => setError("No se pudieron cargar las reservas."));

            // Escucha los servicios
            const unsubscribeServices = onSnapshot(servicesQuery, (snapshot) => {
                const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
                setServices(servicesData);
            }, (err) => setError("No se pudieron cargar los servicios."));

            // Escucha los estilistas
            const unsubscribeStylists = onSnapshot(stylistsQuery, (snapshot) => {
                const stylistsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Stylist[];
                setStylists(stylistsData);
                setLoading(false); // La carga finaliza cuando todos los datos están listos
            }, (err) => {
                setError("No se pudieron cargar los estilistas.");
                setLoading(false);
            });

            // Limpieza al desmontar el componente
            return () => {
                unsubscribeBookings();
                unsubscribeServices();
                unsubscribeStylists();
            };
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        });

    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Sincronizando y cargando datos...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <DashboardStats bookings={bookings} services={services} />
            <RecentBookings bookings={bookings} services={services} stylists={stylists} />
        </div>
    );
}
