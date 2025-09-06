// Imports de Firebase
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Imports de Componentes y Tipos
import { DashboardClient } from "./DashboardClient";
import type { Booking, Service, Stylist } from "@/lib/types";

// --- NUEVAS FUNCIONES PARA LEER DATOS DESDE FIREBASE ---

// Obtiene todas las reservas de la colección 'reservations'
async function getBookingsFromFirestore(): Promise<Booking[]> {
    const bookingsCol = collection(db, 'reservations');
    const bookingSnapshot = await getDocs(bookingsCol);
    return bookingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as Booking));
}

// Obtiene todos los servicios de la colección 'services'
async function getServicesFromFirestore(): Promise<Service[]> {
    const servicesCol = collection(db, 'services');
    const serviceSnapshot = await getDocs(servicesCol);
    return serviceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as Service));
}

// Obtiene todos los estilistas de la colección 'stylists'
async function getStylistsFromFirestore(): Promise<Stylist[]> {
    const stylistsCol = collection(db, 'stylists');
    const stylistSnapshot = await getDocs(stylistsCol);
    return stylistSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    } as Stylist));
}


export default async function DashboardPage() {
    // 1. Obtener TODOS los datos desde Firebase
    const bookings = await getBookingsFromFirestore();
    const services = await getServicesFromFirestore();
    const stylists = await getStylistsFromFirestore();
    
    // 2. Calcular las métricas usando los datos de Firebase
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => {
        // Busca el servicio correspondiente en los datos de Firebase
        const service = services.find(s => s.id === booking.serviceId);
        return sum + (service?.price || 0);
    }, 0);

    const bookingsByStylist = stylists.map(stylist => ({
        name: stylist.name.split(' ')[0],
        // Filtra las reservas por el ID del estilista de Firebase
        citas: bookings.filter(b => b.stylistId === stylist.id).length
    }));

    // 3. Filtrar y ordenar las próximas citas (lógica existente)
    const upcomingBookings = bookings
        .filter(b => {
            const bookingDateTime = new Date(`${b.date}T${b.time}`);
            return bookingDateTime >= new Date();
        })
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .slice(0, 5)
        .map(booking => {
            // Enriquecer la reserva con los nombres para mostrar en el UI
            const serviceName = services.find(s => s.id === booking.serviceId)?.name || 'Servicio Desconocido';
            const stylistName = stylists.find(s => s.id === booking.stylistId)?.name || 'Estilista Desconocido';
            return {
                ...booking,
                serviceName,
                stylistName,
            };
        });
    
    return (
        <DashboardClient 
            totalRevenue={totalRevenue}
            totalBookings={totalBookings}
            activeStylists={stylists.length}
            bookingsByStylist={bookingsByStylist}
            upcomingBookings={upcomingBookings}
        />
    );
}