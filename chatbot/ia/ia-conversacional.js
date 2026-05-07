/**
 * Motor de IA conversacional que delega todas las llamadas en un backend
 * Node/Express. Ese backend habla con OpenRouter (Gemini Flash).
 * Mantener la llamada en el servidor evita exponer credenciales en el cliente.
 */

export class IAConversacional {
	constructor(configuracion = {}) {
		this.config = {
			backendUrl: configuracion.backendUrl || '',
			useBackend: configuracion.useBackend !== false,
			// Modelo por defecto: Gemini Flash
			modelo: configuracion.modelo || 'gemini-2.5-flash',
			maximoHistorial: 5,
			maxTokens: 500,
			temperatura: 0.4,
			topP: 0.7,
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
			if (!this.config.useBackend) {
				throw new Error('⚠️ El modo sin backend ya no está disponible. Configurá BACKEND_URL.');
			}

			if (!this.config.backendUrl || this.config.backendUrl.length === 0) {
				throw new Error('⚠️ Falta configurar BACKEND_URL con la URL del servidor Node.');
			}

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
		const url = `${this.config.backendUrl.replace(/\/$/, '')}/api/health`;
		const response = await fetch(url, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) {
			throw new Error('Backend inaccesible: revisá la URL o las credenciales en el servidor');
		}

		try {
			const estado = await response.json();
			if (!estado?.hasCredentials) {
				throw new Error('Backend sin credenciales. Configurá OPENROUTER_API_KEY en el servidor.');
			}
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('No se pudo validar la respuesta del backend.');
		}
	}

	async generarRespuesta({ historial = [], mensajeActual = '', contexto = '', emocion = 'curiosa', objetivo = 'profundizar la comprensión del cuento', intencion = 'conversacion', ultimaPregunta = null }) {
		if (!this.listo) {
			throw new Error('La IA no está lista. Llamá a cargarModelo() primero.');
		}

		// Construir mensajes para la API
		const mensajes = this.construirMensajes({ historial, mensajeActual, contexto, ultimaPregunta });

		const destino = `backend Vertex (${this.config.backendUrl})`;
		console.log(`=== Llamando a ${destino} ===`);
		console.log('Mensajes:', JSON.stringify(mensajes, null, 2));

		try {
			const url = `${this.config.backendUrl.replace(/\/$/, '')}/api/chat`;
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
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
				let detalle = 'Desconocido';
				try {
					const error = await response.json();
					detalle = error.error?.message || error.message || JSON.stringify(error);
				} catch {
					// ignorado - mantenemos detalle por defecto
				}
				throw new Error(`Error de API (${response.status}): ${detalle}`);
			}

			const data = await response.json();
			const respuesta = data.choices[0]?.message?.content || '';

			console.log('✅ Respuesta recibida de backend Vertex:', respuesta);

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