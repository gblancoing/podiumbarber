'use server';
import { aiPoweredStyleAdvisor, AIPoweredStyleAdvisorInput } from '@/ai/flows/ai-powered-style-advisor';

export async function getStyleAdvice(input: AIPoweredStyleAdvisorInput) {
    try {
        const result = await aiPoweredStyleAdvisor(input);
        return { success: true, data: result };
    } catch (error: unknown) {
        console.error('AI Style Advisor Error:', error);

        let errorMessage = 'No se pudo obtener el consejo de estilo. Por favor, inténtalo de nuevo más tarde.';

        if (error instanceof Error) {
            // Accedemos a 'cause' de forma segura
            const cause = (error as { cause?: { message?: string } })?.cause?.message;
            errorMessage = cause || error.message;
        }

        return { success: false, error: `Error de la IA: ${errorMessage}` };
    }
}
