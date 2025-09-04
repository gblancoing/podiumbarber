export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: 'Cutting & Styling' | 'Coloring' | 'Treatments' | 'Other';
}

export interface Stylist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  specialties: string[];
  services: string[]; // array of service IDs
}
