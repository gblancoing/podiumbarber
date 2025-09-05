'use server';
import { saveNewBooking } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { sendConfirmationEmail } from '@/ai/flows/send-confirmation-email';
import sgMail from '@sendgrid/mail';

// Configura SendGrid al inicio.
// La clave API se leerá automáticamente de la variable de entorno SENDGRID_API_KEY.
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function saveBooking(bookingData: Omit<Booking, 'id' | 'status'>) {
    try {
        const newBooking = await saveNewBooking(bookingData);
        
        // Después de guardar, generar y ENVIAR el correo de confirmación
        if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
            try {
                const emailContent = await sendConfirmationEmail({
                    customerName: newBooking.customerName,
                    customerEmail: newBooking.customerEmail,
                    date: newBooking.date,
                    time: newBooking.time,
                    stylistId: newBooking.stylistId,
                    serviceId: newBooking.serviceId,
                });

                const recipients = [newBooking.customerEmail];
                if (process.env.ADMIN_EMAIL) {
                    recipients.push(process.env.ADMIN_EMAIL);
                }

                const msg = {
                    to: recipients,
                    from: process.env.SENDGRID_FROM_EMAIL,
                    subject: emailContent.subject,
                    html: emailContent.body,
                };

                await sgMail.send(msg);
                console.log('Correo de confirmación enviado exitosamente a:', recipients.join(', '));

            } catch (emailError: any) {
                console.error('Error al ENVIAR el correo de confirmación con SendGrid:', emailError);
                if (emailError.response) {
                    console.error(emailError.response.body)
                }
                // No devolvemos un error al cliente por esto, ya que la reserva fue exitosa.
                // Esto se podría registrar en un servicio de seguimiento de errores.
            }
        } else {
            console.warn('----------------------------------------------------');
            console.warn('ADVERTENCIA: Credenciales de SendGrid no configuradas.');
            console.warn('El correo de confirmación no se enviará.');
            console.warn('Añade SENDGRID_API_KEY y SENDGRID_FROM_EMAIL a tu archivo .env');
            console.warn('----------------------------------------------------');
        }

        return { success: true, data: newBooking };
    } catch (error) {
        console.error('Error en la reserva:', error);
        return { success: false, error: 'No se pudo guardar la reserva. Por favor, inténtalo de nuevo más tarde.' };
    }
}
