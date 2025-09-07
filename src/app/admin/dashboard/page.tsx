'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Booking, Service, Stylist } from '../../../lib/types';
import { DashboardStats } from './DashboardStats';
import { RecentBookings } from './RecentBookings';

// Forzar a la página a que no use caché y sea dinámica
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Si la conexión a la base de datos no está disponible, detenemos todo.
        if (!db) {
            setError("Error crítico: No se pudo establecer la conexión con la base de datos.");
            setLoading(false);
            return;
        }

        setLoading(true);
        const bookingsQuery = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
        const servicesQuery = query(collection(db, 'services'));
        const stylistsQuery = query(collection(db, 'stylists'));

        const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
            const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
            setBookings(bookingsData);
        }, (err) => {
            console.error("Error al cargar reservas:", err);
            setError("No se pudieron cargar las reservas.");
        });

        const unsubscribeServices = onSnapshot(servicesQuery, (snapshot) => {
            const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
            setServices(servicesData);
        }, (err) => {
            console.error("Error al cargar servicios:", err);
            setError("No se pudieron cargar los datos de servicios.");
        });

        const unsubscribeStylists = onSnapshot(stylistsQuery, (snapshot) => {
            const stylistsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Stylist[];
            setStylists(stylistsData);
             setLoading(false); // Marcar como cargado solo después de la última consulta
        }, (err) => {
            console.error("Error al cargar estilistas:", err);
            setError("No se pudieron cargar los datos de estilistas.");
            setLoading(false);
        });

        // Limpiar la suscripción al desmontar el componente
        return () => {
            unsubscribeBookings();
            unsubscribeServices();
            unsubscribeStylists();
        };
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Cargando datos del dashboard...</div>;
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
