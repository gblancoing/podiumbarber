import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { DeletedBookings } from "../dashboard/DeletedBookings";

export default async function DeletedBookingsPage() {
  let bookings = [];

  try {
    if (db) {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('status', '==', 'deleted'),
        orderBy('deletedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
  } catch (error) {
    console.error('Error fetching deleted bookings:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reservas Eliminadas</h1>
        <p className="text-muted-foreground">
          Aquí están las reservas que han sido eliminadas del sistema.
        </p>
      </div>
      
      <DeletedBookings bookings={bookings} />
    </div>
  );
}
