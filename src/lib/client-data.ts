import { db } from './firebase';
import { collection, getDocs, query, where } from "firebase/firestore";

export const getAvailableTimeSlots = async (date: Date, stylistId: string): Promise<string[]> => {
  const allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30',
  ];

  // Reglas de negocio (Domingos cerrados, Sábados horario corto)
  if (date.getDay() === 0) return []; // Domingo
  if (date.getDay() === 6) {
    const sabadoSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'
    ];
    return sabadoSlots;
  }


  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  try {
    const q = query(
      collection(db, "reservations"), 
      where("stylistId", "==", stylistId), 
      where("date", "==", dateString)
    );
    
    const querySnapshot = await getDocs(q);
    const bookedTimes = new Set(querySnapshot.docs.map(doc => doc.data().time));

    const availableSlots = allSlots.filter(time => !bookedTimes.has(time));
    return availableSlots;

  } catch (error) {
    console.error("Error fetching available time slots from Firebase:", error);
    throw new Error("Failed to fetch availability.");
  }
};
