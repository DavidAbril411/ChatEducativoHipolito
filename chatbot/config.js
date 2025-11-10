/**
 * Configuración central para el chatbot.
 *
 * El modelo se sirve siempre a través del backend Node/Express
 * que delega en Google Vertex AI (Gemini).
 *
 * Cómo usarlo:
 * 1. Exportá window.BACKEND_URL con la URL de tu servidor (Railway, etc.).
 * 2. Opcional: window.VERTEX_MODEL para cambiar el modelo sin tocar código.
 */

let LOCAL_OVERRIDE = {};
try {
	// eslint-disable-next-line no-undef
	if (typeof window !== 'undefined' && window.CONFIG_LOCAL) {
		LOCAL_OVERRIDE = window.CONFIG_LOCAL;
	}
} catch { }

const runtimeBackend = typeof window !== 'undefined' && window.BACKEND_URL ? window.BACKEND_URL : undefined;
const runtimeModel = typeof window !== 'undefined' && window.VERTEX_MODEL ? window.VERTEX_MODEL : undefined;

export const CONFIG = {
	MODELO: LOCAL_OVERRIDE.MODELO || runtimeModel || 'gemini-2.5-flash',
	BACKEND_URL: runtimeBackend || LOCAL_OVERRIDE.BACKEND_URL || '',
	USE_BACKEND: true
};
