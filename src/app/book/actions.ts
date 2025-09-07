'use server';

import { db } from '../../lib/firebase';
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import type { Booking, Service, Stylist } from '../../lib/types';
import { sendConfirmationEmail } from '../../ai/flows/send-confirmation-email';
import nodemailer from 'nodemailer';

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
    // Si las credenciales de correo no están, no hacemos nada.
    if (!process.env.ZOHO_SMTP_USER || !process.env.ZOHO_SMTP_PASS) {
        console.warn(`Correo para reserva ${bookingId} no enviado: Faltan credenciales de Zoho.`);
        return; // Salimos de la función silenciosamente
    }
    
    // La conexión a la BD es CRÍTICA. Si no existe, no podemos continuar.
    if (!db) {
        console.error(`Error FATAL en sendBookingConfirmationEmail: La conexión a la base de datos (db) es nula. No se puede procesar la reserva ${bookingId}.`);
        return;
    }

    try {
        // 1. Obtener nombres de Servicio y Estilista
        const serviceDoc = await getDoc(doc(db, "services", bookingData.serviceId));
        const stylistDoc = await getDoc(doc(db, "stylists", bookingData.stylistId));

        const serviceName = serviceDoc.exists() ? (serviceDoc.data() as Service).name : "Servicio no encontrado";
        const stylistName = stylistDoc.exists() ? (stylistDoc.data() as Stylist).name : "Estilista no encontrado";

        // 2. Generar contenido del correo
        const emailContent = await sendConfirmationEmail({
            customerName: bookingData.customerName,
            customerEmail: bookingData.customerEmail,
            date: bookingData.date,
            time: bookingData.time,
            serviceName: serviceName,
            stylistName: stylistName,
        });

        // 3. Definir destinatarios (cliente y admin)
        const recipients = [bookingData.customerEmail];
        if (process.env.ADMIN_EMAIL) {
            recipients.push(process.env.ADMIN_EMAIL);
        }

        // 4. Enviar el correo
        await transporter.sendMail({
            from: `"PodiumBarber" <${process.env.EMAIL_FROM}>`,
            to: recipients.join(', '),
            subject: emailContent.subject,
            html: emailContent.body,
        });

        console.log(`Correo de confirmación para reserva ${bookingId} enviado con éxito.`);

    } catch (error) {
        // Si algo falla aquí, solo lo registramos. La reserva ya está creada.
        console.error(`Error CRÍTICO al enviar el correo para la reserva ${bookingId}:`, error);
    }
}

// --- Función Principal para Guardar la Reserva ---
export async function saveBooking(bookingData: Omit<Booking, 'id' | 'status'>) {
    // La conexión a la BD es CRÍTICA. Si no existe, no podemos continuar.
    if (!db) {
        console.error("Error FATAL en saveBooking: La conexión a la base de datos (db) es nula. La reserva no puede ser guardada.");
        return {
            success: false,
            error: "No se pudo conectar con la base de datos. La configuración de Firebase es incorrecta o las variables de entorno no están disponibles.",
        };
    }

    // Paso 1: Intentar guardar la reserva en Firestore.
    // Este es el paso crítico. Si falla, toda la operación debe fallar.
    try {
        const bookingWithTimestamp = {
            ...bookingData,
            createdAt: serverTimestamp(),
            status: 'confirmed',
        };
        const docRef = await addDoc(collection(db, "reservations"), bookingWithTimestamp);
        console.log(`Reserva ${docRef.id} creada con éxito en Firestore.`);

        // Paso 2: Disparar el envío del correo (sin esperar a que termine).
        // Lo hacemos de forma asíncrona. Si el correo falla, no afecta al resultado de la reserva.
        sendBookingConfirmationEmail(docRef.id, bookingData);

        // Si llegamos aquí, la reserva se guardó. Devolvemos éxito.
        return {
            success: true,
            data: { id: docRef.id, ...bookingData } as Booking,
        };

    } catch (error) {
        // Si el `addDoc` de Firestore falla, el error se captura aquí.
        console.error("Error FATAL al guardar la reserva en Firestore:", error);
        // Devolvemos un error claro y conciso al cliente.
        return {
            success: false,
            error: "No se pudo conectar con la base de datos para guardar la reserva. Por favor, inténtalo de nuevo.",
        };
    }
}
