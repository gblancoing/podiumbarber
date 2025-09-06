'use client';

import type { Booking, Service, Stylist } from '@/lib/types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// --- Props del Componente ---
interface RecentBookingsProps {
    bookings: Booking[];
    services: Service[];
    stylists: Stylist[];
}

// --- Componente para las Reservas Recientes ---

export function RecentBookings({ bookings, services, stylists }: RecentBookingsProps) {
    // Función para obtener el nombre del servicio a partir de su ID
    const getServiceName = (serviceId: string) => {
        const service = services.find(s => s.id === serviceId);
        return service ? service.name : 'Servicio Desconocido';
    };

    // Función para obtener el nombre del estilista a partir de su ID
    const getStylistName = (stylistId: string) => {
        const stylist = stylists.find(s => s.id === stylistId);
        return stylist ? stylist.name : 'Estilista Desconocido';
    };

    // Función para formatear la fecha
    const formatDate = (date: any) => {
        if (!date) return 'Fecha no disponible';
        // Asumimos que `date` es un string de fecha como "YYYY-MM-DD"
        const dateObj = new Date(date);
         if (isNaN(dateObj.getTime())) return 'Fecha inválida';
        // Ajustamos la zona horaria para que no se desfase un día
        dateObj.setUTCHours(0, 0, 0, 0);
        return dateObj.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reservas Recientes</CardTitle>
                <CardDescription>
                    Aquí están las últimas reservas registradas en el sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Servicio</TableHead>
                            <TableHead>Estilista</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Hora</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length > 0 ? (
                            bookings.slice(0, 10).map((booking) => ( // Mostramos solo las 10 más recientes
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.customerName}</TableCell>
                                    <TableCell>{booking.customerEmail}</TableCell>
                                    <TableCell>{getServiceName(booking.serviceId)}</TableCell>
                                    <TableCell>{getStylistName(booking.stylistId)}</TableCell>
                                    <TableCell>{formatDate(booking.date)}</TableCell>
                                    <TableCell>{booking.time}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Todavía no hay reservas registradas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
