'use client';

import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';

export async function updateBooking(bookingId: string, updates: any) {
  try {
    if (!db) {
      throw new Error('Base de datos no disponible');
    }

    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      ...updates,
      updatedAt: new Date()
    });

    toast.success('Reserva actualizada exitosamente');
    return true;
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    toast.error('Error al actualizar la reserva');
    return false;
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    if (!db) {
      throw new Error('Base de datos no disponible');
    }

    const bookingRef = doc(db, 'bookings', bookingId);
    await deleteDoc(bookingRef);

    toast.success('Reserva eliminada exitosamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    toast.error('Error al eliminar la reserva');
    return false;
  }
}
