import { ProfesoraVirtual } from './profesora-virtual.js';

export class ChatEducativo {
	constructor() {
		this.profesora = new ProfesoraVirtual();
		this.iniciado = false;
		this.esperandoRespuesta = false;

		this.contenedorMensajes = null;
		this.inputMensaje = null;
		this.botonEnviar = null;
		this.indicadorEstado = null;
		this.loaderOverlay = null;
		this.loaderTexto = null;

		// Rate limiting: evitar spam
		this.ultimoMensajeTimestamp = 0;
		this.tiempoMinimoEntremensajes = 3000; // 3 segundos
	}

	async inicializar() {
		try {
			this.configurarDOM();
			this.configurarEventos();
			this.mostrarLoader('Cargando a la maestra virtual...');
			// Cede un frame para que el loader se pinte antes del trabajo pesado de IA.
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

			const mensajeBienvenida = await this.profesora.inicializar({
				onEstado: (mensaje) => {
					this.actualizarEstadoConexion(mensaje, 'progreso');
					this.mostrarLoader(mensaje);
				}
			});

			this.actualizarEstadoConexion('Maestra Virtual lista', 'exito');
			this.mostrarMensajeProfesora(mensajeBienvenida);
			this.habilitarChat();
			this.ocultarLoader();
			this.iniciado = true;
		} catch (error) {
			console.error('Error iniciando chat educativo:', error);
			this.actualizarEstadoConexion('No pude iniciar la maestra virtual. Recarga la página.', 'error');
			this.mostrarError('No pude inicializar el sistema educativo. Por favor, recarga la página.');
			this.mostrarLoader('Ocurrió un error iniciando la maestra. Refresca para intentarlo de nuevo.');
			throw error;
		}
	}

	configurarDOM() {
		this.contenedorMensajes = document.getElementById('chat-mensajes');
		this.inputMensaje = document.getElementById('chat-input');
		this.botonEnviar = document.getElementById('btn-enviar');
		this.indicadorEstado = document.getElementById('estado-conexion');
		this.loaderOverlay = document.getElementById('loader-overlay');
		this.loaderTexto = document.getElementById('loader-text');

		if (!this.contenedorMensajes || !this.inputMensaje || !this.botonEnviar || !this.indicadorEstado || !this.loaderOverlay) {
			throw new Error('Elementos del DOM no encontrados');
		}

		this.inputMensaje.placeholder = 'Escribe tu idea aquí...';
	}

