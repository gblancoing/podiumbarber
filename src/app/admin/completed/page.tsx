'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import type { Booking } from '../../../lib/types';
import { CompletedBookings } from '../dashboard/CompletedBookings';

export const dynamic = 'force-dynamic';

export default function CompletedPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setError("Error crítico: Conexión con la base de datos no disponible.");
            setLoading(false);
            return;
        }

        // Solo mostrar reservas completadas
        const bookingsQuery = query(
            collection(db, 'bookings'), 
            where('status', '==', 'completed')
        );

        const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
            const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
            setBookings(bookingsData);
            setLoading(false);
        }, (err) => {
            console.error("Error al cargar las reservas:", err);
            setError("No se pudieron cargar las reservas. Verifica los permisos de lectura de Firestore.");
            setLoading(false);
        });

        return () => {
            unsubscribeBookings();
        };
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Cargando reservas...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <CompletedBookings bookings={bookings} />
        </div>
    );
}
