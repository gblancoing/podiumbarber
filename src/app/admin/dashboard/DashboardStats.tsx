'use client';

import type { Booking, Service } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- Props del Componente ---
interface DashboardStatsProps {
    bookings: Booking[];
    services: Service[];
}

// --- Componente para las Estadísticas ---

export function DashboardStats({ bookings, services }: DashboardStatsProps) {
    // Calcular ingresos totales
    const totalRevenue = bookings.reduce((acc, booking) => {
        const service = services.find(s => s.id === booking.serviceId);
        return acc + (service ? service.price : 0);
    }, 0);

    // Contar el número total de reservas
    const totalBookings = bookings.length;

    // Formatear los ingresos a un formato de moneda local (ej. CLP)
    const formattedRevenue = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(totalRevenue);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Tarjeta de Ingresos Totales */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    <span className="text-2xl">💰</span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formattedRevenue}</div>
                    <p className="text-xs text-muted-foreground">
                        Suma de todas las reservas completadas
                    </p>
                </CardContent>
            </Card>

            {/* Tarjeta de Reservas Totales */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
                    <span className="text-2xl">📅</span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{totalBookings}</div>
                    <p className="text-xs text-muted-foreground">
                        Cantidad total de citas registradas
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
