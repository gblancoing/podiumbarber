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

export default async function AppointmentsPage() {
  const appointments = await getBookings();

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Desconocido';
  const getStylistName = (id: string) => stylists.find(s => s.id === id)?.name || 'Desconocido';

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold">Panel de Administración</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Gestión de Citas
        </p>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableCaption>
            {appointments.length > 0
              ? "Una lista de todas las citas reservadas."
              : "Aún no hay citas reservadas."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
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
      </div>
    </div>
  );
}
