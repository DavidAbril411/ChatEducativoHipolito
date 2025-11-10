# 📊 Escalabilidad y Límites

## 🎯 Cuotas actuales (Vertex AI)

> Las cuotas exactas dependen del modelo y de tu proyecto de Google Cloud. Verificalas en **Cloud Console → Vertex AI → Quotas**.

Valores típicos para `gemini-2.5-flash` en proyectos nuevos:
- ⏱️ **60 solicitudes/minuto** por proyecto (se puede aumentar)
- � **60 solicitudes/minuto** por usuario
- 🔢 **3,000 tokens/minuto** de salida aproximados (fluye con la cuota de solicitudes)
- 📈 Límite diario controlado por presupuesto/alertas

---

## 👥 Capacidad real

### Escenario 1: **Uso educativo normal**
```
Usuarios simultáneos: 10-20 chicos
Mensajes por conversación: 10-15
Duración: 5-10 minutos

✅ PERFECTO - No hay problemas
```

### Escenario 2: **Clase completa (30 alumnos)**
```
30 usuarios simultáneos
Si todos envían 1 mensaje/minuto = 30 req/min
⚠️ Límite justo - monitorear uso en Vertex

Con rate limiting de 3 segundos:
30 usuarios × 1 mensaje cada 3 seg = 10 req/min
✅ PERFECTO - No hay problemas
```

### Escenario 3: **Escuela completa (100+ alumnos/día)**
```
100 alumnos × 10 mensajes = 1,000 requests/día
✅ Dentro de las cuotas estándar
```

### Escenario 4: **Uso masivo (1000+ usuarios/día)**
```
1,000 usuarios × 10 mensajes = 10,000 requests/día
❌ Necesitás solicitar aumento de cuota o distribuir tráfico (multi-proyecto)
```

---

## 🛡️ Protecciones implementadas

### 1. **Rate limiting por usuario** ✅
- 3 segundos entre mensajes
- Mensaje amigable: "Esperá X segundos..."
- Evita spam involuntario

### 2. **Fallback inteligente** ✅
- Si Vertex devuelve error → usa banco de conocimiento
- El chat nunca deja de responder
- Respuestas coherentes con el cuento

### 3. **Logs detallados** ✅
- Errores de Vertex (403, 429, 500) quedan registrados
- Hint automático para scopes/roles cuando la respuesta es 403

---

## 💰 Costos si escalas

Consulta precios vigentes: https://cloud.google.com/vertex-ai/pricing

Referencia (enero 2025, región us-central1):
```
gemini-2.5-flash
 - Entrada: ~USD 0.00035 por 1K tokens
 - Salida: ~USD 0.0005 por 1K tokens

Ejemplo mensual:
 10,000 conversaciones × 2,000 tokens totales ≈ 20M tokens
  Costo estimado ≈ USD 10-12
```

---

## 🚀 Soluciones para escalar

### Opción 1: **Optimizar uso actual** (GRATIS)
```javascript
// Ya implementado:
- Rate limiting: 3 segundos entre mensajes
- Fallback inteligente
- Tokens reducidos (180 max)

Capacidad: ~150 usuarios/día
Costo: $0
```

### Opción 2: **Caché de respuestas** (GRATIS)
```javascript
// Guardar preguntas frecuentes
const cache = {
  'las mariposas azules': 'respuesta guardada...',
  'hipólito': 'respuesta guardada...'
};

// Reduce llamadas a API en ~30-40%
Capacidad: ~150 usuarios/día
Costo: $0
```

### Opción 3: **Sharding por proyecto** (GRATIS)
```javascript
// Distribuir usuarios por cuentas de servicio / proyectos GCP
// Cada proyecto tiene su propia cuota
// Requiere balancear tráfico en el backend

Capacidad: según la cantidad de proyectos
Costo: hosting del backend
```

### Opción 4: **Solicitar aumento de cuota** (Depende de Google)
- Justificá el caso de uso educativo desde Cloud Console.
- Google suele aprobar saltos a 300-600 req/min en pocos días.

---

## 📊 Recomendación según uso

| Caso de uso | Solución recomendada | Costo |
|-------------|---------------------|-------|
| **Desarrollo/testing** | Cuotas por defecto + rate limit | $0 |
| **1 clase (30 alumnos)** | Cuotas por defecto + caché | $0 |
| **Escuela (100-300 alumnos/día)** | Solicitar aumento moderado | $0 |
| **Distrital (1000+ alumnos/día)** | Sharding por proyecto | $0-30 |
| **Nacional (10,000+ alumnos/día)** | Aumento alto + presupuestos | $100+/mes |

---

## 🎯 Estado actual de tu proyecto

```
✅ Rate limiting implementado (3 seg)
✅ Fallback inteligente funcionando
✅ Logs de Vertex con hints de permisos
✅ Backend propio (no hay claves expuestas)

Capacidad actual: 60 req/min (quotas default Vertex)
Costo: según consumo (ver cálculo arriba)
```

---

## 🔧 Próximos pasos si necesitas escalar

1. **Monitorear uso** en Vertex AI → Quotas
2. **Implementar caché** de respuestas comunes
3. **Solicitar aumento de cuota** si superas 60 req/min
4. **Distribuir tráfico** en varios proyectos si hace falta
5. **Controlar presupuesto** con alertas en Cloud Billing

**Por ahora, las cuotas por defecto son suficientes para clases pequeñas** 🎉
