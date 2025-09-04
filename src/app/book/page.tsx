import { BookingClient } from "./BookingClient";
import { CalendarCheck } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function BookingSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
}

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
      <Suspense fallback={<BookingSkeleton />}>
        <BookingClient />
      </Suspense>
    </div>
  );
}
