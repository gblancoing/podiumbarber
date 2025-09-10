'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Booking } from '../../../lib/types';
import { DashboardStats } from './DashboardStats';
import { RecentBookings } from './RecentBookings';
import { services as staticServices, stylists as staticStylists } from '../../../lib/data';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setError("Error crítico: Conexión con la base de datos no disponible.");
            setLoading(false);
            return;
        }

        // Se establece un listener en tiempo real solo para la colección de reservas.
        const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));

        const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
            const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
            setBookings(bookingsData);
            setLoading(false); // La carga finaliza una vez que se tienen las reservas.
        }, (err) => {
            console.error("Error al cargar las reservas:", err);
            setError("No se pudieron cargar las reservas. Por favor, revisa la consola para más detalles.");
            setLoading(false);
        });

        // Limpieza: se desuscribe del listener cuando el componente se desmonta.
        return () => {
            unsubscribeBookings();
        };

    }, []); // El array vacío asegura que esto se ejecute solo una vez.

    if (loading) {
        return <div className="flex items-center justify-center h-full">Cargando reservas...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            {/* El componente de estadísticas ahora también usará los datos estáticos */}
            <DashboardStats bookings={bookings} services={staticServices} />
            
            {/* El componente de reservas recientes ya no necesita los props de servicios y estilistas */}
            <RecentBookings bookings={bookings} />
        </div>
    );
}
