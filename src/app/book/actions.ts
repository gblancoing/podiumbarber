'use server';

import { dbAdmin } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
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
            createdAt: FieldValue.serverTimestamp(),
            status: 'confirmed' as const,
        };

        const docRef = await dbAdmin.collection("reservations").add(bookingToSave);
        console.log(`Reserva ${docRef.id} creada con éxito usando Admin SDK.`);

        // **CORRECCIÓN DEFINITIVA:**
        // Enviamos el objeto `bookingInput` original, que contiene los IDs.
        // La función de email y la IA se encargarán del resto.
        await sendBookingConfirmationEmail(docRef.id, bookingInput);

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
