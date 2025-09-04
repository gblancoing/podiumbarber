import { getBookings, services, stylists } from "@/lib/data";
import AdminLayout from "../AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, List } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function DashboardPage() {
    const bookings = await getBookings();
    
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => {
        const service = services.find(s => s.id === booking.serviceId);
        return sum + (service?.price || 0);
    }, 0);

    const bookingsByStylist = stylists.map(stylist => ({
        name: stylist.name.split(' ')[0],
        citas: bookings.filter(b => b.stylistId === stylist.id).length
    }));

    const upcomingBookings = bookings
        .filter(b => new Date(b.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);
    
    const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Desconocido';
    const getStylistName = (id: string) => stylists.find(s => s.id === id)?.name || 'Desconocido';


    return (
        <AdminLayout>
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
                            <div className="text-2xl font-bold">{stylists.length}</div>
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
        </AdminLayout>
    );
}
