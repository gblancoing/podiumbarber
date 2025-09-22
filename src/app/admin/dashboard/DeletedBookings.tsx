'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, RotateCcw, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Booking } from "@/lib/types";

interface DeletedBookingsProps {
  bookings: Booking[];
  onBookingRestore?: (bookingId: string) => Promise<boolean>;
}

export function DeletedBookings({ bookings, onBookingRestore }: DeletedBookingsProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const handleRestoreBooking = async (bookingId: string) => {
    if (onBookingRestore) {
      const success = await onBookingRestore(bookingId);
      if (success) {
        setIsRestoreDialogOpen(false);
        setSelectedBooking(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deleted':
        return <Badge variant="destructive">Eliminada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd MMMM yyyy', { locale: es });
    } catch {
      return 'N/A';
    }
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return 'N/A';
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return 'N/A';
    }
  };

  if (bookings.length === 0) {
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
          Total de reservas eliminadas: {bookings.length}
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
                <TableHead>Precio</TableHead>
                <TableHead>Eliminada</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.customerName || booking.userName || 'N/A'}
                  </TableCell>
                  <TableCell>{booking.customerEmail || booking.userEmail || 'N/A'}</TableCell>
                  <TableCell>{booking.serviceName || 'N/A'}</TableCell>
                  <TableCell>{booking.stylistName || 'N/A'}</TableCell>
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{formatTime(booking.time)}</TableCell>
                  <TableCell>{getStatusBadge(booking.status || 'unknown')}</TableCell>
                  <TableCell>${booking.price?.toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>
                    {booking.deletedAt ? (() => {
                      try {
                        return format(new Date(booking.deletedAt), 'dd/MM/yyyy HH:mm');
                      } catch {
                        return 'N/A';
                      }
                    })() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
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
                              onClick={() => handleRestoreBooking(booking.id)}
                            >
                              Restaurar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
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
