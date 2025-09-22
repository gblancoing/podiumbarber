'use client';

import { useState } from 'react';
import { services as staticServices, stylists as staticStylists } from '../../../lib/data';
import type { Booking } from '../../../lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Las props de servicios y estilistas ya no son necesarias.
interface RecentBookingsProps {
  bookings: Booking[];
  onBookingUpdate?: (bookingId: string, updates: Partial<Booking>) => void;
  onBookingDelete?: (bookingId: string) => void;
}

type ValidBooking = Booking & {
    serviceName: string;
    stylistName: string;
    formattedPrice: string;
    safeDate: Date;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// El componente ahora solo necesita la lista de reservas.
export function RecentBookings({ bookings, onBookingUpdate, onBookingDelete }: RecentBookingsProps) {
  const [editingBooking, setEditingBooking] = useState<ValidBooking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<ValidBooking | null>(null);
  console.log("=== DASHBOARD: DATOS RECIBIDOS ===");
  console.log("bookings recibidos:", bookings);

  const validBookings = bookings.reduce<ValidBooking[]>((acc, booking) => {
    // Se busca el servicio y el estilista en los datos estáticos importados.
    const service = staticServices.find(s => s.id === booking.serviceId);
    const stylist = staticStylists.find(s => s.id === booking.stylistId);

    // La reserva solo es válida si ambos (servicio y estilista) se encuentran.
    if (service && stylist) {
      const serviceName = booking.serviceName ?? service.name;
      const stylistName = booking.stylistName ?? stylist.name;
      const price = booking.price ?? service.price;

      const formattedPrice = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(price);

      const safeDate = new Date(booking.date.replace(/-/g, '/'));
      
      acc.push({
          ...booking,
          serviceName,
          stylistName,
          formattedPrice,
          safeDate,
      });
    }

    return acc;
  }, []);

  const handleEditBooking = (booking: ValidBooking) => {
    setEditingBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking || !onBookingUpdate) return;
    
    const success = await onBookingUpdate(editingBooking.id, {
      time: editingBooking.time,
      date: editingBooking.date,
      status: editingBooking.status
    });
    
    if (success) {
      setIsEditDialogOpen(false);
      setEditingBooking(null);
    }
  };

  const handleDeleteBooking = (booking: ValidBooking) => {
    setBookingToDelete(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusChange = (bookingId: string, newStatus: 'confirmed' | 'completed' | 'canceled') => {
    if (onBookingUpdate) {
      onBookingUpdate(bookingId, { status: newStatus });
    }
  };

  const handleConfirmDelete = () => {
    if (bookingToDelete && onBookingDelete) {
      onBookingDelete(bookingToDelete.id);
      setIsDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="secondary">Confirmada</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completada</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (validBookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No hay reservas válidas para mostrar todavía.</p>
          {bookings.length > 0 && <p className="text-xs text-muted-foreground mt-2">Se encontraron {bookings.length} reservas, pero no se pudieron validar con los datos de servicios/estilistas actuales.</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
      <CardHeader>
        <CardTitle>Reservas Recientes</CardTitle>
        <CardDescription>Aquí están las últimas reservas registradas en el sistema.</CardDescription>
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
              <TableHead>Estado</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validBookings.map((booking) => {
              const customerName = booking.customerName || booking.userName || 'Sin nombre';
              const customerEmail = booking.customerEmail || booking.userEmail || 'Sin email';
              
              return (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{customerName}</TableCell>
                  <TableCell>{customerEmail}</TableCell>
                  <TableCell>{booking.serviceName}</TableCell>
                  <TableCell>{booking.stylistName}</TableCell>
                  <TableCell>
                    {capitalize(format(booking.safeDate, "dd 'de' MMMM 'de' yyyy", { locale: es }))}
                  </TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">{booking.formattedPrice}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditBooking(booking)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Completada
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'canceled')}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancelar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteBooking(booking)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    {/* Diálogo de Edición */}
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Reserva</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la reserva. Puedes cambiar la hora y el estado.
          </DialogDescription>
        </DialogHeader>
        {editingBooking && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Cliente
              </Label>
              <Input
                id="customer"
                value={editingBooking.customerName || editingBooking.userName || ''}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">
                Servicio
              </Label>
              <Input
                id="service"
                value={editingBooking.serviceName}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stylist" className="text-right">
                Estilista
              </Label>
              <Input
                id="stylist"
                value={editingBooking.stylistName}
                className="col-span-3"
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                value={editingBooking.date}
                onChange={(e) => setEditingBooking({
                  ...editingBooking,
                  date: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Hora
              </Label>
              <Input
                id="time"
                type="time"
                value={editingBooking.time}
                onChange={(e) => setEditingBooking({
                  ...editingBooking,
                  time: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Estado
              </Label>
              <Select
                value={editingBooking.status}
                onValueChange={(value) => setEditingBooking({
                  ...editingBooking,
                  status: value as 'confirmed' | 'completed' | 'canceled'
                })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmada</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="canceled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Diálogo de Eliminación */}
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Reserva</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar esta reserva? 
            Se moverá a la tabla de reservas eliminadas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (bookingToDelete && onBookingDelete) {
                onBookingDelete(bookingToDelete.id);
                setIsDeleteDialogOpen(false);
                setBookingToDelete(null);
              }
            }}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
