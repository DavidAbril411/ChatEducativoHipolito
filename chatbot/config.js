let LOCAL_OVERRIDE = {};
try {
	if (typeof window !== 'undefined' && window.CONFIG_LOCAL) {
		LOCAL_OVERRIDE = window.CONFIG_LOCAL;
	}
} catch { }

const runtimeBackend = typeof window !== 'undefined' && window.BACKEND_URL !== undefined ? window.BACKEND_URL : undefined;
const runtimeModel = typeof window !== 'undefined' && window.GEMINI_MODEL ? window.GEMINI_MODEL : undefined;

export const CONFIG = {
	MODELO: LOCAL_OVERRIDE.MODELO || runtimeModel || 'gemini-2.5-flash-lite',
	BACKEND_URL: runtimeBackend !== undefined ? runtimeBackend : (LOCAL_OVERRIDE.BACKEND_URL || ''),
	USE_BACKEND: true
};
