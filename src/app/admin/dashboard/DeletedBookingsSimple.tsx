'use client';

import { useState } from "react";
import { services as staticServices, stylists as staticStylists } from '../../../lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, RotateCcw } from "lucide-react";
import type { Booking } from "@/lib/types";

interface DeletedBookingsSimpleProps {
  bookings: Booking[];
  onBookingRestore?: (bookingId: string) => Promise<boolean>;
}

type ValidBooking = Booking & {
  serviceName: string;
  stylistName: string;
};

export function DeletedBookingsSimple({ bookings, onBookingRestore }: DeletedBookingsSimpleProps) {
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Procesar las reservas para obtener nombres de servicios y estilistas
  const validBookings = bookings.reduce<ValidBooking[]>((acc, booking) => {
    const service = staticServices.find(s => s.id === booking.serviceId);
    const stylist = staticStylists.find(s => s.id === booking.stylistId);

    if (service && stylist) {
      acc.push({
        ...booking,
        serviceName: booking.serviceName || service.name,
        stylistName: booking.stylistName || stylist.name,
      });
    } else {
      // Si no encontramos el servicio o estilista, usar los datos que ya tiene
      acc.push({
        ...booking,
        serviceName: booking.serviceName || 'Servicio no encontrado',
        stylistName: booking.stylistName || 'Estilista no encontrado',
      });
    }

    return acc;
  }, []);

  const handleRestoreBooking = async (bookingId: string) => {
    if (onBookingRestore) {
      const success = await onBookingRestore(bookingId);
      if (success) {
        setIsRestoreDialogOpen(false);
        setSelectedBookingId(null);
      }
    }
  };

  if (validBookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Trash2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No hay reservas eliminadas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservas Eliminadas</CardTitle>
        <CardDescription>
          Total de reservas eliminadas: {validBookings.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Estilista</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.customerName || booking.userName || 'N/A'}
                  </TableCell>
                  <TableCell>{booking.customerEmail || booking.userEmail || 'N/A'}</TableCell>
                  <TableCell>{booking.serviceName}</TableCell>
                  <TableCell>{booking.stylistName}</TableCell>
                  <TableCell>{booking.date || 'N/A'}</TableCell>
                  <TableCell>{booking.time || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Eliminada</Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBookingId(booking.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restaurar Reserva</DialogTitle>
                          <DialogDescription>
                            ¿Estás seguro de que quieres restaurar esta reserva? 
                            Se cambiará el estado a "Confirmada".
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsRestoreDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => selectedBookingId && handleRestoreBooking(selectedBookingId)}
                          >
                            Restaurar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
