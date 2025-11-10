/**
 * Motor de IA conversacional capaz de delegar en un backend proxy
 * (Vertex, Groq u otros proveedores) o en Groq directamente si se
 * proporciona una API key en el cliente. Por defecto intenta usar el
 * backend configurado para evitar exponer secretos en el navegador.
 */

export class IAConversacional {
	constructor(configuracion = {}) {
		this.config = {
			// API Key de Groq configurada desde config.js
			apiKey: configuracion.apiKey || 'TU_API_KEY_AQUI',
			// Modelo: Llama 4 Scout 17B - última generación, excelente comprensión del español
			modelo: configuracion.modelo || 'meta-llama/llama-4-scout-17b-16e-instruct',
			maximoHistorial: 5,
			maxTokens: 180,
			temperatura: 0.7,
			topP: 0.9,
			persona: 'Eres Valentina, una profesora entusiasta y cariñosa que enseña el cuento de Hipólito a niños. Respondes de forma natural y breve (2-3 oraciones). IMPORTANTE: Solo usas información REAL del cuento proporcionado, NUNCA inventes detalles. Si no sabes algo, pregunta diferente. Siempre haces UNA pregunta concreta al final. Nunca repitas preguntas.',
			...configuracion
		};

		this.listo = false;
	}

	async cargarModelo(onStatus) {
		if (this.listo) {
			return;
		}

		const informar = (mensaje) => {
			if (typeof onStatus === 'function') {
				onStatus(mensaje);
			}
		};

		informar('Conectando con la profesora virtual... ✨');

		try {
			// Si usamos backend proxy, no necesitamos API key del cliente
			const useBackend = this.config.backendUrl && this.config.backendUrl.length > 0;

			// Verificar que tenemos API key SOLO si NO usamos backend
			if (!useBackend && (!this.config.apiKey || this.config.apiKey === 'TU_API_KEY_AQUI')) {
				throw new Error('⚠️ Falta configurar la API Key de Groq. Conseguila gratis en https://console.groq.com');
			}

			// Test rápido de conexión
			await this.testConexion();

			this.listo = true;
			informar('¡Profesora virtual lista! ✅');
		} catch (error) {
			this.listo = false;
			informar('Error conectando: ' + error.message);
			throw error;
		}
	}

	async testConexion() {
		const useBackend = this.config.backendUrl && this.config.backendUrl.length > 0;
		const url = useBackend ? `${this.config.backendUrl.replace(/\/$/, '')}/api/health` : 'https://api.groq.com/openai/v1/models';
		const headers = useBackend ? { 'Content-Type': 'application/json' } : {
			'Authorization': `Bearer ${this.config.apiKey}`,
			'Content-Type': 'application/json'
		};
		const response = await fetch(url, {
			method: 'GET',
			headers
		});

		if (!response.ok) {
			throw new Error('API Key inválida o problema de conexión');
		}
	}

	async generarRespuesta({ historial = [], mensajeActual = '', contexto = '', emocion = 'curiosa', objetivo = 'profundizar la comprensión del cuento', intencion = 'conversacion', ultimaPregunta = null }) {
		if (!this.listo) {
			throw new Error('La IA no está lista. Llamá a cargarModelo() primero.');
		}

		// Construir mensajes para la API
		const mensajes = this.construirMensajes({ historial, mensajeActual, contexto, ultimaPregunta });

		const destino = this.config.backendUrl && this.config.backendUrl.length > 0
			? `backend proxy (${this.config.backendUrl})`
			: 'Groq API';
		console.log(`=== Llamando a ${destino} ===`);
		console.log('Mensajes:', JSON.stringify(mensajes, null, 2));

		try {
			const useBackend = this.config.backendUrl && this.config.backendUrl.length > 0;
			const url = useBackend ? `${this.config.backendUrl.replace(/\/$/, '')}/api/chat` : 'https://api.groq.com/openai/v1/chat/completions';
			const headers = useBackend ? { 'Content-Type': 'application/json' } : {
				'Authorization': `Bearer ${this.config.apiKey}`,
				'Content-Type': 'application/json'
			};
			const response = await fetch(url, {
				method: 'POST',
				headers,
				body: JSON.stringify({
					model: this.config.modelo,
					messages: mensajes,
					temperature: this.config.temperatura,
					max_tokens: this.config.maxTokens,
					top_p: this.config.topP,
					stream: false
				})
			});

			if (!response.ok) {
				// Manejo especial para error 429 (rate limit excedido)
				if (response.status === 429) {
					console.warn('⚠️ Rate limit excedido en Groq API');
					throw new Error('RATE_LIMIT_EXCEEDED');
				}

				let detalle = 'Desconocido';
				try {
					const error = await response.json();
					detalle = error.error?.message || JSON.stringify(error);
				} catch {
					// ignorado - mantenemos detalle por defecto
				}
				throw new Error(`Error de API (${response.status}): ${detalle}`);
			}

			const data = await response.json();
			const respuesta = data.choices[0]?.message?.content || '';

			console.log(`✅ Respuesta recibida de ${useBackend ? 'backend proxy' : 'Groq'}:`, respuesta);

			return this.limpiarRespuesta(respuesta);
		} catch (error) {
			console.error(`❌ Error llamando a ${destino}:`, error);
			throw error;
		}
	}

	construirMensajes({ historial, mensajeActual, contexto, ultimaPregunta }) {
		const mensajes = [];

		// Sistema: instrucciones de comportamiento
		let instruccionSistema = this.config.persona;

		if (contexto) {
			instruccionSistema += `\n\nINFORMACIÓN DEL CUENTO:\n${contexto}`;
		}

		// Extraer TODAS las preguntas anteriores del historial para evitar repeticiones
		const preguntasAnteriores = historial
			.filter(t => t.rol === 'assistant')
			.map(t => {
				const match = t.contenido.match(/¿[^?]+\?/g);
				return match ? match[match.length - 1] : null;
			})
			.filter(Boolean);

		if (preguntasAnteriores.length > 0) {
			instruccionSistema += `\n\n⚠️ NUNCA REPITAS ESTAS PREGUNTAS QUE YA HICISTE:\n${preguntasAnteriores.map(p => `- ${p}`).join('\n')}`;
		}

		instruccionSistema += '\n\nREGLAS ESTRICTAS:\n- Responde en 2-3 oraciones máximo\n- Haz UNA sola pregunta NUEVA y DIFERENTE al final\n- JAMÁS repitas preguntas anteriores (revisa el historial)\n- Si el niño ya respondió algo, no vuelvas a preguntar lo mismo\n- Si el niño no sabe algo, dale la respuesta EXACTA del cuento (no inventes)\n- NUNCA inventes detalles que no estén en la información del cuento\n- Solo usa información de la sección "INFORMACIÓN DEL CUENTO"\n- Sé natural y cariñosa';

		mensajes.push({
			role: 'system',
			content: instruccionSistema
		});

		// Agregar historial reciente (últimos turnos)
		const historialReciente = historial.slice(-this.config.maximoHistorial);
		historialReciente.forEach(turno => {
			mensajes.push({
				role: turno.rol === 'assistant' ? 'assistant' : 'user',
				content: turno.contenido
			});
		});

		// Mensaje actual del usuario
		mensajes.push({
			role: 'user',
			content: mensajeActual
		});

		return mensajes;
	}

	limpiarRespuesta(texto) {
		if (!texto) {
			return '';
		}

		let respuesta = texto
			.replace(/^(Valentina|Profesora)\s*:?\s*/i, '')
			.replace(/^Respuesta\s*:?\s*/i, '')
			.trim();

		return respuesta;
	}
}