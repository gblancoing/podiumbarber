'use server';

import nodemailer from 'nodemailer';
import { services, stylists } from '@/lib/data';

// Tipo de datos para la función
type BookingDataForEmail = {
    customerName?: string;
    customerEmail?: string;
    userName?: string;
    userEmail?: string;
    date: string;
    time: string;
    stylistId: string;
    serviceId: string;
};

// Función para crear plantilla de correo para el cliente
function createCustomerEmailTemplate(bookingData: BookingDataForEmail, stylist: any, service: any, bookingId: string) {
    const customerName = bookingData.customerName || bookingData.userName || 'Cliente';
    
    return {
        subject: `¡Tu cita en PodiumBarber está confirmada! - ${bookingId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #000; color: #F59E0B; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 20px; }
                    .booking-details { background: #fff; padding: 20px; margin: 20px 0; border-left: 4px solid #F59E0B; }
                    .footer { background: #000; color: #fff; padding: 20px; text-align: center; }
                    .highlight { color: #F59E0B; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>PodiumBarber</h1>
                        <h2>¡Tu cita está confirmada!</h2>
                    </div>
                    
                    <div class="content">
                        <h3>¡Hola, ${customerName}!</h3>
                        <p>Tu cita en PodiumBarber ha sido confirmada con éxito. Te esperamos para brindarte el mejor servicio.</p>
                        
                        <div class="booking-details">
                            <h3>📅 Detalles de tu Cita</h3>
                            <ul>
                                <li><strong>ID de Reserva:</strong> <span class="highlight">${bookingId}</span></li>
                                <li><strong>Servicio:</strong> ${service.name}</li>
                                <li><strong>Estilista:</strong> ${stylist.name}</li>
                                <li><strong>Fecha:</strong> ${bookingData.date}</li>
                                <li><strong>Hora:</strong> ${bookingData.time}</li>
                                <li><strong>Duración:</strong> ${service.duration} minutos</li>
                                <li><strong>Precio:</strong> $${service.price.toLocaleString('es-CL')}</li>
                            </ul>
                        </div>
                        
                        <p><strong>📍 Ubicación:</strong> Av. Siempre Viva 123, Springfield</p>
                        
                        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>⚠️ Importante:</strong> Por favor, avísanos con 24 horas de antelación si necesitas cancelar o reprogramar tu cita.</p>
                        </div>
                        
                        <p>¡Nos vemos pronto para darte el mejor look!</p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>El equipo de PodiumBarber</strong></p>
                        <p>contacto@podiumbarber.cl | www.podiumbarber.cl</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

// Función para crear plantilla de correo para el administrador
function createAdminEmailTemplate(bookingData: BookingDataForEmail, stylist: any, service: any, bookingId: string) {
    const customerName = bookingData.customerName || bookingData.userName || 'Cliente';
    const customerEmail = bookingData.customerEmail || bookingData.userEmail;
    
    return {
        subject: `Nueva reserva en PodiumBarber - ${bookingId}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #000; color: #F59E0B; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 20px; }
                    .booking-details { background: #fff; padding: 20px; margin: 20px 0; border-left: 4px solid #F59E0B; }
                    .footer { background: #000; color: #fff; padding: 20px; text-align: center; }
                    .highlight { color: #F59E0B; font-weight: bold; }
                    .urgent { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>PodiumBarber - Panel Admin</h1>
                        <h2>Nueva Reserva Recibida</h2>
                    </div>
                    
                    <div class="content">
                        <div class="urgent">
                            <p><strong>🔔 Nueva reserva requiere tu atención</strong></p>
                        </div>
                        
                        <div class="booking-details">
                            <h3>📋 Información de la Reserva</h3>
                            <ul>
                                <li><strong>ID de Reserva:</strong> <span class="highlight">${bookingId}</span></li>
                                <li><strong>Cliente:</strong> ${customerName}</li>
                                <li><strong>Email del Cliente:</strong> ${customerEmail}</li>
                                <li><strong>Servicio:</strong> ${service.name}</li>
                                <li><strong>Estilista:</strong> ${stylist.name}</li>
                                <li><strong>Fecha:</strong> ${bookingData.date}</li>
                                <li><strong>Hora:</strong> ${bookingData.time}</li>
                                <li><strong>Duración:</strong> ${service.duration} minutos</li>
                                <li><strong>Precio:</strong> $${service.price.toLocaleString('es-CL')}</li>
                                <li><strong>Fecha de Creación:</strong> ${new Date().toLocaleString('es-CL')}</li>
                            </ul>
                        </div>
                        
                        <p><strong>📧 Acciones recomendadas:</strong></p>
                        <ul>
                            <li>Verificar disponibilidad del estilista</li>
                            <li>Confirmar con el cliente si es necesario</li>
                            <li>Preparar el servicio solicitado</li>
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <p><strong>Sistema de Reservas PodiumBarber</strong></p>
                        <p>Este correo fue generado automáticamente</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

export async function sendBookingConfirmationEmailImproved(bookingId: string, bookingData: BookingDataForEmail) {
    console.log("=== INICIANDO ENVÍO DE CORREOS MEJORADOS ===");
    console.log("Booking ID:", bookingId);
    console.log("Datos de reserva:", bookingData);
    
    // Verificamos las credenciales más básicas.
    if (!process.env.ZOHO_SMTP_USER || !process.env.EMAIL_FROM || !process.env.ZOHO_SMTP_HOST || !process.env.ZOHO_SMTP_PASS) {
        console.warn(`Correo para ${bookingId} no enviado: Faltan credenciales SMTP. Revisa las variables de entorno.`);
        console.log("Variables de entorno disponibles:", {
            ZOHO_SMTP_USER: !!process.env.ZOHO_SMTP_USER,
            EMAIL_FROM: !!process.env.EMAIL_FROM,
            ZOHO_SMTP_HOST: !!process.env.ZOHO_SMTP_HOST,
            ZOHO_SMTP_PASS: !!process.env.ZOHO_SMTP_PASS,
        });
        throw new Error('La configuración del servidor de correo está incompleta.');
    }

    try {
        const transporter = nodemailer.createTransporter({
            host: process.env.ZOHO_SMTP_HOST,
            port: Number(process.env.ZOHO_SMTP_PORT),
            secure: true,
            auth: {
                user: process.env.ZOHO_SMTP_USER,
                pass: process.env.ZOHO_SMTP_PASS,
            },
        });

        console.log("Transporter configurado:", {
            host: process.env.ZOHO_SMTP_HOST,
            port: process.env.ZOHO_SMTP_PORT,
            user: process.env.ZOHO_SMTP_USER,
            from: process.env.EMAIL_FROM
        });

        // Obtener datos del estilista y servicio
        const stylist = stylists.find(s => s.id === bookingData.stylistId);
        const service = services.find(s => s.id === bookingData.serviceId);

        if (!stylist || !service) {
            throw new Error('Estilista o servicio no encontrado para generar el correo.');
        }

        // Usar customerEmail o userEmail como fallback
        const customerEmail = bookingData.customerEmail || bookingData.userEmail;
        if (!customerEmail) {
            throw new Error('No se encontró email del cliente');
        }

        // Crear plantillas de correo
        const customerEmailTemplate = createCustomerEmailTemplate(bookingData, stylist, service, bookingId);
        const adminEmailTemplate = createAdminEmailTemplate(bookingData, stylist, service, bookingId);

        // Enviar correo al cliente
        const customerMailOptions = {
            from: `"PodiumBarber" <${process.env.EMAIL_FROM}>`,
            to: customerEmail,
            subject: customerEmailTemplate.subject,
            html: customerEmailTemplate.html,
        };

        console.log("Enviando correo al cliente:", customerMailOptions.to);
        const customerResult = await transporter.sendMail(customerMailOptions);
        console.log("Correo al cliente enviado:", customerResult.messageId);

        // Enviar correo al administrador
        const adminMailOptions = {
            from: `"PodiumBarber" <${process.env.EMAIL_FROM}>`,
            to: 'contacto@podiumbarber.cl',
            subject: adminEmailTemplate.subject,
            html: adminEmailTemplate.html,
        };

        console.log("Enviando correo al administrador:", adminMailOptions.to);
        const adminResult = await transporter.sendMail(adminMailOptions);
        console.log("Correo al administrador enviado:", adminResult.messageId);

        console.log(`Correos de confirmación para reserva ${bookingId} enviados con éxito.`);
        console.log("Resultados del envío:", { customer: customerResult.messageId, admin: adminResult.messageId });

        return {
            success: true,
            customerEmailId: customerResult.messageId,
            adminEmailId: adminResult.messageId
        };

    } catch (error) {
        console.error(`Error al intentar enviar correos para ${bookingId}:`, error);
        throw new Error(`La reserva ${bookingId} se guardó, pero falló el envío de los correos de confirmación.`);
    }
}
