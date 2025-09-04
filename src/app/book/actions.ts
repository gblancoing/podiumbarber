'use server';
import { saveNewBooking } from '@/lib/data';
import type { Booking } from '@/lib/types';

export async function saveBooking(bookingData: Omit<Booking, 'id' | 'status'>) {
    try {
        const newBooking = await saveNewBooking(bookingData);
        // Aquí es donde en el futuro llamaríamos a la función para enviar el correo.
        return { success: true, data: newBooking };
    } catch (error) {
        console.error('Booking Error:', error);
        return { success: false, error: 'No se pudo guardar la reserva. Por favor, inténtalo de nuevo más tarde.' };
    }
}
