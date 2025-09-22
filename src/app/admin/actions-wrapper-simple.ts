'use client';

import { updateBookingSimple, deleteBookingSimple } from './actions-simple';
import { toast } from 'sonner';

export async function handleBookingUpdateSimple(bookingId: string, updates: any) {
  console.log('=== WRAPPER UPDATE ===');
  console.log('bookingId:', bookingId);
  console.log('updates:', updates);
  
  try {
    const result = await updateBookingSimple(bookingId, updates);
    console.log('Result from server:', result);
    
    if (result.success) {
      toast.success('Reserva actualizada exitosamente');
      return true;
    } else {
      toast.error(`Error al actualizar la reserva: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.error('Wrapper error:', error);
    toast.error('Error al actualizar la reserva');
    return false;
  }
}

export async function handleBookingDeleteSimple(bookingId: string) {
  console.log('=== WRAPPER DELETE ===');
  console.log('bookingId:', bookingId);
  
  try {
    const result = await deleteBookingSimple(bookingId);
    console.log('Result from server:', result);
    
    if (result.success) {
      toast.success('Reserva eliminada exitosamente');
      return true;
    } else {
      toast.error(`Error al eliminar la reserva: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.error('Wrapper error:', error);
    toast.error('Error al eliminar la reserva');
    return false;
  }
}
