
export interface ServiceCategory {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string; // Lo cambio a string para dar flexibilidad a las categorías
}

export interface Stylist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  services: string[]; // array of service IDs
}

export interface Booking {
  id: string;
  serviceId: string;
  stylistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  customerName: string;
  customerEmail: string;
  status: 'confirmed' | 'completed' | 'canceled';
  serviceName?: string;
  stylistName?: string;
  price?: number;
  createdAt?: any;
}

export interface Availability {
  stylistId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
}

export interface FeaturedData {
  services: Service[];
  stylists: Stylist[];
}
