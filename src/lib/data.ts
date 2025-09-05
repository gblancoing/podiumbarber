import type { Booking, Service, Stylist } from './types';

export const services: Service[] = [
  {
    id: 'corte-pelo',
    name: 'Corte de Pelo',
    description:
      'Incluye: Mascarilla para puntos negros, lavado, peinado con producto y cortesía (café, capuchino, cerveza, bebida express o jugo en caja para niños).',
    price: 15000,
    duration: 40,
    category: 'Corte y Peinado',
  },
  {
    id: 'corte-diseno',
    name: 'Corte de Pelo + Diseño Free o Lineas',
    description:
      'Incluye: Mascarilla para puntos negros, lavado, peinado con producto y cortesía (café, capuchino, cerveza o bebida express).',
    price: 17000,
    duration: 45,
    category: 'Corte y Peinado',
  },
  {
    id: 'corte-escolar',
    name: 'Corte Escolar Clasico (sin degrade)',
    description:
      'Incluye: Lavado, peinado con producto y cortesía (bebida o jugo de caja).',
    price: 13000,
    duration: 30,
    category: 'Corte y Peinado',
  },
  {
    id: 'barba-toalla-caliente',
    name: 'Barba con Toalla Caliente',
    description: 'Un arreglo de barba premium con el clásico tratamiento de toalla caliente para relajar y abrir los poros.',
    price: 10000,
    duration: 20,
    category: 'Barba',
  },
  {
    id: 'barba-vapor-ozono',
    name: 'Barba con Vapor Ozono',
    description: 'Tratamiento facial y de barba con vapor de ozono para una limpieza profunda y perfilado perfecto.',
    price: 12000,
    duration: 20,
    category: 'Barba',
  },
  {
    id: 'barba-sencilla',
    name: 'Barba Sencilla',
    description: 'Un perfilado y arreglo rápido para mantener tu barba impecable en el día a día.',
    price: 7000,
    duration: 15,
    category: 'Barba',
  },
  {
    id: 'depilacion-nariz',
    name: 'Depilación de Nariz',
    description: 'Servicio de depilación de nariz.',
    price: 4000,
    duration: 5,
    category: 'Otros Servicios',
  },
  {
    id: 'perfilado-cejas',
    name: 'Perfilado Cejas',
    description: 'Servicio de perfilado de cejas.',
    price: 4000,
    duration: 5,
    category: 'Otros Servicios',
  },
  {
    id: 'depilacion-oidos',
    name: 'Depilación de Oídos',
    description: 'Servicio de depilación de oídos.',
    price: 4000,
    duration: 5,
    category: 'Otros Servicios',
  },
  {
    id: 'color-decolorado',
    name: 'Color (Decolorado Parte Superior)',
    description: 'Servicio de coloración con decolorado en la parte superior.',
    price: 45000,
    duration: 90,
    category: 'Otros Servicios',
  },
  {
    id: 'color-visos',
    name: 'Color (Visos)',
    description: 'Servicio de coloración con visos.',
    price: 35000,
    duration: 90,
    category: 'Otros Servicios',
  },
];

export const stylists: Stylist[] = [
  {
    id: 'stiven-vargas',
    name: 'Stiven Vargas',
    bio: 'Especialista en cortes modernos y diseños de barba. Stiven combina precisión técnica con un estilo urbano para crear looks únicos y a la vanguardia.',
    avatarUrl:
      'https://storage.googleapis.com/aai-web-samples/nextjs/hair-salon/stylist-1.jpg',
    specialties: ['Cortes Urbanos', 'Diseño de Barba', 'Color'],
    services: [
      'corte-pelo',
      'corte-diseno',
      'barba-toalla-caliente',
      'barba-vapor-ozono',
      'color-decolorado',
    ],
  },
  {
    id: 'kamilo-fonseca',
    name: 'Kamilo Fonseca',
    bio: 'Un maestro de la barbería clásica y los cortes tradicionales. Kamilo se enfoca en la experiencia del cliente, asegurando un servicio relajante y un acabado impecable en cada visita.',
    avatarUrl:
      'https://storage.googleapis.com/aai-web-samples/nextjs/hair-salon/stylist-3.jpg',
    specialties: ['Cortes Clásicos', 'Afeitado Tradicional', 'Barbería'],
    services: ['corte-pelo', 'corte-escolar', 'barba-toalla-caliente', 'barba-sencilla', 'perfilado-cejas'],
  },
];

export const featuredServices = services.slice(0, 3);
export const featuredStylists = stylists.slice(0, 2);

// --- Simulación de base de datos de citas ---
// Usamos una variable global para simular una base de datos persistente en memoria.
// Esto asegura que los datos no se reinicien con cada recarga en caliente en desarrollo
// y que persistan en un entorno de producción entre peticiones.
const globalForDb = globalThis as unknown as {
  bookings: Booking[];
  nextBookingId: number;
};

if (!globalForDb.bookings) {
  globalForDb.bookings = [];
}
if (!globalForDb.nextBookingId) {
  globalForDb.nextBookingId = 1;
}

const bookingsDb = globalForDb.bookings;

export async function getBookings(): Promise<Booking[]> {
  // Devolvemos una copia para evitar mutaciones directas.
  return Promise.resolve([...bookingsDb]);
}

export async function saveNewBooking(
  bookingData: Omit<Booking, 'id' | 'status'>
): Promise<Booking> {
  const newBooking: Booking = {
    ...bookingData,
    id: (globalForDb.nextBookingId++).toString(),
    status: 'confirmed',
  };
  bookingsDb.push(newBooking);
  console.log('Cita guardada:', newBooking);
  console.log('Todas las citas:', bookingsDb);

  return Promise.resolve(newBooking);
}

export const getAvailableTimeSlots = (date: Date, stylistId: string) => {
  // En una aplicación real, esto consultaría una base de datos según el horario del estilista.
  // Por ahora, devolveremos una lista estática de horas para cualquier día.
  const allSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
  ];

  if (date.getDay() === 0) return []; // Cerrado los domingos
  if (date.getDay() === 6) return allSlots.slice(0, 8); // Horario más corto los sábados

  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  const existingBookings = bookingsDb.filter(
    b => b.stylistId === stylistId && b.date === dateString
  );
  const bookedTimes = new Set(existingBookings.map(b => b.time));

  return allSlots.filter(time => !bookedTimes.has(time));
};
