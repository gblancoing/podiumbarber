'use server';

import { db } from '../../lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

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

    revalidatePath('/admin/bookings');
    revalidatePath('/admin/completed');
    revalidatePath('/admin/deleted');
    return true;
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    return false;
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    if (!db) {
      throw new Error('Base de datos no disponible');
    }

    const bookingRef = doc(db, 'bookings', bookingId);
    // Soft delete: cambiar estado a 'deleted' en lugar de eliminar físicamente
    await updateDoc(bookingRef, {
      status: 'deleted',
      deletedAt: new Date(),
      deletedBy: 'admin' // Podrías obtener el usuario actual aquí
    });

    revalidatePath('/admin/bookings');
    revalidatePath('/admin/completed');
    revalidatePath('/admin/deleted');
    return true;
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
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

    revalidatePath('/admin/bookings');
    revalidatePath('/admin/completed');
    revalidatePath('/admin/deleted');
    return true;
  } catch (error) {
    console.error('Error al restaurar reserva:', error);
    return false;
  }
}
