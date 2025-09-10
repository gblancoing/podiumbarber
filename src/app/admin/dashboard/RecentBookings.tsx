'use client';

import type { Booking, Service, Stylist } from '../../../lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecentBookingsProps {
  bookings: Booking[];
  services: Service[];
  stylists: Stylist[];
}

// Tipo auxiliar para las reservas que han sido validadas y enriquecidas.
// Esto mejora la seguridad de tipos en el resto del componente.
type ValidBooking = Booking & {
    serviceName: string;
    stylistName: string;
    formattedPrice: string;
    safeDate: Date;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function RecentBookings({ bookings, services, stylists }: RecentBookingsProps) {

  // FIX: Se utiliza `reduce` para filtrar y mapear en un solo paso.
  // Este enfoque es más robusto y seguro en tipos que la combinación de `map` y `filter`.
  const validBookings = bookings.reduce<ValidBooking[]>((acc, booking) => {
    const service = services.find(s => s.id === booking.serviceId);
    const stylist = stylists.find(s => s.id === booking.stylistId);

    // Solo si se encuentran el servicio y el estilista, la reserva es válida.
    if (service && stylist) {
      const serviceName = booking.serviceName ?? service.name;
      const stylistName = booking.stylistName ?? stylist.name;
      const price = booking.price ?? service.price;

      const formattedPrice = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(price);

      const safeDate = new Date(booking.date.replace(/-/g, '/'));
      
      // Añade la reserva válida y enriquecida al acumulador.
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

  if (validBookings.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 text-center">
        <p className="text-gray-400">No hay reservas válidas para mostrar todavía.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 md:p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Reservas Recientes</h2>
      <p className="text-sm text-gray-400 mb-6">Aquí están las últimas reservas registradas en el sistema.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="border-b border-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Cliente</th>
              <th scope="col" className="px-4 py-3 font-medium">Email</th>
              <th scope="col" className="px-4 py-3 font-medium">Servicio</th>
              <th scope="col" className="px-4 py-3 font-medium">Estilista</th>
              <th scope="col" className="px-4 py-3 font-medium">Fecha</th>
              <th scope="col" className="px-4 py-3 font-medium">Hora</th>
              <th scope="col" className="px-4 py-3 font-medium text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            {validBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{booking.userName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.userEmail}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.serviceName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.stylistName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {capitalize(format(booking.safeDate, "dd 'de' MMMM 'de' yyyy", { locale: es }))}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.time}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">{booking.formattedPrice}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
