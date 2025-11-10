/**
 * Configuración de API Keys
 * 
 * INSTRUCCIONES PARA CONSEGUIR TU API KEY GRATIS:
 * 1. Andá a https://console.groq.com
 * 2. Creá una cuenta (es gratis)
 * 3. Ve a "API Keys" en el menú
 * 4. Creá una nueva API key
 * 5. Copiala y pegala abajo reemplazando 'TU_API_KEY_AQUI'
 * 
 * La API key es GRATIS y te da:
 * - 30 requests por minuto
 * - Acceso a Llama 3.1 (excelente en español)
 * - Sin tarjeta de crédito
 */

// Permitir override local (archivo no versionado) si existe
let LOCAL_OVERRIDE = {};
try {
	// En tiempo de build/browser, este import puede fallar si no existe
	// eslint-disable-next-line no-undef
	if (typeof window !== 'undefined' && window.CONFIG_LOCAL) {
		LOCAL_OVERRIDE = window.CONFIG_LOCAL;
	}
} catch { }

// También permitir usar una variable global o localStorage para no comitear secretos
const keyFromWindow = typeof window !== 'undefined' && window.GROQ_API_KEY ? window.GROQ_API_KEY : undefined;
const keyFromStorage = typeof window !== 'undefined' ? window.localStorage.getItem('GROQ_API_KEY') : undefined;

export const CONFIG = {
	// NUNCA comitees API keys. Dejalo vacío o como 'TU_API_KEY_AQUI' y cargalo en runtime:
	// window.GROQ_API_KEY = 'gsk_xxx'  // o localStorage.setItem('GROQ_API_KEY','gsk_xxx')
	GROQ_API_KEY: LOCAL_OVERRIDE.GROQ_API_KEY || keyFromWindow || keyFromStorage || 'TU_API_KEY_AQUI',

	// Modelo Llama 4 Scout - Última generación, excelente en español
	MODELO: LOCAL_OVERRIDE.MODELO || 'meta-llama/llama-4-scout-17b-16e-instruct',

	// Si definís un backend proxy (Node/Express en Railway), poné su URL base acá en runtime:
	// window.BACKEND_URL = 'https://tu-backend.up.railway.app'
	BACKEND_URL: typeof window !== 'undefined' && window.BACKEND_URL ? window.BACKEND_URL : (LOCAL_OVERRIDE.BACKEND_URL || '')
};
