# 🎓 Chat Educativo con IA - Hipólito

## 🚀 Configuración Rápida (5 minutos)

### Paso 1: Conseguir API Key GRATIS de Groq

1. **Andá a**: https://console.groq.com
2. **Creá una cuenta** (solo email, sin tarjeta)
3. **Ve a "API Keys"** en el menú izquierdo
4. **Click en "Create API Key"**
5. **Copiá la key** (empieza con `gsk_...`)

### Paso 2: Configurar el proyecto (sin commitear secretos)

1. Abrí el archivo `config.js` (ya está preparado para NO incluir claves en el repo)
2. Cargá tu API key en tiempo de ejecución de una de estas formas:
	 - En consola del navegador (para pruebas):
		 ```js
		 localStorage.setItem('GROQ_API_KEY', 'gsk_TU_CLAVE_AQUI')
		 ```
	 - O definiendo una global antes de cargar el chat:
		 ```html
		 <script>
			 window.GROQ_API_KEY = 'gsk_TU_CLAVE_AQUI';
		 </script>
		 ```
	 - O creando `chatbot/config.local.js` (ignorado por git) e inyectando:
		 ```html
		 <script>
			 window.CONFIG_LOCAL = { GROQ_API_KEY: 'gsk_TU_CLAVE_AQUI' };
		 </script>
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

**⚠️ IMPORTANTE**: La API Key es privada. NO la subas a GitHub público. Este proyecto ya evita incluir la clave en el código fuente.

Para producción, considerá mover llamadas a un backend propio o usar variables de entorno/secretos del entorno de despliegue.

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
