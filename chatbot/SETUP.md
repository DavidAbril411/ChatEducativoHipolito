# 🎓 Chat Educativo con IA - Hipólito

## 🚀 Configuración Rápida (5 minutos)

### Paso 1: Configurar el backend (Node + Vertex)

1. Crea/descarga una **cuenta de servicio** en Google Cloud con el rol `Vertex AI User` o `Generative AI User`.
2. Asegurate de habilitar la **Vertex AI API (Generative Language)** en el proyecto.
3. Despliega el backend (`server/server.js`) en tu hosting preferido (Railway, Render, etc.).
4. Define una variable de entorno `VERTEX_SERVICE_ACCOUNT` con el JSON completo de la cuenta de servicio.
   - Alternativa: sube el JSON al servidor y apunta `GOOGLE_APPLICATION_CREDENTIALS` al archivo.
5. Opcional: ajusta `VERTEX_MODEL` (por defecto `gemini-2.5-flash`) o `PORT`.

### Paso 2: Configurar el frontend

1. Abrí `chatbot/config.js` (no necesitas tocarlo para producción).
2. Inyectá en tiempo de ejecución la URL del backend, por ejemplo en tu HTML antes de importar los scripts:
   ```html
   <script>
     window.BACKEND_URL = "https://tu-backend.onrender.com";
     window.VERTEX_MODEL = "gemini-2.5-flash"; // opcional
   </script>
   ```
3. Carga `chat-maestra.html` en tu navegador o integrala en tu sitio.

### Paso 3: Prueba rápida

1. Visita `<tu-backend>/api/health` y verificá que muestre `provider: "vertex"` y `hasCredentials: true`.
2. Abrí `chat-maestra.html`, abre la consola y confirmá que la conexión indique _"Consultando a la IA (Vertex)..."_.

---

## ✨ Características

- ✅ **IA real** a través de Google Vertex AI (Gemini Flash)
- ✅ **Sin exponer claves** en el navegador (todo pasa por el backend)
- ✅ **Entiende contexto** de la conversación
- ✅ **No repite preguntas**
- ✅ **Respuestas naturales** y educativas
- ✅ **Fallback inteligente** si la API falla

---

## 🎯 Modelos disponibles

Define la variable de entorno `VERTEX_MODEL` o `window.VERTEX_MODEL` para personalizar el modelo de Vertex. Recomendados:

- `gemini-2.5-flash` ⚡ rápido y económico
- `gemini-2.0-flash-exp` 🧠 más contexto
- `gemini-1.5-pro-latest` 🧠 si necesitas razonamiento profundo

---

## 🔒 Seguridad

- Nunca expongas el JSON de la cuenta de servicio en el cliente.
- Usa variables de entorno o el gestor de secretos de tu proveedor (Railway Secrets, etc.).
- Mantén restringidas las credenciales al proyecto de Vertex que usas.

---

## 🆘 Problemas comunes

### 403 "Insufficient authentication scopes"

- Confirmá que la cuenta de servicio tiene el rol `Vertex AI User` (o `Generative AI User`).
- Revisá que la API **Vertex AI API** esté habilitada.

### 401 "Request is missing required authentication credential"

- Verificá que `VERTEX_SERVICE_ACCOUNT` esté bien formateado (JSON válido).
- Si usás `GOOGLE_APPLICATION_CREDENTIALS`, chequeá la ruta en el servidor.

### La IA no responde

- Asegurate de que `window.BACKEND_URL` apunte al dominio correcto.
- Revisá los logs del backend para más detalles (se registran los errores de Vertex).

---

## 📚 Más info

- Vertex AI Generative Language API: https://cloud.google.com/vertex-ai/generative-ai/docs
- Precios y cuotas: https://cloud.google.com/vertex-ai/pricing
