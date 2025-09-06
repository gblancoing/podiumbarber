'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Booking, Service, Stylist } from '@/lib/types';
import { DashboardStats } from './DashboardStats';
import { RecentBookings } from './RecentBookings';

// --- Componente Cliente para el Dashboard ---

export function DashboardClient() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [stylists, setStylists] = useState<Stylist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Obtener Reservas (Bookings)
                const bookingsCol = collection(db, 'reservations');
                const bookingsQuery = query(bookingsCol, orderBy('createdAt', 'desc'));
                const bookingsSnapshot = await getDocs(bookingsQuery);
                const bookingsList = bookingsSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        // Asegurarse que `createdAt` es un objeto Date para consistencia
                        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
                    } as Booking;
                });

                // 2. Obtener Servicios (Services)
                const servicesCol = collection(db, 'services');
                const servicesSnapshot = await getDocs(servicesCol);
                const servicesList = servicesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                } as Service));

                // 3. Obtener Estilistas (Stylists)
                const stylistsCol = collection(db, 'stylists');
                const stylistsSnapshot = await getDocs(stylistsCol);
                const stylistsList = stylistsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                } as Stylist));

                setBookings(bookingsList);
                setServices(servicesList);
                setStylists(stylistsList);
                setError(null);

            } catch (err) {
                console.error("Error al cargar datos de Firebase:", err);
                setError('No se pudieron cargar los datos. Revisa la conexión con Firebase.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []); // El array vacío significa que esto se ejecuta una vez, cuando el componente carga.

    if (loading) {
        return <div>Cargando dashboard...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <DashboardStats bookings={bookings} services={services} />
            <RecentBookings bookings={bookings} services={services} stylists={stylists} />
        </div>
    );
}
