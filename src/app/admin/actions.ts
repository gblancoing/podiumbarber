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

export async function restoreBooking(bookingId: string) {
  try {
    if (!db) {
      throw new Error('Base de datos no disponible');
    }

    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'confirmed',
      deletedAt: null,
      deletedBy: null,
      restoredAt: new Date(),
      restoredBy: 'admin'
    });

    toast.success('Reserva restaurada exitosamente');
    return true;
  } catch (error) {
    console.error('Error al restaurar reserva:', error);
    toast.error('Error al restaurar la reserva');
    return false;
  }
}
