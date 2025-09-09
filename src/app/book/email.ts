'use server';

import { services, stylists } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { sendConfirmationEmail as sendEmailWithAI } from '@/ai/flows/send-confirmation-email';
import nodemailer from 'nodemailer';

// El tipo de datos de la reserva completa
type FullBookingData = {
    serviceName: string;
    stylistName: string;
    customerName: string;
    customerEmail: string;
    date: string;
    time: string;
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
export async function sendBookingConfirmationEmail(bookingId: string, bookingData: FullBookingData) {
    if (!process.env.ZOHO_SMTP_USER || !process.env.EMAIL_FROM) {
        console.warn(`Correo para ${bookingId} no enviado: Faltan credenciales SMTP.`);
        return;
    }

    try {
        // Generamos el contenido del correo con IA.
        const emailContent = await sendEmailWithAI({
            customerName: bookingData.customerName,
            customerEmail: bookingData.customerEmail,
            date: bookingData.date,
            time: bookingData.time,
            serviceName: bookingData.serviceName,
            stylistName: bookingData.stylistName,
        });

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
    }
}
