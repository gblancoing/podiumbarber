'use server';
import { aiPoweredStyleAdvisor, AIPoweredStyleAdvisorInput } from '@/ai/flows/ai-powered-style-advisor';

export async function getStyleAdvice(input: AIPoweredStyleAdvisorInput) {
    try {
        const result = await aiPoweredStyleAdvisor(input);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('AI Style Advisor Error:', error);
        // Extraer un mensaje de error más útil si está disponible
        const errorMessage = error.cause?.message || error.message || 'No se pudo obtener el consejo de estilo. Por favor, inténtalo de nuevo más tarde.';
        return { success: false, error: `Error de la IA: ${errorMessage}` };
    }
}
