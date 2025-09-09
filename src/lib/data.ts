import { Service, Stylist, ServiceCategory, Availability, Review, FeaturedData } from './types';

// --- DATOS DE SERVICIOS ---

export const serviceCategories: ServiceCategory[] = [
  { id: 'cortes', name: 'Cortes' },
  { id: 'barberia', name: 'Barbería' },
  { id: 'color', name: 'Color' },
  { id: 'tratamientos', name: 'Tratamientos' },
];

export const services: Service[] = [
  { id: 'corte-pelo', name: 'Corte de Pelo', category: 'Cortes', duration: 45, price: 15000, description: 'Un corte de pelo clásico o moderno, adaptado a tu estilo y fisionomía. Incluye lavado y peinado.' },
  { id: 'corte-escolar', name: 'Corte Escolar', category: 'Cortes', duration: 30, price: 8000, description: 'Un corte sencillo y prolijo para estudiantes. Válido hasta los 14 años.' },
  { id: 'corte-diseno', name: 'Corte con Diseño', category: 'Cortes', duration: 60, price: 20000, description: 'Un corte que incorpora diseños, líneas o patrones creativos. Ideal para un look audaz y personalizado.' },
  { id: 'perfilado-cejas', name: 'Perfilado de Cejas', category: 'Cortes', duration: 15, price: 5000, description: 'Define y da forma a tus cejas para enmarcar tu mirada. Realizado con navaja o pinzas.' },
  { id: 'barba-sencilla', name: 'Barba Sencilla', category: 'Barbería', duration: 20, price: 7000, description: 'Arreglo y perfilado de barba con máquina y/o tijera para mantener la forma y longitud deseadas.' },
  { id: 'barba-toalla-caliente', name: 'Barba con Toalla Caliente', category: 'Barbería', duration: 40, price: 18000, description: 'Experiencia completa de afeitado o arreglo de barba con toallas calientes, aceites esenciales y masaje facial.' },
  { id: 'barba-vapor-ozono', name: 'Barba con Vapor de Ozono', category: 'Barbería', duration: 45, price: 22000, description: 'Un tratamiento premium que utiliza vapor de ozono para abrir los poros, ablandar el vello y purificar la piel.' },
  { id: 'color-global', name: 'Color Global', category: 'Color', duration: 90, price: 30000, description: 'Aplicación de un solo tono en todo el cabello para un cambio de look completo o para cubrir canas.' },
  { id: 'visos', name: 'Visos', category: 'Color', duration: 120, price: 45000, description: 'Iluminaciones sutiles en el cabello para dar luz y dimensión, creando un efecto natural y luminoso.' },
  { id: 'limpieza-facial', name: 'Limpieza Facial', category: 'Tratamientos', duration: 50, price: 25000, description: 'Tratamiento de limpieza profunda para eliminar impurezas, puntos negros y células muertas. Incluye exfoliación y mascarilla.' },
  { id: 'masaje-capilar', name: 'Masaje Capilar', category: 'Tratamientos', duration: 20, price: 10000, description: 'Masaje relajante en el cuero cabelludo para estimular la circulación y promover un cabello saludable.' },
];

// --- DATOS DE ESTILISTAS ---

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
  {
    id: 'andres-leyton',
    name: 'Andres Leyton',
    bio: 'Andres es un estilista versátil con pasión por las últimas tendencias. Se destaca en la creación de looks personalizados que reflejan la personalidad de cada cliente.',
    avatarUrl: '/img/camilo.png', // Asignación temporal
    specialties: ['Corte y Estilo', 'Coloración Creativa', 'Tratamientos Capilares'],
    services: allServiceIds,
  },
];

// --- DATOS DESTACADOS PARA LA PÁGINA DE INICIO ---

export const featuredData: FeaturedData = {
    services: services.slice(0, 3),
    stylists: stylists.slice(0, 3), // Actualizado para mostrar a los 3 estilistas
};

// --- DATOS DE DISPONIBILIDAD (EJEMPLO) ---

export const availability: Availability[] = [
  { stylistId: 'stiven-vargas', dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
  { stylistId: 'stiven-vargas', dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
  { stylistId: 'stiven-vargas', dayOfWeek: 3, startTime: '09:00', endTime: '12:00' },
  { stylistId: 'stiven-vargas', dayOfWeek: 4, startTime: '14:00', endTime: '20:00' },
  { stylistId: 'stiven-vargas', dayOfWeek: 5, startTime: '09:00', endTime: '19:00' },
  { stylistId: 'kamilo-fonseca', dayOfWeek: 2, startTime: '10:00', endTime: '19:00' },
  { stylistId: 'kamilo-fonseca', dayOfWeek: 3, startTime: '10:00', endTime: '19:00' },
  { stylistId: 'kamilo-fonseca', dayOfWeek: 4, startTime: '10:00', endTime: '19:00' },
  { stylistId: 'kamilo-fonseca', dayOfWeek: 5, startTime: '11:00', endTime: '20:00' },
  { stylistId: 'kamilo-fonseca', dayOfWeek: 6, startTime: '10:00', endTime: '16:00' },
  { stylistId: 'andres-leyton', dayOfWeek: 1, startTime: '10:00', endTime: '19:00' }, // Disponibilidad de ejemplo
  { stylistId: 'andres-leyton', dayOfWeek: 2, startTime: '10:00', endTime: '19:00' },
  { stylistId: 'andres-leyton', dayOfWeek: 4, startTime: '10:00', endTime: '19:00' },
  { stylistId: 'andres-leyton', dayOfWeek: 5, startTime: '10:00', endTime: '20:00' },
];

// --- DATOS DE RESEÑAS (EJEMPLO) ---

export const reviews: Review[] = [
    { id: '1', author: 'Carlos M.', rating: 5, text: '¡El mejor corte que he tenido! Stiven es un artista.' },
    { id: '2', author: 'Javier R.', rating: 5, text: 'Kamilo es un profesional increíble. La experiencia de la toalla caliente fue espectacular.' },
    { id: '3', author: 'Ana G.', rating: 4, text: 'Buen servicio y ambiente agradable. Volveré.' },
    { id: '4', author: 'Luis F.', rating: 5, text: 'Siempre salgo satisfecho. Recomiendo 100% los diseños de barba.' },
];