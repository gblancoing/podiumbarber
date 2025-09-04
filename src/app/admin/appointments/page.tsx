import { getBookings, services, stylists } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from "@/components/ui/card";
import { List } from "lucide-react";

export default async function AppointmentsPage() {
  const appointments = await getBookings();

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Desconocido';
  const getStylistName = (id: string) => stylists.find(s => s.id === id)?.name || 'Desconocido';

  return (
    <div className="space-y-8">
        <div className="flex items-center gap-4">
            <List className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Todas las Citas</h1>
        </div>
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableCaption className="p-4">
                        {appointments.length > 0
                        ? "Una lista de todas las citas reservadas."
                        : "Aún no hay citas reservadas."}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Estilista</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead className="text-right">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((appt) => (
                        <TableRow key={appt.id}>
                            <TableCell className="font-medium">{appt.customerName}</TableCell>
                            <TableCell>{appt.customerEmail}</TableCell>
                            <TableCell>{format(new Date(appt.date), 'PPP', { locale: es })}</TableCell>
                            <TableCell>{appt.time}</TableCell>
                            <TableCell>{getStylistName(appt.stylistId)}</TableCell>
                            <TableCell>{getServiceName(appt.serviceId)}</TableCell>
                            <TableCell className="text-right">
                            <Badge variant={appt.status === 'confirmed' ? 'default' : 'secondary'}>
                                {appt.status}
                            </Badge>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
