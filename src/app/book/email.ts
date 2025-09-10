'use server';

import nodemailer from 'nodemailer';
import { services, stylists } from '@/lib/data'; // Importamos los datos necesarios

// Tipo de datos para la función
type BookingDataForEmail = {
    customerName: string;
    customerEmail: string;
    date: string;
    time: string;
    stylistId: string;
    serviceId: string;
};

export async function sendBookingConfirmationEmail(bookingId: string, bookingData: BookingDataForEmail) {
    // Verificamos las credenciales más básicas.
    if (!process.env.ZOHO_SMTP_USER || !process.env.EMAIL_FROM || !process.env.ZOHO_SMTP_HOST || !process.env.ZOHO_SMTP_PASS) {
        console.warn(`Correo para ${bookingId} no enviado: Faltan credenciales SMTP. Revisa las variables de entorno.`);
        // Lanzamos un error para que la acción que llama lo sepa.
        throw new Error('La configuración del servidor de correo está incompleta.');
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.ZOHO_SMTP_HOST,
            port: Number(process.env.ZOHO_SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.ZOHO_SMTP_USER,
                pass: process.env.ZOHO_SMTP_PASS,
            },
        });

        // --- Lógica de correo genérico ---
        const stylist = stylists.find(s => s.id === bookingData.stylistId);
        const service = services.find(s => s.id === bookingData.serviceId);

        if (!stylist || !service) {
            throw new Error('Estilista o servicio no encontrado para generar el correo.');
        }

        const subject = `¡Tu cita en PodiumBarber está confirmada!`;
        const body = `
            <h1>¡Hola, ${bookingData.customerName}!</h1>
            <p>Tu cita en PodiumBarber ha sido confirmada con éxito.</p>
            <h2>Detalles de tu Cita:</h2>
            <ul>
                <li><strong>Servicio:</strong> ${service.name}</li>
                <li><strong>Estilista:</strong> ${stylist.name}</li>
                <li><strong>Fecha:</strong> ${bookingData.date}</li>
                <li><strong>Hora:</strong> ${bookingData.time}</li>
                <li><strong>Precio:</strong> $${service.price.toLocaleString('es-CL')}</li>
            </ul>
            <p>Te esperamos en Av. Siempre Viva 123, Springfield.</p>
            <p><em>Por favor, avísanos con 24 horas de antelación si necesitas cancelar o reprogramar.</em></p>
            <p>¡Nos vemos pronto!</p>
            <p><strong>El equipo de PodiumBarber</strong></p>
        `;
        const emailContent = { subject, body };
        // --- Fin de la lógica de correo genérico ---

        const recipients = [bookingData.customerEmail];
        // Agregar correo del administrador
        recipients.push('contacto@podiumbarber.cl');

        await transporter.sendMail({
            from: `"PodiumBarber" <${process.env.EMAIL_FROM}>`,
            to: recipients.join(', '),
            subject: emailContent.subject,
            html: emailContent.body,
        });

        console.log(`Correo de confirmación para reserva ${bookingId} enviado con éxito.`);

    } catch (error) {
        console.error(`Error al intentar enviar correo para ${bookingId}:`, error);
        // Relanzamos el error para que la función que nos llamó (saveBooking) pueda capturarlo
        // y manejarlo, en lugar de dejar que el servidor se caiga o falle silenciosamente.
        throw new Error(`La reserva ${bookingId} se guardó, pero falló el envío del correo de confirmación.`);
    }
}
