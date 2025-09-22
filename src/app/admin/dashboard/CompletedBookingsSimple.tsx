'use client';

import { useState } from 'react';
import { services as staticServices, stylists as staticStylists } from '../../../lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, CheckCircle, DollarSign } from 'lucide-react';
import type { Booking } from '../../../lib/types';

interface CompletedBookingSimple extends Booking {
  status: 'completed';
  serviceName: string;
  stylistName: string;
  additionalServices?: Array<{
    id: string;
    name: string;
    price: number;
    addedAt: Date;
  }>;
  totalAmount?: number;
}

interface CompletedBookingsSimpleProps {
  bookings: Booking[];
}

export function CompletedBookingsSimple({ bookings }: CompletedBookingsSimpleProps) {
  const [selectedBooking, setSelectedBooking] = useState<CompletedBookingSimple | null>(null);
  const [newService, setNewService] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  // Filtrar solo las reservas completadas y procesar datos
  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed'
  ).map(booking => {
    const service = staticServices.find(s => s.id === booking.serviceId);
    const stylist = staticStylists.find(s => s.id === booking.stylistId);
    
    return {
      ...booking,
      serviceName: booking.serviceName || service?.name || 'Servicio no encontrado',
      stylistName: booking.stylistName || stylist?.name || 'Estilista no encontrado',
    } as CompletedBookingSimple;
  });

  const handleAddService = () => {
    if (!selectedBooking || !newService || !newServicePrice) return;

    const additionalService = {
      id: Date.now().toString(),
      name: newService,
      price: parseFloat(newServicePrice),
      addedAt: new Date()
    };

    // Aquí deberías actualizar la base de datos
    console.log('Agregando servicio adicional:', additionalService);
    
    // Limpiar el formulario
    setNewService('');
    setNewServicePrice('');
  };

  const getTotalAmount = (booking: CompletedBookingSimple) => {
    const basePrice = booking.price || 0;
    const additionalPrice = booking.additionalServices?.reduce((sum, service) => sum + service.price, 0) || 0;
    return basePrice + additionalPrice;
  };

  if (completedBookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No hay reservas completadas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Reservas Completadas
        </CardTitle>
        <CardDescription>
          Reservas que ya han sido atendidas. Puedes agregar servicios adicionales.
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
              <TableHead>Estado</TableHead>
              <TableHead>Precio Base</TableHead>
              <TableHead>Servicios Adicionales</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedBookings.map((booking) => (
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
                  <Badge variant="default" className="bg-green-500">
                    Completada
                  </Badge>
                </TableCell>
                <TableCell>${booking.price?.toLocaleString() || 'N/A'}</TableCell>
                <TableCell>
                  {booking.additionalServices?.length || 0} servicios
                </TableCell>
                <TableCell className="font-medium">
                  ${getTotalAmount(booking).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Agregar Servicio Adicional</DialogTitle>
                        <DialogDescription>
                          Agrega un servicio adicional para la reserva de {booking.customerName || booking.userName}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="service" className="text-right">
                            Servicio
                          </Label>
                          <Select value={newService} onValueChange={setNewService}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Seleccionar servicio" />
                            </SelectTrigger>
                            <SelectContent>
                              {staticServices.map((service) => (
                                <SelectItem key={service.id} value={service.name}>
                                  {service.name} - ${service.price.toLocaleString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">
                            Precio
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            value={newServicePrice}
                            onChange={(e) => setNewServicePrice(e.target.value)}
                            className="col-span-3"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddService}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Servicio
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
