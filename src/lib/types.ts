export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: 'Corte y Peinado' | 'Barba' | 'Facial';
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

  // Denormalized data for easier querying and display
  serviceName?: string;
  stylistName?: string;
  price?: number;
  createdAt?: any; // To support serverTimestamp
}
