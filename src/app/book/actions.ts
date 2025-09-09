'use server';

import { db } from '../../lib/firebase';
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import type { Booking, Service, Stylist } from '../../lib/types';
import { sendConfirmationEmail } from '../../ai/flows/send-confirmation-email';
import nodemailer from 'nodemailer';
import { services, stylists } from '@/lib/data';

// Configuración del transporter de Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: Number(process.env.ZOHO_SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
    },
});

// --- Función para Enviar el Correo ---
async function sendBookingConfirmationEmail(bookingId: string, bookingData: Omit<Booking, 'id' | 'status'>) {
    if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS) {
        console.warn(`Correo para reserva ${bookingId} no enviado: Faltan credenciales de Zoho.`);
        return;
    }
    
    if (!db) {
        console.error(`Error FATAL en sendBookingConfirmationEmail: La conexión a la base de datos (db) es nula.`);
        return;
    }

    try {
        // Usa los datos desnormalizados si están disponibles, si no, búscalos.
        const serviceName = bookingData.serviceName ?? services.find(s => s.id === bookingData.serviceId)?.name ?? "Servicio no encontrado";
        const stylistName = bookingData.stylistName ?? stylists.find(s => s.id === bookingData.stylistId)?.name ?? "Estilista no encontrado";

        const emailContent = await sendConfirmationEmail({
            customerName: bookingData.customerName,
            customerEmail: bookingData.customerEmail,
            date: bookingData.date,
            time: bookingData.time,
            serviceName: serviceName, // FIX: Simplificado y corregido
            stylistName: stylistName,
        });

        const recipients = [bookingData.customerEmail];
        if (process.env.ADMIN_EMAIL) {
            recipients.push(process.env.ADMIN_EMAIL);
        }

        await transporter.sendMail({
            from: `"PodiumBarber" <${process.env.EMAIL_FROM}>`,
            to: recipients.join(', '),
            subject: emailContent.subject,
            html: emailContent.body,
        });

        console.log(`Correo de confirmación para reserva ${bookingId} enviado con éxito.`);

    } catch (error) {
        console.error(`Error CRÍTICO al enviar el correo para la reserva ${bookingId}:`, error);
    }
}

// --- Función Principal para Guardar la Reserva ---
export async function saveBooking(bookingData: Omit<Booking, 'id' | 'status'>) {
    if (!db) {
        console.error("Error FATAL: Conexión con la base de datos no disponible.");
        return {
            success: false,
            error: "No se pudo conectar con la base de datos.",
        };
    }

    try {
        const service = services.find(s => s.id === bookingData.serviceId);
        const stylist = stylists.find(s => s.id === bookingData.stylistId);

        if (!service || !stylist) {
            return {
                success: false,
                error: "El servicio o estilista seleccionado ya no es válido.",
            };
        }

        const bookingToSave = {
            ...bookingData,
            serviceName: service.name,
            stylistName: stylist.name,
            price: service.price,
            createdAt: serverTimestamp(),
            status: 'confirmed' as const,
        };

        const docRef = await addDoc(collection(db, "reservations"), bookingToSave);
        console.log(`Reserva ${docRef.id} creada con datos desnormalizados.`);

        // Llamamos a la función de envío de correo con los datos completos
        sendBookingConfirmationEmail(docRef.id, bookingToSave);

        return {
            success: true,
            data: { id: docRef.id, ...bookingToSave } as Booking,
        };

    } catch (error) {
        console.error("Error FATAL al guardar la reserva en Firestore:", error);
        return {
            success: false,
            error: "No se pudo guardar la reserva en la base de datos. Inténtalo de nuevo.",
        };
    }
}
