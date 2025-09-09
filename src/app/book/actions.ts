'use server';

import { z } from "zod";
import { firestore } from "../lib/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
import { stylists, services } from "../lib/data";

// --- Esquema de Validación --- 
const BookingSchema = z.object({
  userName: z.string().min(2, "El nombre es requerido"),
  userEmail: z.string().email("El email no es válido"),
  stylistId: z.string(),
  serviceId: z.string(),
  date: z.string(),
  time: z.string(),
  duration: z.number(),
  price: z.number(),
});

export type BookingInput = z.infer<typeof BookingSchema>;

// --- Tipos de Resultado ---
export type CreateBookingResult = {
    success: boolean;
    bookingId?: string;
    error?: string;
    warning?: string; // Para casos donde la reserva se crea pero algo más falla (ej. correo)
};


// --- Acción del Servidor: Crear Reserva ---
export async function createBooking(bookingInput: BookingInput): Promise<CreateBookingResult> {
    
    const validation = BookingSchema.safeParse(bookingInput);
    if (!validation.success) {
        console.error("Error de validación:", validation.error.errors);
        return {
            success: false,
            error: "Los datos de la reserva no son válidos.",
        };
    }

    try {
        // --- PASO 1: Guardar la reserva en Firestore ---
        const docRef = doc(collection(firestore, "bookings"));
        const docRefId = docRef.id;
        
        await setDoc(docRef, {
            ...bookingInput,
            createdAt: new Date(),
            status: "confirmed",
        });

        console.log("Reserva guardada con éxito en Firestore con ID:", docRefId);

        // --- Éxito --- 
        // El envío de correo se ha eliminado temporalmente.
        return {
            success: true,
            bookingId: docRefId,
        };

    } catch (error) {
        console.error("Error al crear la reserva:", error);
        return {
            success: false,
            error: "No se pudo confirmar la reserva en el servidor. Por favor, contacta a soporte.",
        };
    }
}
