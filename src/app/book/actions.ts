'use server';

import { getDbAdmin } from '@/lib/firebase-admin';
// Se elimina la importación de FieldValue de la cabecera.
// import { FieldValue } from 'firebase-admin/firestore';
import { services, stylists } from '@/lib/data';
import { sendBookingConfirmationEmail } from './email';

type BookingInput = {
    serviceId: string;
    stylistId: string;
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
};

export async function saveBooking(bookingInput: BookingInput) {
    try {
        // Obtenemos la instancia de la base de datos de forma segura.
        const db = getDbAdmin();

        // **LA CORRECCIÓN FINAL Y ABSOLUTA:**
        // Importamos FieldValue de forma dinámica y segura DENTRO del bloque try/catch.
        // Esto evita que el servidor se caiga al cargar si la configuración de Firebase es incorrecta.
        const { FieldValue } = await import('firebase-admin/firestore');

        const service = services.find(s => s.id === bookingInput.serviceId);
        const stylist = stylists.find(s => s.id === bookingInput.stylistId);

        if (!service || !stylist) {
            return { success: false, error: "Servicio o estilista no válido." };
        }

        const bookingToSave = {
            ...bookingInput,
            serviceName: service.name,
            stylistName: stylist.name,
            price: service.price,
            createdAt: FieldValue.serverTimestamp(), // Ahora esto es 100% seguro
            status: 'confirmed' as const,
        };

        const docRef = await db.collection("reservations").add(bookingToSave);
        console.log(`Reserva ${docRef.id} creada con éxito.`);

        await sendBookingConfirmationEmail(docRef.id, bookingInput);

        return {
            success: true,
            bookingId: docRef.id,
        };

    } catch (error) {
        console.error("Error FATAL al guardar la reserva:", error);
        return {
            success: false,
            error: "No se pudo confirmar la reserva en el servidor. Por favor, contacta a soporte.",
        };
    }
}
