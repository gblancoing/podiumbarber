'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { Booking } from '../../../lib/types';
import { RecentBookings } from '../dashboard/RecentBookings';
import { updateBooking, deleteBooking } from '../actions';

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

        const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));

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

    const handleBookingUpdate = async (bookingId: string, updates: Partial<Booking>) => {
        const success = await updateBooking(bookingId, updates);
        if (success) {
            // La actualización se reflejará automáticamente gracias al listener de Firebase
            console.log('Reserva actualizada:', bookingId, updates);
        }
    };

    const handleBookingDelete = async (bookingId: string) => {
        const success = await deleteBooking(bookingId);
        if (success) {
            // La eliminación se reflejará automáticamente gracias al listener de Firebase
            console.log('Reserva eliminada:', bookingId);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <RecentBookings 
                bookings={bookings} 
                onBookingUpdate={handleBookingUpdate}
                onBookingDelete={handleBookingDelete}
            />
        </div>
    );
}
