/**
 * Chat Educativo - La Profesora Virtual hace preguntas a los niños
 * Sistema donde la profesora conversa sobre el conocimiento del cuento
 */

class ChatEducativo {
    constructor() {
        this.profesora = new ProfesoraVirtual();
        this.iniciado = false;
        this.esperandoRespuesta = false;

        // Elementos del DOM
        this.contenedorMensajes = null;
        this.inputMensaje = null;
        this.botonEnviar = null;
        this.indicadorEstado = null;
    }

    /**
     * Inicializa todo el sistema de chat educativo
     */
    async inicializar() {
        try {
            console.log('💬 Inicializando Chat Educativo...');

            this.configurarDOM();
            this.configurarEventos();

            // Inicializar la profesora virtual
            const mensajeBienvenida = await this.profesora.inicializar();

            this.mostrarMensajeProfesora(mensajeBienvenida);
            this.habilitarChat();

            this.iniciado = true;
            console.log('✅ Chat educativo iniciado exitosamente');

        } catch (error) {
            console.error('❌ Error iniciando chat educativo:', error);
            this.mostrarError('No pude inicializar el sistema educativo. Por favor, recarga la página.');
            throw error;
        }
    }

    /**
     * Configura los elementos del DOM
     */
    configurarDOM() {
        this.contenedorMensajes = document.getElementById('chat-mensajes');
        this.inputMensaje = document.getElementById('chat-input');
        this.botonEnviar = document.getElementById('btn-enviar');
        this.indicadorEstado = document.getElementById('estado-conexion');

        if (!this.contenedorMensajes || !this.inputMensaje || !this.botonEnviar) {
            throw new Error('Elementos del DOM no encontrados');
        }

        // Cambiar placeholder del input
        this.inputMensaje.placeholder = "Escribe tu respuesta aquí...";

        console.log('📋 Elementos DOM configurados para chat educativo');
    }

    /**
     * Configura eventos de interacción
     */
    configurarEventos() {
        // Botón enviar
        this.botonEnviar.addEventListener('click', () => this.enviarRespuesta());

        // Enter en el input
        this.inputMensaje.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.enviarRespuesta();
            }
        });

        // Botón para nueva sesión
        const btnNuevaSesion = document.getElementById('btn-nueva-sesion');
        if (btnNuevaSesion) {
            btnNuevaSesion.addEventListener('click', () => this.iniciarNuevaSesion());
        }

        console.log('⚡ Eventos configurados para chat educativo');
    }

    /**
     * Envía la respuesta del estudiante
     */
    async enviarRespuesta() {
        const respuesta = this.inputMensaje.value.trim();

        if (!respuesta || this.esperandoRespuesta) return;

        // Mostrar respuesta del estudiante
        this.mostrarMensajeEstudiante(respuesta);

        // Limpiar input
        this.inputMensaje.value = '';

        // Mostrar que la profesora está evaluando
        this.mostrarEvaluando();

        try {
            // Procesar respuesta con la profesora virtual
            const respuestaProfesora = await this.profesora.procesarRespuesta(respuesta);

            // Ocultar indicador de conversación
            this.ocultarEvaluando();

            // Mostrar respuesta de la profesora
            this.mostrarMensajeProfesora(respuestaProfesora);

        } catch (error) {
            console.error('Error procesando respuesta:', error);
            this.ocultarEvaluando();
            this.mostrarError('Hubo un problema evaluando tu respuesta. Intenta de nuevo.');
        }
    }

    /**
     * Muestra un mensaje del estudiante
     */
    mostrarMensajeEstudiante(mensaje) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'mensaje usuario';
        mensajeDiv.innerHTML = `
            <div class="avatar">👦</div>
            <div class="contenido">
                <strong>Tú:</strong>
                <p>${this.escaparHTML(mensaje)}</p>
            </div>
        `;

        this.contenedorMensajes.appendChild(mensajeDiv);
        this.scrollAlFinal();
    }

    /**
     * Muestra un mensaje de la profesora
     */
    mostrarMensajeProfesora(mensaje) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'mensaje profesora';
        mensajeDiv.innerHTML = `
            <div class="avatar">👩‍🏫</div>
            <div class="contenido">
                <strong>Profesora Virtual:</strong>
                <p>${this.escaparHTML(mensaje).replace(/\n\n/g, '</p><p>')}</p>
            </div>
        `;

        this.contenedorMensajes.appendChild(mensajeDiv);
        this.scrollAlFinal();
    }

    /**
     * Muestra indicador de que la profesora está evaluando
     */
    mostrarEvaluando() {
        this.esperandoRespuesta = true;
        this.inputMensaje.disabled = true;
        this.botonEnviar.disabled = true;

        const evaluandoDiv = document.createElement('div');
        evaluandoDiv.id = 'evaluando';
        evaluandoDiv.className = 'mensaje profesora evaluando';
        evaluandoDiv.innerHTML = `
            <div class="avatar">👩‍🏫</div>
            <div class="contenido">
                <strong>Profesora Virtual:</strong>
                <p>Evaluando tu respuesta... 🤔</p>
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

    /**
     * Oculta indicador de conversación
     */
    ocultarEvaluando() {
        this.esperandoRespuesta = false;
        this.inputMensaje.disabled = false;
        this.botonEnviar.disabled = false;

        const evaluandoDiv = document.getElementById('evaluando');
        if (evaluandoDiv) {
            evaluandoDiv.remove();
        }
    }

    /**
     * Inicia una nueva sesión de preguntas
     */
    iniciarNuevaSesion() {
        // Limpiar chat
        this.contenedorMensajes.innerHTML = '';

        // Reiniciar profesora
        const mensajeBienvenida = this.profesora.reiniciarSesion();
        this.mostrarMensajeProfesora(mensajeBienvenida);

        console.log('🔄 Nueva sesión iniciada');
    }

    /**
     * Muestra un error
     */
    mostrarError(mensaje) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'mensaje error';
        errorDiv.innerHTML = `
            <div class="avatar">⚠️</div>
            <div class="contenido">
                <strong>Error:</strong>
                <p>${this.escaparHTML(mensaje)}</p>
            </div>
        `;

        this.contenedorMensajes.appendChild(errorDiv);
        this.scrollAlFinal();
    }

    /**
     * Habilita el chat para uso
     */
    habilitarChat() {
        if (this.indicadorEstado) {
            this.indicadorEstado.className = 'estado-conexion exito';
            this.indicadorEstado.innerHTML = `
                <span class="icono">✅</span>
                <span class="texto">Profesora Virtual Lista</span>
            `;
        }

        this.inputMensaje.disabled = false;
        this.botonEnviar.disabled = false;
    }

    /**
     * Hace scroll al final del chat
     */
    scrollAlFinal() {
        setTimeout(() => {
            this.contenedorMensajes.scrollTop = this.contenedorMensajes.scrollHeight;
        }, 100);
    }

    /**
     * Escapa HTML para seguridad
     */
    escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    /**
     * Limpia toda la conversación
     */
    limpiarChat() {
        this.contenedorMensajes.innerHTML = '';
        this.profesora.limpiarConversacion();
    }

    /**
     * Obtiene las estadísticas de la sesión
     */
    obtenerEstadisticas() {
        return this.profesora.obtenerEstadisticas();
    }
}

// Hacer disponible globalmente
window.ChatEducativo = ChatEducativo;
