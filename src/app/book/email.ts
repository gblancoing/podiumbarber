'use server';

import nodemailer from 'nodemailer';

// Tipo de datos para la función
type BookingDataForEmail = {
    customerName: string;
    customerEmail: string;
    date: string;
    time: string;
    stylistId: string;
    serviceId: string;
};

// --- Función Principal de Envío de Correo (Ahora 100% Robusta) ---
export async function sendBookingConfirmationEmail(bookingId: string, bookingData: BookingDataForEmail) {
    // Primero, verificamos las credenciales más básicas. Si no están, no continuamos.
    if (!process.env.ZOHO_SMTP_USER || !process.env.EMAIL_FROM) {
        console.warn(`Correo para ${bookingId} no enviado: Faltan credenciales SMTP básicas.`);
        return;
    }

    try {
        // **CORRECCIÓN DE ROBUSTEZ FINAL:**
        // 1. El transporter de Nodemailer se crea aquí, dentro del try/catch.
        // Si las variables de entorno de ZOHO faltan, el error se captura y no bloquea el servidor.
        const transporter = nodemailer.createTransport({
            host: process.env.ZOHO_SMTP_HOST,
            port: Number(process.env.ZOHO_SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.ZOHO_SMTP_USER,
                pass: process.env.ZOHO_SMTP_PASS,
            },
        });

        // 2. El módulo de IA se importa dinámicamente aquí.
        // Si falla (p. ej., por falta de API Key de Google), el error también se captura.
        const { sendConfirmationEmail: sendEmailWithAI } = await import('@/ai/flows/send-confirmation-email');
        
        // Generamos el contenido del correo.
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
        console.error(`Error NO FATAL al generar o enviar correo para ${bookingId}:`, error);
        // La reserva ya se guardó. Este error de correo se registra en el servidor pero no afecta al usuario.
    }
}
