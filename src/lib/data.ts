
import { Service, Stylist } from './types';

// Lista de todos los servicios ofrecidos
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
    id: 'corte-disemo', // FIX: Corregido para coincidir con la base de datos
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
    description:
      'Incluye: Diseño o perfilado, aplicación de vapor de ozono y exfoliación.',
    price: 10000,
    duration: 30,
    category: 'Barba',
  },
  {
    id: 'perfilado-cejas',
    name: 'Perfilado de Cejas',
    description: 'Definición y limpieza de cejas para una mirada impecable.',
    price: 5000,
    duration: 15,
    category: 'Facial',
  },
  {
    id: 'mascarilla-negra',
    name: 'Mascarilla Negra',
    description: 'Elimina puntos negros y purifica la piel.',
    price: 5000,
    duration: 20,
    category: 'Facial',
  },
];

// Mapeo de IDs de servicios para fácil acceso
const allServiceIds = services.map(s => s.id);

// Lista de estilistas
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

// Servicios y estilistas destacados para la página de inicio
export const featuredServices = services.slice(0, 3);
export const featuredStylists = stylists.slice(0, 2);
