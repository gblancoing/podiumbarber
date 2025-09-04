'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, List } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { services, stylists } from "@/lib/data";
import type { Booking } from "@/lib/types";

interface DashboardClientProps {
    totalRevenue: number;
    totalBookings: number;
    activeStylists: number;
    bookingsByStylist: { name: string; citas: number }[];
    upcomingBookings: Booking[];
}

export function DashboardClient({
    totalRevenue,
    totalBookings,
    activeStylists,
    bookingsByStylist,
    upcomingBookings
}: DashboardClientProps) {

    const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Desconocido';
    const getStylistName = (id: string) => stylists.find(s => s.id === id)?.name || 'Desconocido';

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString('es-CL')}</div>
                        <p className="text-xs text-muted-foreground">Estimación basada en servicios completados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Citas Totales</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBookings}</div>
                        <p className="text-xs text-muted-foreground">Desde el inicio de los tiempos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estilistas Activos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeStylists}</div>
                        <p className="text-xs text-muted-foreground">Listos para atender</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Appointments by Stylist Chart */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Citas por Estilista</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={bookingsByStylist}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                                <Bar dataKey="citas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><List /> Próximas Citas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingBookings.length > 0 ? (
                            <ul className="space-y-4">
                                {upcomingBookings.map(b => (
                                    <li key={b.id} className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="font-medium">{b.customerName}</p>
                                            <p className="text-muted-foreground">{getServiceName(b.serviceId)} con {getStylistName(b.stylistId).split(' ')[0]}</p>
                                        </div>
                                        <Badge variant="outline">{format(new Date(b.date), "d MMM, HH:mm", {locale: es})}</Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No hay citas próximas.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
