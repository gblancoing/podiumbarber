'use server';
// Imports de Firebase
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";

// Imports de Tipos y Otros
import type { Booking, Service, Stylist } from '@/lib/types';
import { sendConfirmationEmail } from '@/ai/flows/send-confirmation-email';
import nodemailer from 'nodemailer';

// --- FUNCIONES PARA OBTENER DATOS ESPECÍFICOS DE FIREBASE ---

async function getService(id: string): Promise<Service | null> {
    const docRef = doc(db, "services", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Service : null;
}

async function getStylist(id: string): Promise<Stylist | null> {
    const docRef = doc(db, "stylists", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Stylist : null;
}

// Configuración del "transporter" de Nodemailer para Zoho Mail
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
        // 1. Guardar la reserva en Firestore
        const bookingWithTimestamp = {
            ...bookingData,
            createdAt: serverTimestamp(),
            status: 'confirmed',
        };
        const docRef = await addDoc(collection(db, "reservations"), bookingWithTimestamp);
        console.log('Reserva guardada en Firestore con ID:', docRef.id);

        const newBooking: Booking = {
            id: docRef.id,
            ...bookingData
        } as Booking;

        // 2. Verificar que la configuración de correo exista
        if (process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS && process.env.EMAIL_FROM) {
            console.log('Credenciales de correo encontradas. Iniciando proceso de envío.');
            try {
                // 3. OBTENER DATOS DE SERVICIO Y ESTILISTA DE FIREBASE
                const service = await getService(newBooking.serviceId);
                const stylist = await getStylist(newBooking.stylistId);

                if (!service || !stylist) {
                    throw new Error('No se pudo encontrar el servicio o el estilista en Firebase.');
                }

                // 4. Generar el contenido del correo usando la IA (con datos reales)
                const emailContent = await sendConfirmationEmail({
                    customerName: newBooking.customerName,
                    customerEmail: newBooking.customerEmail,
                    date: newBooking.date,
                    time: newBooking.time,
                    serviceName: service.name, // Usar nombre real
                    stylistName: stylist.name, // Usar nombre real
                });
                console.log('Contenido del email generado por la IA.');

                const recipients = [newBooking.customerEmail];
                if (process.env.ADMIN_EMAIL) {
                    recipients.push(process.env.ADMIN_EMAIL);
                }

                // 5. Definir y enviar el correo
                const mailOptions = {
                    from: `"PodiumBarber" <${process.env.EMAIL_FROM}>`,
                    to: recipients.join(', '),
                    subject: emailContent.subject,
                    html: emailContent.body,
                };
                
                await transporter.sendMail(mailOptions);
                console.log('Correo de confirmación enviado exitosamente a:', recipients.join(', '));

            } catch (emailError: unknown) {
                console.error('>>> FALLO EN EL ENVÍO DE CORREO <<<', emailError);
            }
        } else {
            console.warn('ADVERTENCIA: Credenciales de Zoho Mail no configuradas.');
        }

        return { success: true, data: newBooking };
    } catch (error) {
        console.error('Error en la reserva:', error);
        return { success: false, error: 'No se pudo guardar la reserva. Por favor, inténtalo de nuevo más tarde.' };
    }
}
