
import type { Service, Stylist } from './types';
import { db } from './firebase';
import { collection, getDocs, query, where } from "firebase/firestore";

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

const allServiceIds = services.map(s => s.id);

export const stylists: Stylist[] = [
  {
    id: 'stiven-vargas',
    name: 'Stiven Vargas',
    bio: 'Especialista en cortes modernos y diseños de barba. Stiven combina precisión técnica con un estilo urbano para crear looks únicos y a la vanguardia.',
    avatarUrl: '/img/steven.png',
    specialties: ['Cortes Urbanos', 'Diseño de Barba', 'Color'],
    services: allServiceIds,
  },
  {
    id: 'kamilo-fonseca',
    name: 'Kamilo Fonseca',
    bio: 'Un maestro de la barbería clásica y los cortes tradicionales. Kamilo se enfoca en la experiencia del cliente, asegurando un servicio relajante y un acabado impecable en cada visita.',
    avatarUrl: '/img/camilo.png',
    specialties: ['Cortes Clásicos', 'Afeitado Tradicional', 'Barbería'],
    services: allServiceIds,
  },
];

export const featuredServices = services.slice(0, 3);
export const featuredStylists = stylists.slice(0, 2);


// --- NUEVA FUNCIÓN DE DISPONIBILIDAD CON FIREBASE ---
export const getAvailableTimeSlots = async (date: Date, stylistId: string) => {
  // Horarios de atención estándar
  const allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30',
  ];

  // Reglas de negocio (Domingos cerrados, Sábados horario corto)
  if (date.getDay() === 0) return []; // Domingo
  if (date.getDay() === 6) return allSlots.slice(0, 8); // Sábado

  // Formatear la fecha a YYYY-MM-DD para la consulta en Firestore
  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  try {
    // Consultar las reservas existentes en Firebase para ese estilista y día
    const q = query(
      collection(db, "reservations"), 
      where("stylistId", "==", stylistId), 
      where("date", "==", dateString)
    );
    
    const querySnapshot = await getDocs(q);
    const bookedTimes = new Set(querySnapshot.docs.map(doc => doc.data().time));

    // Filtrar los horarios disponibles, eliminando los ya reservados
    const availableSlots = allSlots.filter(time => !bookedTimes.has(time));
    
    console.log('Horarios disponibles para', dateString, stylistId, ':', availableSlots);
    return availableSlots;

  } catch (error) {
    console.error("Error al obtener la disponibilidad de Firebase:", error);
    // En caso de error, devolver todos los horarios para no bloquear al usuario
    return allSlots; 
  }
};