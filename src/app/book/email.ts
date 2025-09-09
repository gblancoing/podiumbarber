'use server';

import { sendConfirmationEmail as sendEmailWithAI } from '@/ai/flows/send-confirmation-email';
import nodemailer from 'nodemailer';

// El tipo de datos que esta función recibe (ahora con IDs)
type BookingDataForEmail = {
    customerName: string;
    customerEmail: string;
    date: string;
    time: string;
    stylistId: string; // ID del estilista
    serviceId: string; // ID del servicio
};

// --- Configuración del Transporter de Nodemailer ---
const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: Number(process.env.ZOHO_SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
    },
});

// --- Función Principal de Envío de Correo ---
export async function sendBookingConfirmationEmail(bookingId: string, bookingData: BookingDataForEmail) {
    if (!process.env.ZOHO_SMTP_USER || !process.env.EMAIL_FROM) {
        console.warn(`Correo para ${bookingId} no enviado: Faltan credenciales SMTP.`);
        return;
    }

    try {
        // **CORRECCIÓN DEFINITIVA:**
        // Pasamos los datos directamente a la función de IA, incluyendo los IDs.
        // La función de IA se encargará de buscar los nombres.
        const emailContent = await sendEmailWithAI(bookingData);

        // Creamos la lista de destinatarios.
        const recipients = [bookingData.customerEmail];
        if (process.env.ADMIN_EMAIL) {
            recipients.push(process.env.ADMIN_EMAIL);
        }

        // Enviamos el correo.
        await transporter.sendMail({
            from: `"PodiumBarber" <${process.env.EMAIL_FROM}>`,
            to: recipients.join(', '),
            subject: emailContent.subject,
            html: emailContent.body,
        });

        console.log(`Correo de confirmación para reserva ${bookingId} enviado.`);

    } catch (error) {
        console.error(`Error CRÍTICO al enviar correo para reserva ${bookingId}:`, error);
        // Lanzamos el error para que la acción principal lo capture si es necesario.
        throw new Error('Failed to send confirmation email.');
    }
}
