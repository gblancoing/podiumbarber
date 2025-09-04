'use server';
import { saveNewBooking } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { sendConfirmationEmail } from '@/ai/flows/send-confirmation-email';

export async function saveBooking(bookingData: Omit<Booking, 'id' | 'status'>) {
    try {
        const newBooking = await saveNewBooking(bookingData);
        
        // Después de guardar, generar y "enviar" el correo de confirmación
        try {
            const emailContent = await sendConfirmationEmail({
                customerName: newBooking.customerName,
                customerEmail: newBooking.customerEmail,
                date: newBooking.date,
                time: newBooking.time,
                stylistId: newBooking.stylistId,
                serviceId: newBooking.serviceId,
            });

            // --- INICIO DE LA SIMULACIÓN DE ENVÍO DE CORREO ---
            // En una aplicación real, aquí es donde usarías un servicio como SendGrid, Resend o Nodemailer
            // para enviar el correo electrónico real.
            // Ejemplo: await sendEmailWithSendGrid(newBooking.customerEmail, emailContent.subject, emailContent.body);
            
            console.log('----------------------------------------------------');
            console.log('SIMULACIÓN DE ENVÍO DE CORREO DE CONFIRMACIÓN');
            console.log('Un servicio de correo real no ha sido configurado.');
            console.log('Para:', newBooking.customerEmail);
            console.log('Asunto:', emailContent.subject);
            console.log('Cuerpo (HTML):', emailContent.body);
            console.log('----------------------------------------------------');
            // --- FIN DE LA SIMULACIÓN ---

        } catch (emailError) {
             console.error('Error al generar el correo de confirmación:', emailError);
             // No devolvemos un error al cliente por esto, ya que la reserva fue exitosa.
             // Esto se podría registrar en un servicio de seguimiento de errores.
        }

        return { success: true, data: newBooking };
    } catch (error) {
        console.error('Error en la reserva:', error);
        return { success: false, error: 'No se pudo guardar la reserva. Por favor, inténtalo de nuevo más tarde.' };
    }
}
