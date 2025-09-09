'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, orderBy, getDocs, writeBatch, doc } from 'firebase/firestore';
import type { Booking, Service, Stylist } from '../../../lib/types';
import { services as staticServices, stylists as staticStylists } from '../../../lib/data';
import { DashboardStats } from './DashboardStats';
import { RecentBookings } from './RecentBookings';

export const dynamic = 'force-dynamic';

// Esta función asegura que la base de datos tenga los servicios y estilistas base si está vacía.
async function seedDatabase() {
  if (!db) return;

  const servicesCollection = collection(db, 'services');
  const stylistsCollection = collection(db, 'stylists');

  // Pre-carga los servicios si no existen
  const servicesSnapshot = await getDocs(servicesCollection);
  if (servicesSnapshot.empty) {
    const batch = writeBatch(db);
    staticServices.forEach(service => {
      const docRef = doc(db, 'services', service.id);
      batch.set(docRef, service);
    });
    await batch.commit();
  }

  // Pre-carga los estilistas si no existen
  const stylistsSnapshot = await getDocs(stylistsCollection);
  if (stylistsSnapshot.empty) {
    const batch = writeBatch(db);
    staticStylists.forEach(stylist => {
      const docRef = doc(db, 'stylists', stylist.id);
      batch.set(docRef, stylist);
    });
    await batch.commit();
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

        // Primero, asegura que la BD esté poblada, y luego escucha los cambios.
        seedDatabase().then(() => {
            const bookingsQuery = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
            const servicesQuery = query(collection(db, 'services'));
            const stylistsQuery = query(collection(db, 'stylists'));

            // Escucha las reservas en tiempo real
            const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
                const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
                setBookings(bookingsData);
            }, (err) => {
                setError("No se pudieron cargar las reservas.");
                setLoading(false); // FIX: Asegura que el loading termine en caso de error
            });

            // Escucha los servicios en tiempo real
            const unsubscribeServices = onSnapshot(servicesQuery, (snapshot) => {
                const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
                setServices(servicesData);
            }, (err) => {
                setError("No se pudieron cargar los datos de servicios.");
                setLoading(false); // FIX: Asegura que el loading termine en caso de error
            });

            // Escucha los estilistas en tiempo real
            const unsubscribeStylists = onSnapshot(stylistsQuery, (snapshot) => {
                const stylistsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Stylist[];
                setStylists(stylistsData);
                setLoading(false); // El loading termina cuando los últimos datos necesarios llegan
            }, (err) => {
                setError("No se pudieron cargar los datos de estilistas.");
                setLoading(false);
            });

            // Limpieza: se desuscribe de los listeners cuando el componente se desmonta
            return () => {
                unsubscribeBookings();
                unsubscribeServices();
                unsubscribeStylists();
            };
        }).catch(err => {
            setError("Ocurrió un error al configurar los datos iniciales.");
            setLoading(false);
        });

    }, []); // El array vacío asegura que esto se ejecute solo una vez

    if (loading) {
        return <div className="flex items-center justify-center h-full">Cargando y verificando datos...</div>;
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
