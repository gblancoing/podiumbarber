'use client';

// Se importa la información estática de servicios y estilistas como única fuente de verdad.
import { services as staticServices, stylists as staticStylists } from '../../../lib/data';
import type { Booking } from '../../../lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Las props de servicios y estilistas ya no son necesarias.
interface RecentBookingsProps {
  bookings: Booking[];
}

type ValidBooking = Booking & {
    serviceName: string;
    stylistName: string;
    formattedPrice: string;
    safeDate: Date;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// El componente ahora solo necesita la lista de reservas.
export function RecentBookings({ bookings }: RecentBookingsProps) {
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

  if (validBookings.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 text-center">
        <p className="text-gray-400">No hay reservas válidas para mostrar todavía.</p>
        {/* Mensaje de ayuda para depuración en caso de que haya reservas pero no sean válidas */}
        {bookings.length > 0 && <p className="text-xs text-gray-500 mt-2">Se encontraron {bookings.length} reservas, pero no se pudieron validar con los datos de servicios/estilistas actuales.</p>}
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
            {validBookings.map((booking) => {
              // Obtener nombre y email de cualquier campo disponible
              const customerName = booking.customerName || booking.userName || 'Sin nombre';
              const customerEmail = booking.customerEmail || booking.userEmail || 'Sin email';
              
              return (
                <tr key={booking.id} className="border-b border-gray-800 hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{customerName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{customerEmail}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.serviceName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.stylistName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {capitalize(format(booking.safeDate, "dd 'de' MMMM 'de' yyyy", { locale: es }))}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{booking.time}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">{booking.formattedPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
