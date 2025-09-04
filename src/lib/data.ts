import type { Stylist, Service, Booking } from './types';

export const services: Service[] = [
  {
    id: 'cut-style',
    name: 'Corte y Peinado',
    description: 'Un corte de pelo personalizado seguido de una sesión de peinado profesional.',
    price: 30000,
    duration: 60,
    category: 'Corte y Peinado',
  },
  {
    id: 'balayage',
    name: 'Balayage',
    description: 'Técnica de coloración que crea un efecto degradado y natural, como aclarado por el sol.',
    price: 85000,
    duration: 180,
    category: 'Coloración',
  },
  {
    id: 'full-color',
    name: 'Coloración Completa',
    description: 'Aplicación de un solo color desde la raíz hasta las puntas.',
    price: 45000,
    duration: 120,
    category: 'Coloración',
  },
  {
    id: 'keratin',
    name: 'Tratamiento de Queratina',
    description: 'Un tratamiento de alisado que sella la cutícula del cabello con una capa de proteína que elimina el frizz.',
    price: 120000,
    duration: 210,
    category: 'Tratamientos',
  },
  {
    id: 'blowout',
    name: 'Brushing Express',
    description: 'Consigue un brushing voluminoso y elegante que dura días.',
    price: 20000,
    duration: 45,
    category: 'Corte y Peinado',
  },
  {
    id: 'updo',
    name: 'Peinado para Ocasión Especial',
    description: 'Un peinado elegante para matrimonios, fiestas u cualquier evento especial.',
    price: 35000,
    duration: 75,
    category: 'Corte y Peinado',
  },
];

export const stylists: Stylist[] = [
  {
    id: 'alex',
    name: 'Alex Johnson',
    bio: 'Con más de 10 años de experiencia, Alex se especializa en coloración creativa y técnicas de corte modernas. Alex cree en la creación de looks personalizados que realzan la belleza natural.',
    avatarUrl: 'https://storage.googleapis.com/aai-web-samples/nextjs/hair-salon/stylist-1.jpg',
    specialties: ['Color Creativo', 'Balayage', 'Cortes Modernos'],
    services: ['cut-style', 'balayage', 'full-color'],
  },
  {
    id: 'bella',
    name: 'Bella Chen',
    bio: 'Bella es una maestra del corte de precisión y el peinado elegante. Su pasión es hacer que los clientes se sientan seguros y hermosos con un look que es a la vez atemporal y contemporáneo.',
    avatarUrl: 'https://storage.googleapis.com/aai-web-samples/nextjs/hair-salon/stylist-2.jpg',
    specialties: ['Cortes de Precisión', 'Brushing', 'Peinados de Fiesta'],
    services: ['cut-style', 'blowout', 'updo'],
  },
  {
    id: 'charlie',
    name: 'Charlie Davis',
    bio: 'A Charlie le encanta transformar el cabello a través de la textura y los tratamientos. Especializado en tratamientos de queratina y alisado, Charlie puede domar cualquier frizz y añadir un brillo lujoso.',
    avatarUrl: 'https://storage.googleapis.com/aai-web-samples/nextjs/hair-salon/stylist-3.jpg',
    specialties: ['Tratamientos de Queratina', 'Reparación Capilar', 'Pelo Largo'],
    services: ['keratin', 'cut-style'],
  },
  {
    id: 'dana',
    name: 'Dana Rodriguez',
    bio: 'Dana es una experta en todo lo relacionado con el color. Desde reflejos sutiles hasta tonos audaces y vibrantes, Dana trabaja con cada cliente para encontrar el tono perfecto que coincida con su personalidad y estilo.',
    avatarUrl: 'https://storage.googleapis.com/aai-web-samples/nextjs/hair-salon/stylist-4.jpg',
    specialties: ['Colores Vibrantes', 'Corrección de Color', 'Reflejos'],
    services: ['balayage', 'full-color', 'cut-style'],
  },
];

export const featuredServices = services.slice(0, 3);
export const featuredStylists = stylists.slice(0, 4);


// --- Simulación de base de datos de citas ---
// Usamos una variable global para simular una base de datos persistente en memoria.
// Esto asegura que los datos no se reinicien con cada recarga en caliente en desarrollo
// y que persistan en un entorno de producción entre peticiones.
const globalForDb = globalThis as unknown as { 
    bookings: Booking[]; 
    nextBookingId: number 
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

export async function saveNewBooking(bookingData: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
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
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30'
  ];

  if (date.getDay() === 0) return []; // Cerrado los domingos
  if (date.getDay() === 6) return allSlots.slice(0, 8); // Horario más corto los sábados

  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  
  const existingBookings = bookingsDb.filter(b => b.stylistId === stylistId && b.date === dateString);
  const bookedTimes = new Set(existingBookings.map(b => b.time));
  
  return allSlots.filter(time => !bookedTimes.has(time));
};
