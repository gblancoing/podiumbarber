'use server';

import { dbAdmin } from '@/lib/firebase-admin'; // Usamos la nueva conexión de admin
import { FieldValue } from 'firebase-admin/firestore';
import { services, stylists } from '@/lib/data';
import { sendBookingConfirmationEmail } from './email';

// El tipo de entrada no cambia.
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
        // Buscamos los datos completos del servicio y estilista.
        const service = services.find(s => s.id === bookingInput.serviceId);
        const stylist = stylists.find(s => s.id === bookingInput.stylistId);

        if (!service || !stylist) {
            return { success: false, error: "Servicio o estilista no válido." };
        }

        // Construimos el objeto a guardar, usando FieldValue.serverTimestamp() de admin.
        const bookingToSave = {
            ...bookingInput,
            serviceName: service.name,
            stylistName: stylist.name,
            price: service.price,
            createdAt: FieldValue.serverTimestamp(), // Correcto para el SDK de Admin
            status: 'confirmed' as const,
        };

        // Guardamos en la colección "reservations" usando la instancia de admin.
        const docRef = await dbAdmin.collection("reservations").add(bookingToSave);
        console.log(`Reserva ${docRef.id} creada con éxito usando Admin SDK.`);

        // Enviamos el correo de confirmación.
        await sendBookingConfirmationEmail(docRef.id, bookingToSave);

        return {
            success: true,
            bookingId: docRef.id,
        };

    } catch (error) {
        console.error("Error FATAL al guardar la reserva con Admin SDK:", error);
        return {
            success: false,
            error: "No se pudo confirmar la reserva en el servidor. Por favor, contacta a soporte.",
        };
    }
}
