'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import type { Booking } from '../../../lib/types';
import { DeletedBookings } from "../dashboard/DeletedBookings";
import { handleBookingRestore } from "../actions-wrapper-simple";

export const dynamic = 'force-dynamic';

export default function DeletedBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setError("Error crítico: Conexión con la base de datos no disponible.");
            setLoading(false);
            return;
        }

        // Solo mostrar reservas eliminadas
        const bookingsQuery = query(
            collection(db, 'bookings'), 
            where('status', '==', 'deleted'),
            orderBy('deletedAt', 'desc')
        );

        const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
            const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
            setBookings(bookingsData);
            setLoading(false);
        }, (err) => {
            console.error("Error al cargar las reservas eliminadas:", err);
            setError("No se pudieron cargar las reservas eliminadas. Verifica los permisos de lectura de Firestore.");
            setLoading(false);
        });

        return () => {
            unsubscribeBookings();
        };
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Cargando reservas eliminadas...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Reservas Eliminadas</h1>
                <p className="text-muted-foreground">
                    Aquí están las reservas que han sido eliminadas del sistema.
                </p>
            </div>
            
            <DeletedBookings bookings={bookings} onBookingRestore={handleBookingRestore} />
        </div>
    );
}