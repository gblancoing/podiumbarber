'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { services, stylists } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { sendBookingConfirmationEmail } from './email';

// Definimos un tipo para los datos que llegan desde el cliente.
// Esto hace que el código sea más seguro y fácil de entender.
type BookingInput = {
    serviceId: string;
    stylistId: string;
    date: string;      // Formato YYYY-MM-DD
    time: string;
    customerName: string;
    customerEmail: string;
};

export async function saveBooking(bookingInput: BookingInput) {
    if (!db) {
        console.error("Error FATAL: Conexión con la base de datos no disponible.");
        return {
            success: false,
            error: "No se pudo conectar con la base de datos.",
        };
    }

    try {
        // Buscamos la información completa del servicio y el estilista usando los IDs.
        const service = services.find(s => s.id === bookingInput.serviceId);
        const stylist = stylists.find(s => s.id === bookingInput.stylistId);

        // Si no encontramos el servicio o el estilista, devolvemos un error claro.
        if (!service || !stylist) {
            return {
                success: false,
                error: "El servicio o estilista seleccionado ya no es válido.",
            };
        }

        // Construimos el objeto de la reserva completo para guardarlo en la base de datos.
        const bookingToSave = {
            ...bookingInput,
            serviceName: service.name, // Añadimos el nombre del servicio
            stylistName: stylist.name, // Añadimos el nombre del estilista
            price: service.price,      // Añadimos el precio
            createdAt: serverTimestamp(),
            status: 'confirmed' as const,
        };

        // Guardamos la reserva en Firestore.
        const docRef = await addDoc(collection(db, "reservations"), bookingToSave);
        console.log(`Reserva ${docRef.id} creada con éxito.`);

        // Ahora, enviamos el correo de confirmación con los datos completos.
        // La lógica de envío de correo se ha movido a su propio archivo para mayor claridad.
        await sendBookingConfirmationEmail(docRef.id, bookingToSave);

        return {
            success: true,
            bookingId: docRef.id,
        };

    } catch (error) {
        console.error("Error FATAL al guardar la reserva en Firestore:", error);
        // Si algo falla, devolvemos un error genérico para no exponer detalles al usuario.
        return {
            success: false,
            error: "No se pudo guardar la reserva en la base de datos. Por favor, inténtalo de nuevo.",
        };
    }
}
