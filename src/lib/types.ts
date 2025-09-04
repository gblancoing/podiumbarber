export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: 'Corte y Peinado' | 'Coloración' | 'Tratamientos' | 'Otros';
}

export interface Stylist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  services: string[]; // array of service IDs
}
