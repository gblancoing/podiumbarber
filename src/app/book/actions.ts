'use server';
import { saveNewBooking } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { sendConfirmationEmail } from '@/ai/flows/send-confirmation-email';

export async function saveBooking(bookingData: Omit<Booking, 'id' | 'status'>) {
    try {
        const newBooking = await saveNewBooking(bookingData);
        
        // After saving, generate the confirmation email
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
            // En un entorno real, aquí se enviaría el correo.
            // console.log('Cuerpo:', emailContent.body);
        } catch (emailError) {
             console.error('Error al generar el correo de confirmación:', emailError);
             // No devolvemos un error al cliente por esto, ya que la reserva fue exitosa.
        }

        return { success: true, data: newBooking };
    } catch (error) {
        console.error('Error en la reserva:', error);
        return { success: false, error: 'No se pudo guardar la reserva. Por favor, inténtalo de nuevo más tarde.' };
    }
}