	configurarEventos() {
		this.botonEnviar.addEventListener('click', () => this.enviarRespuesta());

		this.inputMensaje.addEventListener('keypress', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				this.enviarRespuesta();
			}
		});

		const btnNuevaSesion = document.getElementById('btn-nueva-sesion');
		if (btnNuevaSesion) {
			btnNuevaSesion.addEventListener('click', () => this.iniciarNuevaSesion());
		}
	}

	actualizarEstadoConexion(mensaje, tipo = 'info') {
		if (!this.indicadorEstado) return;

		const clases = ['estado-conexion', 'info', 'progreso', 'exito', 'error'];
		this.indicadorEstado.className = 'estado-conexion';
		if (clases.includes(tipo)) {
			this.indicadorEstado.classList.add(tipo);
		}

		const iconoClase =
			tipo === 'progreso' ? 'spinner' :
				tipo === 'exito' ? 'check' :
					tipo === 'error' ? 'error' :
						'info';

		this.indicadorEstado.innerHTML = `
			<span class="icono ${iconoClase}" aria-hidden="true"></span>
			<span class="texto">${this.escaparHTML(mensaje)}</span>
		`;
	}

	async enviarRespuesta() {
		const respuesta = this.inputMensaje.value.trim();

		if (!respuesta || this.esperandoRespuesta) return;

		// Rate limiting: verificar tiempo desde último mensaje
		const ahora = Date.now();
		const tiempoDesdeUltimoMensaje = ahora - this.ultimoMensajeTimestamp;

		if (tiempoDesdeUltimoMensaje < this.tiempoMinimoEntremensajes) {
			const segundosRestantes = Math.ceil((this.tiempoMinimoEntremensajes - tiempoDesdeUltimoMensaje) / 1000);
			this.actualizarEstadoConexion(`Esperá ${segundosRestantes} segundos antes de enviar otro mensaje`, 'info');
			return;
		}

		this.ultimoMensajeTimestamp = ahora;
		this.mostrarMensajeEstudiante(respuesta);
		this.inputMensaje.value = '';
		this.mostrarEvaluando();
		// Permite pintar el indicador antes de bloquear con el cálculo de IA.
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

		try {
			const respuestaProfesora = await this.profesora.procesarRespuesta(respuesta);
			this.ocultarEvaluando();
			this.actualizarEstadoConexion('Maestra Virtual lista para seguir dialogando', 'exito');
			this.mostrarMensajeProfesora(respuestaProfesora);
		} catch (error) {
			console.error('Error procesando respuesta:', error);
			this.ocultarEvaluando();
			this.actualizarEstadoConexion('La maestra tuvo un problema. Intentá de nuevo.', 'error');
			this.mostrarError('Hubo un problema generando la respuesta. Intenta nuevamente.');
		}
	}

	mostrarMensajeEstudiante(mensaje) {
		const mensajeDiv = document.createElement('div');
		mensajeDiv.className = 'mensaje usuario';
		mensajeDiv.innerHTML = `
			<div class="avatar" aria-hidden="true"></div>
			<div class="contenido">
				<strong>Tú:</strong>
				${this.formatearMensaje(mensaje)}
			</div>
		`;

		this.contenedorMensajes.appendChild(mensajeDiv);
		this.scrollAlFinal();
	}

	mostrarMensajeProfesora(mensaje) {
		const mensajeDiv = document.createElement('div');
		mensajeDiv.className = 'mensaje profesora';
		mensajeDiv.innerHTML = `
			<div class="avatar" aria-hidden="true"></div>
			<div class="contenido">
				<strong>Maestra Virtual:</strong>
				${this.formatearMensaje(mensaje)}
			</div>
		`;

		this.contenedorMensajes.appendChild(mensajeDiv);
		this.scrollAlFinal();
	}

	mostrarEvaluando() {
		this.esperandoRespuesta = true;
		this.inputMensaje.disabled = true;
		this.botonEnviar.disabled = true;
		this.actualizarEstadoConexion('La maestra está pensando...', 'progreso');
		this.mostrarLoader('La maestra está pensando...');

		const evaluandoDiv = document.createElement('div');
		evaluandoDiv.id = 'evaluando';
		evaluandoDiv.className = 'mensaje profesora evaluando';
		evaluandoDiv.innerHTML = `
			<div class="avatar" aria-hidden="true"></div>
			<div class="contenido">
				<strong>Maestra Virtual:</strong>
				<p>Pensando en la mejor respuesta...</p>
				<div class="puntos-escribiendo">
					<span>●</span>
					<span>●</span>
					<span>●</span>
				</div>
			</div>
		`;

		this.contenedorMensajes.appendChild(evaluandoDiv);
		this.scrollAlFinal();
	}

	ocultarEvaluando() {
		this.esperandoRespuesta = false;
		this.inputMensaje.disabled = false;
		this.botonEnviar.disabled = false;
		this.ocultarLoader();

		const evaluandoDiv = document.getElementById('evaluando');
		if (evaluandoDiv) {
			evaluandoDiv.remove();
		}
	}

	iniciarNuevaSesion() {
		this.contenedorMensajes.innerHTML = '';
		const mensajeBienvenida = this.profesora.reiniciarSesion();
		this.actualizarEstadoConexion('Comenzamos una nueva conversación', 'info');
		this.mostrarMensajeProfesora(mensajeBienvenida);
	}

	mostrarError(mensaje) {
		const errorDiv = document.createElement('div');
		errorDiv.className = 'mensaje error';
		errorDiv.innerHTML = `
			<div class="avatar" aria-hidden="true"></div>
			<div class="contenido">
				<strong>Error:</strong>
				${this.formatearMensaje(mensaje)}
			</div>
		`;

		this.contenedorMensajes.appendChild(errorDiv);
		this.scrollAlFinal();
	}

	habilitarChat() {
		this.inputMensaje.disabled = false;
		this.botonEnviar.disabled = false;
	}

	scrollAlFinal() {
		setTimeout(() => {
			this.contenedorMensajes.scrollTop = this.contenedorMensajes.scrollHeight;
		}, 100);
	}

	formatearMensaje(texto) {
		const seguro = this.escaparHTML(texto);
		const bloques = seguro.split(/\n{2,}/).map((bloque) => bloque.trim()).filter(Boolean);
		if (bloques.length === 0) {
			return '<p></p>';
		}

		return bloques
			.map((bloque) => `<p>${bloque.replace(/\n/g, '<br>')}</p>`)
			.join('');
	}

	escaparHTML(texto) {
		const div = document.createElement('div');
		div.textContent = texto;
		return div.innerHTML;
	}

	limpiarChat() {
		this.contenedorMensajes.innerHTML = '';
		this.profesora.limpiarConversacion();
	}

	mostrarLoader(mensaje = 'Procesando...') {
		if (!this.loaderOverlay) return;
		this.loaderOverlay.classList.add('visible');
		if (this.loaderTexto) {
			this.loaderTexto.textContent = mensaje;
		}
	}

	ocultarLoader() {
		if (!this.loaderOverlay) return;
		this.loaderOverlay.classList.remove('visible');
	}

	obtenerEstadisticas() {
		return this.profesora.obtenerEstadisticas();
	}
}

if (typeof window !== 'undefined') {
	window.ChatEducativo = ChatEducativo;
}
