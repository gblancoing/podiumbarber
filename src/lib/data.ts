import type { Stylist, Service } from './types';

export const services: Service[] = [
  {
    id: 'cut-style',
    name: 'Haircut & Style',
    description: 'A customized haircut followed by a professional styling session.',
    price: 75,
    duration: 60,
    category: 'Cutting & Styling',
  },
  {
    id: 'balayage',
    name: 'Balayage',
    description: 'A technique for highlighting hair in which the dye is painted on in such a way as to create a graduated, natural-looking effect.',
    price: 250,
    duration: 180,
    category: 'Coloring',
  },
  {
    id: 'full-color',
    name: 'Full Color',
    description: 'A single process color application from roots to ends.',
    price: 120,
    duration: 120,
    category: 'Coloring',
  },
  {
    id: 'keratin',
    name: 'Keratin Treatment',
    description: 'A smoothing treatment that seals the hair cuticle with a coating of protein that eliminates frizz.',
    price: 300,
    duration: 210,
    category: 'Treatments',
  },
  {
    id: 'blowout',
    name: 'Signature Blowout',
    description: 'Get a voluminous and sleek blowout that lasts for days.',
    price: 50,
    duration: 45,
    category: 'Cutting & Styling',
  },
  {
    id: 'updo',
    name: 'Special Occasion Updo',
    description: 'An elegant hairstyle for weddings, proms, or any special event.',
    price: 95,
    duration: 75,
    category: 'Cutting & Styling',
  },
];

export const stylists: Stylist[] = [
  {
    id: 'alex',
    name: 'Alex Johnson',
    bio: 'With over 10 years of experience, Alex specializes in creative color and modern cutting techniques. Alex believes in creating personalized looks that enhance natural beauty.',
    avatarUrl: 'https://picsum.photos/400/400?random=1',
    specialties: ['Creative Color', 'Balayage', 'Modern Cuts'],
    services: ['cut-style', 'balayage', 'full-color'],
  },
  {
    id: 'bella',
    name: 'Bella Chen',
    bio: 'Bella is a master of precision cutting and elegant styling. Her passion is making clients feel confident and beautiful with a look that is both timeless and contemporary.',
    avatarUrl: 'https://picsum.photos/400/400?random=2',
    specialties: ['Precision Cuts', 'Blowouts', 'Updos'],
    services: ['cut-style', 'blowout', 'updo'],
  },
  {
    id: 'charlie',
    name: 'Charlie Davis',
    bio: 'Charlie loves transforming hair through texture and treatments. Specializing in keratin and smoothing treatments, Charlie can tame any frizz and add luxurious shine.',
    avatarUrl: 'https://picsum.photos/400/400?random=3',
    specialties: ['Keratin Treatments', 'Hair Repair', 'Long Hair'],
    services: ['keratin', 'cut-style'],
  },
  {
    id: 'dana',
    name: 'Dana Rodriguez',
    bio: 'Dana is an expert in all things color. From subtle highlights to bold, vibrant hues, Dana works with each client to find the perfect shade to match their personality and style.',
    avatarUrl: 'https://picsum.photos/400/400?random=4',
    specialties: ['Vibrant Colors', 'Color Correction', 'Highlights'],
    services: ['balayage', 'full-color', 'cut-style'],
  },
];

export const featuredServices = services.slice(0, 3);
export const featuredStylists = stylists.slice(0, 4);

export const getAvailableTimeSlots = (date: Date, stylistId: string) => {
  // In a real app, this would query a database based on the stylist's schedule.
  // For now, we'll return a static list of times for any day.
  // We'll add some variability based on stylistId to simulate different schedules.
  const seed = stylistId.charCodeAt(0) + date.getDate();
  const allSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM'
  ];

  // Simple logic to make availability seem dynamic
  if (date.getDay() === 0) return []; // Closed on Sundays
  if (date.getDay() === 6) return allSlots.slice(0, 8); // Shorter hours on Saturdays

  return allSlots.filter((_, index) => (index + seed) % 3 !== 0); // Remove some slots randomly
};
