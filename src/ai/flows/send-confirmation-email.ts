'use server';
/**
 * @fileOverview Generates a confirmation email for a booking.
 *
 * - sendConfirmationEmail - A function that generates a confirmation email.
 * - SendConfirmationEmailInput - The input type for the sendConfirmationEmail function.
 * - SendConfirmationEmailOutput - The return type for the sendConfirmationEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { stylists, services } from '@/lib/data';

const SendConfirmationEmailInputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  customerEmail: z.string().describe('The email of the customer.'),
  date: z.string().describe('The date of the appointment (e.g., 2024-12-25).'),
  time: z.string().describe('The time of the appointment (e.g., 14:30).'),
  stylistId: z.string().describe('The ID of the stylist.'),
  serviceId: z.string().describe('The ID of the service.'),
});
export type SendConfirmationEmailInput = z.infer<
  typeof SendConfirmationEmailInputSchema
>;

const SendConfirmationEmailOutputSchema = z.object({
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The HTML body of the email.'),
});
export type SendConfirmationEmailOutput = z.infer<
  typeof SendConfirmationEmailOutputSchema
>;

export async function sendConfirmationEmail(
  input: SendConfirmationEmailInput
): Promise<SendConfirmationEmailOutput> {
  // Get stylist and service names to pass to the prompt
  const stylistName =
    stylists.find(s => s.id === input.stylistId)?.name || 'Estilista';
  const serviceName =
    services.find(s => s.id === input.serviceId)?.name || 'Servicio';

  // MODIFICACIÓN: Formatear la fecha a un formato más amigable para el correo
  // La fecha viene como 'YYYY-MM-DD'. la convertimos a un objeto Date.
  // Es importante añadir 'timeZone: 'UTC'' para evitar que la fecha cambie por el huso horario del servidor.
  const dateObject = new Date(`${input.date}T00:00:00Z`);
  const friendlyDate = dateObject.toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return sendConfirmationEmailFlow({
    ...input,
    date: friendlyDate, // Usamos la fecha formateada
    stylistName,
    serviceName,
  });
}

const prompt = ai.definePrompt({
  name: 'sendConfirmationEmailPrompt',
  input: {
    schema: SendConfirmationEmailInputSchema.extend({
      stylistName: z.string(),
      serviceName: z.string(),
    }),
  },
  output: { schema: SendConfirmationEmailOutputSchema },
  // MODIFICACIÓN: Se clarifica al prompt que la fecha ya viene formateada.
  prompt: `You are an assistant for the "PodiumBarber" hair salon. Your task is to generate a friendly and professional confirmation email in Spanish for a new appointment.

Appointment Details:
- Customer Name: {{{customerName}}}
- Date: {{{date}}}
- Time: {{{time}}}
- Stylist: {{{stylistName}}}
- Service: {{{serviceName}}}

Generate a subject and an HTML body for the email. The email should confirm the details, mention the salon\'s name, and have a warm and welcoming tone. The \'Date\' field is already formatted in a user-friendly way, so you must include it exactly as it is provided. Do not include any placeholder for address or phone number.`,
});

const sendConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'sendConfirmationEmailFlow',
    inputSchema: SendConfirmationEmailInputSchema.extend({
      stylistName: z.string(),
      serviceName: z.string(),
    }),
    outputSchema: SendConfirmationEmailOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
