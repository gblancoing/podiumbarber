'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import type { Booking } from '../../../lib/types';
import { RecentBookings } from '../dashboard/RecentBookings';
import { handleBookingUpdateSimple, handleBookingDeleteSimple } from '../actions-wrapper-simple';

export const dynamic = 'force-dynamic';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setError("Error crítico: Conexión con la base de datos no disponible.");
            setLoading(false);
            return;
        }

        // Solo mostrar reservas confirmadas y canceladas (NO eliminadas ni completadas)
        const bookingsQuery = query(
            collection(db, 'bookings'), 
            where('status', 'in', ['confirmed', 'canceled'])
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

    const handleUpdate = async (bookingId: string, updates: Partial<Booking>) => {
        await handleBookingUpdateSimple(bookingId, updates);
    };

    const handleDelete = async (bookingId: string) => {
        await handleBookingDeleteSimple(bookingId);
    };

    return (
        <div className="flex flex-col gap-8">
            <RecentBookings 
                bookings={bookings} 
                onBookingUpdate={handleUpdate}
                onBookingDelete={handleDelete}
            />
        </div>
    );
}
