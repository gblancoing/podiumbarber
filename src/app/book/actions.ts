'use server';
import { saveNewBooking } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { sendConfirmationEmail } from '@/ai/flows/send-confirmation-email';
import nodemailer from 'nodemailer';

// 1. Configuración del "transporter" de Nodemailer para Zoho Mail
const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: Number(process.env.ZOHO_SMTP_PORT),
    secure: true, // true para el puerto 465, false para otros
    auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS, // Contraseña de aplicación
    },
});

export async function saveBooking(bookingData: Omit<Booking, 'id' | 'status'>) {
    try {
        const newBooking = await saveNewBooking(bookingData);
        console.log('Reserva guardada exitosamente en la base de datos.');

        // 2. Verificar que la configuración de correo exista
        if (process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS && process.env.EMAIL_FROM) {
            console.log('Credenciales de correo encontradas. Iniciando proceso de envío.');
            try {
                // VERIFICAR CONEXIÓN SMTP
                await transporter.verify();
                console.log('Conexión con el servidor SMTP verificada exitosamente.');

                // Generar el contenido del correo usando la IA
                const emailContent = await sendConfirmationEmail({
                    customerName: newBooking.customerName,
                    customerEmail: newBooking.customerEmail,
                    date: newBooking.date,
                    time: newBooking.time,
                    stylistId: newBooking.stylistId,
                    serviceId: newBooking.serviceId,
                });
                console.log('Contenido del email generado por la IA.');

                // Añadir al administrador a la lista de destinatarios
                const recipients = [newBooking.customerEmail];
                if (process.env.ADMIN_EMAIL) {
                    recipients.push(process.env.ADMIN_EMAIL);
                }
                console.log('Destinatarios del correo:', recipients.join(', '));

                // 3. Definir las opciones del correo
                const mailOptions = {
                    from: `"PodiumBarber" <${process.env.EMAIL_FROM}>`,
                    to: recipients.join(', '),
                    subject: emailContent.subject,
                    html: emailContent.body,
                };
                console.log('Opciones del correo preparadas.');

                // 4. Enviar el correo
                console.log('Intentando enviar correo...');
                await transporter.sendMail(mailOptions);
                console.log('Correo de confirmación enviado exitosamente a:', recipients.join(', '));

            } catch (emailError: unknown) {
                console.error('>>> FALLO EN EL ENVÍO DE CORREO <<<');
                if (emailError instanceof Error) {
                     console.error('Error Name:', emailError.name);
                     console.error('Error Message:', emailError.message);
                     console.error('Error Stack:', emailError.stack);
                } else {
                    console.error('Error detallado (desconocido):', emailError);
                }
                console.error('>>> FIN DEL REPORTE DE ERROR DE CORREO <<<');
            }
        } else {
            console.warn('----------------------------------------------------');
            console.warn('ADVERTENCIA: Credenciales de Zoho Mail no configuradas.');
            console.warn('El correo de confirmación no se enviará.');
            console.warn('Añade ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, ZOHO_SMTP_USER, ZOHO_SMTP_PASS, EMAIL_FROM y ADMIN_EMAIL a tu archivo .env');
            console.warn('----------------------------------------------------');
        }

        return { success: true, data: newBooking };
    } catch (error) {
        console.error('Error en la reserva:', error);
        return { success: false, error: 'No se pudo guardar la reserva. Por favor, inténtalo de nuevo más tarde.' };
    }
}
