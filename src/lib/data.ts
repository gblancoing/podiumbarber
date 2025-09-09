'use client';

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
    id: 'corte-diseno', // FIX: Corregido el typo de 'disemo' a 'diseno' para consistencia.
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
    description: 'Define y da forma a tus cejas para una mirada más limpia y definida.',
    price: 5000,
    duration: 10,
    category: 'Otros Servicios',
  },
  {
    id: 'limpieza-facial',
    name: 'Limpieza Facial',
    description: 'Tratamiento completo para purificar y revitalizar la piel del rostro.',
    price: 18000,
    duration: 30,
    category: 'Otros Servicios',
  },
];

// Lista de todos los estilistas disponibles
export const stylists: Stylist[] = [
  {
    id: 'andres-leyton',
    name: 'Andres Leyton',
    description: 'Especialista en cortes urbanos y diseños.',
    availability: {
      lunes: ['10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'],
      martes: ['10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'],
      miércoles: ['10:00', '11:00', '12:00', '13:00'],
      jueves: [],
      viernes: ['10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00'],
      sábado: ['10:00', '11:00', '12:00', '13:00'],
    },
  },
  {
    id: 'brandon-muñoz',
    name: 'Brandon Muñoz',
    description: 'Experto en cortes clásicos y barbería tradicional.',
    availability: {
      lunes: ['10:30', '11:30', '12:30', '13:30', '15:30', '16:30', '17:30', '18:30'],
      martes: ['10:30', '11:30', '12:30', '13:30', '15:30', '16:30', '17:30', '18:30'],
      miércoles: [],
      jueves: ['10:30', '11:30', '12:30', '13:30', '15:30', '16:30', '17:30', '18:30'],
      viernes: ['10:30', '11:30', '12:30', '13:30', '15:30', '16:30', '17:30', '18:30'],
      sábado: ['10:30', '11:30', '12:30', '13:30'],
    },
  },
];
