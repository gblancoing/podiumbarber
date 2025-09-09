'use server';

import { getDbAdmin } from '@/lib/firebase-admin';
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
    let docRefId: string;

    // --- PASO 1: Guardar la reserva en la Base de Datos ---
    try {
        const db = getDbAdmin();
        const { FieldValue } = await import('firebase-admin/firestore');

        const service = services.find(s => s.id === bookingInput.serviceId);
        const stylist = stylists.find(s => s.id === bookingInput.stylistId);

        if (!service || !stylist) {
            throw new Error("Servicio o estilista no válido.");
        }

        const bookingToSave = {
            ...bookingInput,
            serviceName: service.name,
            stylistName: stylist.name,
            price: service.price,
            createdAt: FieldValue.serverTimestamp(),
            status: 'confirmed' as const,
        };

        const docRef = await db.collection("reservations").add(bookingToSave);
        docRefId = docRef.id;
        console.log(`Reserva ${docRefId} creada con éxito en la base de datos.`);

    } catch (dbError) {
        console.error("Error FATAL al guardar la reserva en la BD:", dbError);
        // Si la base de datos falla, es un error total y no podemos continuar.
        return {
            success: false,
            error: "No se pudo guardar la reserva en la base de datos. Por favor, intenta de nuevo.",
        };
    }

    // --- PASO 2: Intentar enviar el correo de confirmación ---
    try {
        await sendBookingConfirmationEmail(docRefId, bookingInput);
        // Si el correo tiene éxito, la operación es un éxito total.
        return {
            success: true,
            bookingId: docRefId,
        };
    } catch (emailError) {
        console.error(`La reserva ${docRefId} se guardó, pero el correo falló:`, emailError);
        // Si el correo falla, la reserva ya está guardada. 
        // Devolvemos éxito, pero con una advertencia para el cliente.
        return {
            success: true,
            bookingId: docRefId,
            warning: "¡Tu cita está confirmada! Sin embargo, no pudimos enviar el correo de confirmación. Por favor, anota los detalles de tu cita.",
        };
    }
}
