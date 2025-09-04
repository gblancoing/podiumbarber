'use server';
import { saveNewBooking } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { sendConfirmationEmail } from '@/ai/flows/send-confirmation-email';

export async function saveBooking(bookingData: Omit<Booking, 'id' | 'status'>) {
    try {
        const newBooking = await saveNewBooking(bookingData);
        
        // After saving, generate and "send" the confirmation email
        try {
            const emailContent = await sendConfirmationEmail({
                customerName: newBooking.customerName,
                customerEmail: newBooking.customerEmail,
                date: newBooking.date,
                time: newBooking.time,
                stylistId: newBooking.stylistId,
                serviceId: newBooking.serviceId,
            });
            console.log('Correo de confirmación generado:');
            console.log('Para:', newBooking.customerEmail);
            console.log('Asunto:', emailContent.subject);
            // In a real application, this is where you would use a service like SendGrid, Resend, or Nodemailer to send the actual email.
            console.log('Cuerpo (simulando envío):', emailContent.body);
        } catch (emailError) {
             console.error('Error al generar el correo de confirmación:', emailError);
             // We don't return an error to the client for this, as the booking was successful.
             // This could be logged to an error tracking service.
        }

        return { success: true, data: newBooking };
    } catch (error) {
        console.error('Error en la reserva:', error);
        return { success: false, error: 'No se pudo guardar la reserva. Por favor, inténtalo de nuevo más tarde.' };
    }
}
