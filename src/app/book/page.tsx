import { CalendarCheck } from "lucide-react";
import { BookingPageClient } from "./BookingPageClient";

export default function BookAppointmentPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
            <CalendarCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-headline font-bold mt-4">Reserva tu Cita</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Selecciona tu servicio, estilista y la hora deseada. Es así de simple.
        </p>
      </div>
      <BookingPageClient />
    </div>
  );
}
