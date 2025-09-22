'use server';

import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function updateBookingSimple(bookingId: string, updates: any) {
  console.log('=== SIMPLE UPDATE BOOKING ===');
  console.log('bookingId:', bookingId);
  console.log('updates:', updates);
  console.log('db exists:', !!db);
  
  try {
    if (!db) {
      console.error('Database not available');
      return { success: false, error: 'Database not available' };
    }

    console.log('Creating document reference...');
    const bookingRef = doc(db, 'bookings', bookingId);
    console.log('Document reference created:', bookingRef);
    
    console.log('Attempting update...');
    await updateDoc(bookingRef, {
      ...updates,
      updatedAt: new Date()
    });

    console.log('Update successful!');
    revalidatePath('/admin/bookings');
    revalidatePath('/admin/completed');
    revalidatePath('/admin/deleted');
    
    return { success: true, message: 'Update successful' };
  } catch (error) {
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return { success: false, error: error.message };
  }
}

export async function deleteBookingSimple(bookingId: string) {
  console.log('=== SIMPLE DELETE BOOKING ===');
  console.log('bookingId:', bookingId);
  console.log('db exists:', !!db);
  
  try {
    if (!db) {
      console.error('Database not available');
      return { success: false, error: 'Database not available' };
    }

    console.log('Creating document reference...');
    const bookingRef = doc(db, 'bookings', bookingId);
    console.log('Document reference created:', bookingRef);
    
    console.log('Attempting soft delete...');
    await updateDoc(bookingRef, {
      status: 'deleted',
      deletedAt: new Date(),
      deletedBy: 'admin'
    });

    console.log('Delete successful!');
    revalidatePath('/admin/bookings');
    revalidatePath('/admin/completed');
    revalidatePath('/admin/deleted');
    
    return { success: true, message: 'Delete successful' };
  } catch (error) {
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return { success: false, error: error.message };
  }
}
