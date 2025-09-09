
"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { services, stylists } from "@/lib/data"; 
import { getAvailableTimeSlots } from "@/lib/client-data"; 
import type { Service, Stylist } from "@/lib/types";
import { ArrowLeft, ArrowRight, CheckCircle, Calendar as CalendarIcon, User, Scissors, Clock, Loader2, Mail } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { saveBooking } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Esquema de validación para el formulario de detalles del cliente.
const bookingFormSchema = z.object({
    customerName: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    customerEmail: z.string().email("Por favor, introduce un correo electrónico válido."),
});

// Definición de los pasos del proceso de reserva.
type Step = "service" | "stylist" | "datetime" | "details" | "confirm" | "complete";

// Traducciones para mostrar el paso actual al usuario.
const stepTranslations: Record<Step, string> = {
    service: "Servicio",
    stylist: "Estilista",
    datetime: "Fecha y Hora",
    details: "Tus Datos",
    confirm: "Confirmar",
    complete: "Completo",
};

export function BookingClient() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("service");
  
  // --- Estados para la Selección del Usuario ---
  const [selectedService, setSelectedService] = useState<Service | null>(() => {
    const serviceId = searchParams.get("service");
    return services.find(s => s.id === serviceId) || null;
  });

  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(() => {
    const stylistId = searchParams.get("stylist");
    // FIX: Se realiza una búsqueda segura en el array de estilistas.
    return stylists.find(s => s.id === stylistId) || null;
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // --- Formulario para los detalles del cliente ---
  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { customerName: "", customerEmail: "" },
  });

  // --- Lógica de Navegación y Efectos ---

  useEffect(() => {
    // Navega automáticamente al paso correcto si hay preselecciones en la URL.
    if (selectedService && selectedStylist) setStep("datetime");
    else if (selectedService) setStep("stylist");
  }, [selectedService, selectedStylist]);

  // Filtra los estilistas disponibles basándose en el servicio seleccionado.
  const availableStylists = useMemo(() => {
      if (!selectedService) return stylists;
      // FIX: Se asegura de que la propiedad `services` exista en `stylist` antes de filtrar.
      return stylists.filter(stylist => stylist.services?.includes(selectedService.id));
  }, [selectedService]);

  // Filtra los servicios disponibles basándose en el estilista seleccionado.
  const availableServices = useMemo(() => {
      if (!selectedStylist) return services;
      // FIX: Se asegura de que la propiedad `services` exista en `selectedStylist`.
      return services.filter(service => selectedStylist.services?.includes(service.id));
  }, [selectedStylist]);

  // Carga los horarios disponibles cuando se selecciona un estilista y una fecha.
  useEffect(() => {
    if (selectedDate && selectedStylist) {
        setIsLoadingTimes(true);
        setAvailableTimeSlots([]);
        setSelectedTime(null);

        const fetchTimes = async () => {
            try {
                const slots = await getAvailableTimeSlots(selectedDate, selectedStylist!.id);
                setAvailableTimeSlots(slots);
            } catch (error) {
                console.error("Fallo al cargar los horarios:", error);
                toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los horarios." });
            } finally {
                setIsLoadingTimes(false);
            }
        };
        fetchTimes();
    }
  }, [selectedDate, selectedStylist, toast]);

  // --- Handlers de Acciones del Usuario ---

  const handleNextStep = () => {
    const steps: Step[] = ["service", "stylist", "datetime", "details", "confirm"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
        setStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const steps: Step[] = ["complete", "confirm", "details", "datetime", "stylist", "service"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
        setStep(steps[currentIndex + 1]);
    }
  };

  const onDetailsSubmit = () => handleNextStep();

  const handleConfirmBooking = () => {
    const { customerName, customerEmail } = form.getValues();
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime || !customerName || !customerEmail) return;
    
    startTransition(async () => {
      const bookingInput = {
        serviceId: selectedService.id,
        stylistId: selectedStylist.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        customerName,
        customerEmail,
      };
      
      const result = await saveBooking(bookingInput);

      if (result.success && result.bookingId) {
        setBookingId(result.bookingId);
        setStep("complete");
      } else {
        toast({
            variant: "destructive",
            title: "Error al Reservar",
            description: result.error || "Ocurrió un error inesperado.",
        });
      }
    });
  };
  
  const handleStartOver = () => {
    setSelectedService(null);
    setSelectedStylist(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setBookingId(null);
    form.reset();
    setStep("service");
  };

  const progressValue = { service: 0, stylist: 20, datetime: 40, details: 60, confirm: 80, complete: 100 }[step];

  // --- Renderizado de Componentes ---

  const renderStep = () => {
    // ... (El resto del código de renderizado de pasos permanece igual)
      switch (step) {
      case "service":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">1. Selecciona un Servicio</h3>
            <Select onValueChange={(id) => setSelectedService(services.find(s => s.id === id) || null)}>
              <SelectTrigger><SelectValue placeholder="Elige un servicio..." /></SelectTrigger>
              <SelectContent>
                {availableServices.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - ${s.price.toLocaleString('es-CL')}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleNextStep} disabled={!selectedService} className="w-full">
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      case "stylist":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">2. Selecciona un Estilista</h3>
            <Select onValueChange={(id) => setSelectedStylist(stylists.find(s => s.id === id) || null)} defaultValue={selectedStylist?.id}>
              <SelectTrigger><SelectValue placeholder="Elige un estilista..." /></SelectTrigger>
              <SelectContent>
                {availableStylists.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex gap-4">
              <Button onClick={handlePrevStep} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
              </Button>
              <Button onClick={handleNextStep} disabled={!selectedStylist} className="w-full">
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case "datetime":
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">3. Selecciona Fecha y Hora</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1)) || date.getDay() === 0}
                className="rounded-md border justify-center"
                locale={es}
              />
              <div className="max-h-64 overflow-y-auto grid grid-cols-3 gap-2 content-start">
                {!selectedDate ? (
                  <p className="col-span-3 text-center text-muted-foreground p-4">Por favor, selecciona una fecha.</p>
                ) : isLoadingTimes ? (
                  <div className="col-span-3 flex justify-center items-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map(time => (
                    <Button key={time} variant={selectedTime === time ? "default" : "outline"} onClick={() => setSelectedTime(time)}>
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="col-span-3 text-center text-muted-foreground p-4">No hay horas disponibles.</p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handlePrevStep} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
              </Button>
              <Button onClick={handleNextStep} disabled={!selectedDate || !selectedTime} className="w-full">
                Siguiente <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
       case "details":
        return (
          <div className="space-y-4">
             <h3 className="text-xl font-semibold">4. Ingresa tus Datos</h3>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-4">
                    <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre Completo</FormLabel>
                            <FormControl><Input placeholder="Ej: Jane Doe" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="customerEmail" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Correo Electrónico</FormLabel>
                            <FormControl><Input type="email" placeholder="tu@correo.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <div className="flex gap-4 pt-4">
                        <Button onClick={handlePrevStep} variant="outline" className="w-full" type="button"><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
                        <Button type="submit" className="w-full">Siguiente <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                </form>
             </Form>
          </div>
        );
      case "confirm":
        const { customerName, customerEmail } = form.getValues();
        if (!selectedService || !selectedStylist || !selectedDate || !selectedTime || !customerName) return null;
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">5. Confirma tu Cita</h3>
            <div className="border rounded-lg p-4 space-y-4">
               <div className="flex items-start gap-4">
                <Image src={selectedStylist.avatarUrl || ''} alt={selectedStylist.name} width={80} height={80} className="rounded-full bg-muted" />
                <div>
                  <p className="font-bold">{selectedStylist.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedService.name}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {customerName}</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {customerEmail}</p>
                <p className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" /> {format(selectedDate, "PPP", { locale: es })}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {selectedTime}</p>
                <p className="flex items-center gap-2"><Scissors className="h-4 w-4 text-primary" /> {selectedService.duration} minutos</p>
              </div>
              <div className="text-right font-bold text-lg">
                Total: ${selectedService.price.toLocaleString('es-CL')}
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handlePrevStep} variant="outline" className="w-full" disabled={isPending}><ArrowLeft className="mr-2 h-4 w-4" /> Atrás</Button>
              <Button onClick={handleConfirmBooking} className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Reserva
              </Button>
            </div>
          </div>
        );
      case "complete":
        if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) return null;
        return (
          <div className="text-center space-y-4 animate-in fade-in duration-500">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500"/>
            <h3 className="text-2xl font-bold">¡Cita Confirmada!</h3>
            <p className="text-muted-foreground">ID de Reserva: {bookingId}</p>
            <Card className="text-left p-4">
              <p><strong>Estilista:</strong> {selectedStylist.name}</p>
              <p><strong>Servicio:</strong> {selectedService.name}</p>
              <p><strong>Fecha:</strong> {format(selectedDate, "PPP", { locale: es })} a las {selectedTime}</p>
            </Card>
            <Button onClick={handleStartOver} className="w-full">Reservar Otra Cita</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Progreso de la Reserva</span>
          <span className="text-sm font-normal text-muted-foreground">{stepTranslations[step]}</span>
        </CardTitle>
        <Progress value={progressValue} className="w-full" />
      </CardHeader>
      <CardContent className="min-h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
