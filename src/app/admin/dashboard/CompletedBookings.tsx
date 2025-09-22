'use client';

import { useState } from 'react';
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
import { services } from '../../../lib/data';

interface CompletedBooking extends Booking {
  status: 'completed';
  additionalServices?: Array<{
    id: string;
    name: string;
    price: number;
    addedAt: Date;
  }>;
  totalAmount: number;
}

interface CompletedBookingsProps {
  bookings: Booking[];
}

export function CompletedBookings({ bookings }: CompletedBookingsProps) {
  const [selectedBooking, setSelectedBooking] = useState<CompletedBooking | null>(null);
  const [newService, setNewService] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  // Filtrar solo las reservas completadas
  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed'
  ) as CompletedBooking[];

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

  const getTotalAmount = (booking: CompletedBooking) => {
    const basePrice = booking.servicePrice || 0;
    const additionalPrice = booking.additionalServices?.reduce((sum, service) => sum + service.price, 0) || 0;
    return basePrice + additionalPrice;
  };

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
              <TableHead>Servicio Principal</TableHead>
              <TableHead>Estilista</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Servicios Adicionales</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.customerName}</TableCell>
                <TableCell>{booking.customerEmail}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{booking.serviceName}</Badge>
                </TableCell>
                <TableCell>{booking.stylistName}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {booking.additionalServices?.map((service) => (
                      <Badge key={service.id} variant="outline" className="text-xs">
                        {service.name} (+${service.price.toLocaleString()})
                      </Badge>
                    )) || <span className="text-muted-foreground text-sm">Ninguno</span>}
                  </div>
                </TableCell>
                <TableCell className="font-bold text-green-600">
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
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Servicio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Agregar Servicio Adicional</DialogTitle>
                        <DialogDescription>
                          Agregar un servicio adicional para {booking.customerName}
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
                              {services.map((service) => (
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
                          <Plus className="h-4 w-4 mr-1" />
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
        {completedBookings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No hay reservas completadas aún.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
