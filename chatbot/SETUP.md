# 🎓 Chat Educativo con IA - Hipólito

## 🚀 Configuración Rápida (5 minutos)

### Paso 1: Conseguir API Key GRATIS de Groq

1. **Andá a**: https://console.groq.com
2. **Creá una cuenta** (solo email, sin tarjeta)
3. **Ve a "API Keys"** en el menú izquierdo
4. **Click en "Create API Key"**
5. **Copiá la key** (empieza con `gsk_...`)

### Paso 2: Configurar el proyecto

1. Abrí el archivo `config.js`
2. Pegá tu API key:
```javascript
export const CONFIG = {
	GROQ_API_KEY: 'gsk_TU_CLAVE_AQUI', // 👈 Pegá acá
	MODELO: 'llama-3.1-8b-instant'
};
```

### Paso 3: ¡Listo!

Abrí `chat-maestra.html` en tu navegador y empezá a chatear.

---

## ✨ Características

- ✅ **IA real** usando Llama 3.1 (excelente en español)
- ✅ **100% GRATIS** (30 requests/minuto)
- ✅ **Entiende contexto** de la conversación
- ✅ **No repite preguntas**
- ✅ **Respuestas naturales** y educativas
- ✅ **Fallback inteligente** si la API falla

---

## 🎯 Modelos disponibles

En `config.js` podés elegir:

- `llama-3.1-8b-instant` ⚡ Rápido (recomendado)
- `llama-3.1-70b-versatile` 🧠 Más inteligente (más lento)
- `gemma2-9b-it` 💡 Alternativa rápida

---

## 🔒 Seguridad

**⚠️ IMPORTANTE**: La API Key es privada. NO la subas a GitHub público.

Para producción, movela a variables de entorno o backend.

---

## 🆘 Problemas comunes

### "API Key inválida"
- Revisá que copiaste bien la key completa
- Asegurate que empiece con `gsk_`

### "CORS error"
- La API de Groq permite CORS desde navegador
- Si hay problemas, probá desde un servidor local

### La IA no responde
- Verificá tu conexión a internet
- El fallback inteligente se activa automáticamente

---

## 📚 Más info

- Docs de Groq: https://console.groq.com/docs
- Límites gratuitos: 30 req/min, 14,400 req/día
