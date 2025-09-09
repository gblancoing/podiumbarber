import type { Service, Stylist } from './types';

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
    category: 'Facial',
  },
  {
    id: 'perfilado-cejas',
    name: 'Perfilado Cejas',
    description: 'Define y da forma a tus cejas para una mirada más limpia y definida.',
    price: 5000,
    duration: 10,
    category: 'Facial',
  },
  {
    id: 'limpieza-facial',
    name: 'Limpieza Facial',
    description: 'Tratamiento completo para purificar y revitalizar la piel del rostro.',
    price: 18000,
    duration: 30,
    category: 'Facial',
  },
];

// Lista de todos los estilistas disponibles
export const stylists: Stylist[] = [
  {
    id: 'andres-leyton',
    name: 'Andres Leyton',
    bio: 'Especialista en cortes urbanos, diseños y color. Con más de 5 años de experiencia, transforma tu look.',
    avatarUrl: '/avatars/andres-leyton.jpg',
    specialties: ['Cortes Urbanos', 'Diseño', 'Color'],
    services: ['corte-pelo', 'corte-diseno', 'barba-vapor-ozono', 'perfilado-cejas'],
  },
  {
    id: 'brandon-muñoz',
    name: 'Brandon Muñoz',
    bio: 'Experto en cortes clásicos y barbería tradicional. La precisión y el detalle son mi firma.',
    avatarUrl: '/avatars/brandon-munoz.jpg',
    specialties: ['Cortes Clásicos', 'Barbería Tradicional', 'Afeitado'],
    services: ['corte-pelo', 'corte-escolar', 'barba-toalla-caliente', 'barba-sencilla', 'limpieza-facial'],
  },
];

// --- DATOS DESTACADOS PARA LA PÁGINA DE INICIO ---

// Exportamos una selección de servicios para mostrar en la página principal.
export const featuredServices: Service[] = [
  services.find(s => s.id === 'corte-diseno')!,
  services.find(s => s.id === 'barba-vapor-ozono')!,
  services.find(s => s.id === 'limpieza-facial')!,
];

// Exportamos los estilistas para mostrarlos en la página principal.
export const featuredStylists: Stylist[] = stylists;
