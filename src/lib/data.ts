import type { Service, Stylist } from './types';

// --- LISTA DE SERVICIOS --- 
export const services: Service[] = [
  { id: 'corte-pelo', name: 'Corte de Pelo', category: 'Corte y Peinado', duration: 45, price: 15000, description: 'Un corte de pelo clásico o moderno, adaptado a tu estilo y fisionomía. Incluye lavado y peinado.' },
  { id: 'corte-escolar', name: 'Corte Escolar', category: 'Corte y Peinado', duration: 30, price: 8000, description: 'Un corte sencillo y prolijo para estudiantes. Válido hasta los 14 años.' },
  { id: 'corte-diseno', name: 'Corte con Diseño', category: 'Corte y Peinado', duration: 60, price: 20000, description: 'Un corte que incorpora diseños, líneas o patrones creativos. Ideal para un look audaz y personalizado.' },
  { id: 'perfilado-cejas', name: 'Perfilado de Cejas', category: 'Otros Servicios', duration: 15, price: 5000, description: 'Define y da forma a tus cejas para enmarcar tu mirada. Realizado con navaja o pinzas.' },
  { id: 'afeitado-clasico', name: 'Afeitado Clásico', category: 'Barba', duration: 40, price: 12000, description: 'Un afeitado tradicional con toallas calientes, espuma y navaja para una piel suave y sin irritación.' },
  { id: 'perfilado-barba', name: 'Perfilado de Barba', category: 'Barba', duration: 25, price: 7000, description: 'Define los contornos de tu barba y bigote para un look pulcro y cuidado.' },
  { id: 'limpieza-facial', name: 'Limpieza Facial', category: 'Otros Servicios', duration: 50, price: 25000, description: 'Una limpieza profunda para revitalizar tu piel, eliminando impurezas y puntos negros.' },
  { id: 'mascarilla-negra', name: 'Mascarilla Negra', category: 'Otros Servicios', duration: 20, price: 10000, description: 'Mascarilla peel-off para eliminar impurezas y dejar la piel con una sensación de frescura.' },
];

// Generamos una lista con todos los IDs de los servicios. Útil para asignar todos los servicios a un estilista.
const allServiceIds = services.map(s => s.id);

// --- LISTA DE ESTILISTAS ---

const defaultWorkingHours = {
  lunes: { start: '10:00', end: '19:00' },
  martes: { start: '10:00', end: '19:00' },
  miércoles: { start: '10:00', end: '19:00' },
  jueves: { start: '10:00', end: '19:00' },
  viernes: { start: '10:00', end: '19:00' },
  sábado: { start: '10:00', end: '16:00' },
  domingo: null, 
};


export const stylists: Stylist[] = [
  {
    id: 'stiven-vargas',
    name: 'Stiven Vargas',
    bio: 'Especialista en cortes modernos y diseños de barba. Stiven combina precisión técnica con un estilo urbano para crear looks únicos y a la vanguardia.',
    avatarUrl: '/img/steven.png',
    specialties: ['Cortes Urbanos', 'Diseño de Barba', 'Color'],
    services: allServiceIds,
    workingHours: defaultWorkingHours,
  },
  {
    id: 'kamilo-fonseca',
    name: 'Kamilo Fonseca',
    bio: 'Un maestro de la barbería clásica y los cortes tradicionales. Kamilo se enfoca en la experiencia del cliente, asegurando un servicio relajante y un acabado impecable en cada visita.',
    avatarUrl: '/img/camilo.png',
    specialties: ['Cortes Clásicos', 'Afeitado Tradicional', 'Barbería'],
    services: allServiceIds,
    workingHours: defaultWorkingHours,
  },
  {
    id: 'andres-leyton',
    name: 'Andres Leyton',
    bio: 'Andres es un estilista versátil con pasión por las últimas tendencias. Se destaca en la creación de looks personalizados que reflejan la personalidad de cada cliente.',
    avatarUrl: '/img/camilo.png', // Asignación temporal
    specialties: ['Corte y Estilo', 'Coloración Creativa', 'Tratamientos Capilares'],
    services: allServiceIds,
    workingHours: defaultWorkingHours,
  },
];

// --- DATOS DESTACADOS PARA LA PÁGINA DE INICIO ---

export const featuredData = {
  services: services.slice(0, 3),
  stylists: stylists,
};