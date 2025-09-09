'use server';

import { db } from '@/lib/firebase';
import { services, stylists } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { sendConfirmationEmail } from '@/ai/flows/send-confirmation-email';
import nodemailer from 'nodemailer';

// Este tipo representa los datos completos de la reserva que necesitamos para el correo.
type FullBookingData = Omit<Booking, 'id' | 'createdAt'> & {
    createdAt: any; // El tipo de Firestore es complejo, usamos `any` por simplicidad aquí.
};

// --- Configuración del Transporter de Nodemailer ---
// Se encarga de la conexión con el servidor de correo para enviar emails.
const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: Number(process.env.ZOHO_SMTP_PORT),
    secure: true, // Usamos una conexión segura (SSL/TLS)
    auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
    },
});

// --- Función para Enviar el Correo de Confirmación ---
export async function sendBookingConfirmationEmail(bookingId: string, bookingData: FullBookingData) {
    // Verificamos que las credenciales para enviar correos existan.
    if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS || !process.env.EMAIL_FROM) {
        console.warn(`Correo para reserva ${bookingId} no enviado: Faltan credenciales de configuración de correo (SMTP o EMAIL_FROM).`);
        // No devolvemos un error, simplemente no se envía el correo.
        return;
    }

    try {
        // Usamos una IA para generar el contenido del correo de forma personalizada.
        const emailContent = await sendConfirmationEmail({
            customerName: bookingData.customerName,
            customerEmail: bookingData.customerEmail,
            date: bookingData.date,
            time: bookingData.time,
            serviceName: bookingData.serviceName,
            stylistName: bookingData.stylistName,
        });

        // Creamos la lista de destinatarios (el cliente y, opcionalmente, el administrador).
        const recipients = [bookingData.customerEmail];
        if (process.env.ADMIN_EMAIL) {
            recipients.push(process.env.ADMIN_EMAIL);
        }

        // Enviamos el correo usando Nodemailer.
        await transporter.sendMail({
            from: `"PodiumBarber" <${process.env.EMAIL_FROM}>`, // Nombre y dirección del remitente
            to: recipients.join(', '), // Lista de destinatarios
            subject: emailContent.subject, // Asunto del correo (generado por IA)
            html: emailContent.body,       // Cuerpo del correo en HTML (generado por IA)
        });

        console.log(`Correo de confirmación para reserva ${bookingId} enviado con éxito a ${recipients.join(', ')}.`);

    } catch (error) {
        // Si algo sale mal durante el envío, lo registramos para poder depurarlo.
        console.error(`Error CRÍTICO al enviar el correo para la reserva ${bookingId}:`, error);
        // No lanzamos un error para no interrumpir el flujo de la reserva si solo falla el email.
    }
}
