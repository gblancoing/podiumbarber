'use client';

import { updateBooking, deleteBooking, restoreBooking } from './actions';
import { toast } from 'sonner';

export async function handleBookingUpdate(bookingId: string, updates: any) {
  try {
    const success = await updateBooking(bookingId, updates);
    if (success) {
      toast.success('Reserva actualizada exitosamente');
    } else {
      toast.error('Error al actualizar la reserva');
    }
    return success;
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    toast.error('Error al actualizar la reserva');
    return false;
  }
}

export async function handleBookingDelete(bookingId: string) {
  try {
    const success = await deleteBooking(bookingId);
    if (success) {
      toast.success('Reserva eliminada exitosamente');
    } else {
      toast.error('Error al eliminar la reserva');
    }
    return success;
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    toast.error('Error al eliminar la reserva');
    return false;
  }
}

export async function handleBookingRestore(bookingId: string) {
  try {
    const success = await restoreBooking(bookingId);
    if (success) {
      toast.success('Reserva restaurada exitosamente');
    } else {
      toast.error('Error al restaurar la reserva');
    }
    return success;
  } catch (error) {
    console.error('Error al restaurar reserva:', error);
    toast.error('Error al restaurar la reserva');
    return false;
  }
}
