/**
 * Profesora Virtual - Sistema de Preguntas Educativas
 * La profesora le hace preguntas a los niños sobre el cuento de Hipólito
 */

class ProfesoraVirtual {
    constructor() {
        this.conversacion = [];
        this.preguntaActual = null;
        this.indicePregunta = 0;
        this.puntaje = 0;
        this.respuestasCorrectas = 0;
        this.sesionIniciada = false;

        // Base de preguntas educativas sobre el cuento
        this.preguntas = [
            {
                id: 1,
                pregunta: "¡Hola! Soy tu profesora virtual 👩‍🏫. Empecemos con algo fácil: ¿Cómo se llama el perro-dragón de la historia?",
                respuestasValidas: ["hipólito", "hipolito", "hipólito el perro dragón", "hipolito el perro dragon"],
                respuestaCorrecta: "¡Exacto! Se llama Hipólito 🐉",
                explicacion: "El perro-dragón se llama Hipólito. Sara dijo que es un nombre perfecto para un perro-dragón de alas blancas con destellos dorados.",
                categoria: "personajes",
                dificultad: "fácil"
            },
            {
                id: 2,
                pregunta: "¿Quiénes son los dos hermanos que encontraron a Hipólito?",
                respuestasValidas: ["sara y benjamin", "sara y benjamín", "benjamin y sara", "benjamín y sara"],
                respuestaCorrecta: "¡Muy bien! Son Sara y Benjamín 👦👧",
                explicacion: "Sara y Benjamín son los hermanos protagonistas. Sara fue quien encontró a Hipólito un día de lluvia en la puerta de su casa.",
                categoria: "personajes",
                dificultad: "fácil"
            },
            {
                id: 3,
                pregunta: "¿Qué características especiales tiene Hipólito? Nombra al menos dos.",
                respuestasValidas: ["alas", "volar", "vuela", "alas blancas", "destellos dorados", "patas grandes", "cicatriz", "dragón", "dragon", "perro dragón", "perro dragon", "blanco", "dorado", "tres puntas"],
                respuestaCorrecta: "¡Perfecto! Hipólito tiene muchas características mágicas ✨",
                explicacion: "Hipólito tiene alas blancas con destellos dorados, patas grandes para aterrizar, una cicatriz misteriosa de tres puntas y está aprendiendo a volar.",
                categoria: "descripción",
                dificultad: "medio",
                requiereMultiple: true
            },
            {
                id: 4,
                pregunta: "¿Dónde buscaron información sobre el origen de Hipólito Sara y Benjamín?",
                respuestasValidas: ["biblioteca", "en la biblioteca", "libro", "libros", "grimorio", "grimorio de animales fantásticos", "en un libro", "mapa", "en el mapa"],
                respuestaCorrecta: "¡Excelente! Fueron a la biblioteca 📚",
                explicacion: "Sara y Benjamín fueron a la biblioteca donde encontraron el 'Grimorio de animales fantásticos', un libro muy viejo con información sobre criaturas mágicas.",
                categoria: "trama",
                dificultad: "medio"
            },
            {
                id: 5,
                pregunta: "¿Cómo se llama el lugar de origen de Hipólito?",
                respuestasValidas: ["siete islas", "las siete islas", "antigua república de las siete islas", "islas"],
                respuestaCorrecta: "¡Muy bien! Las Siete Islas 🏝️",
                explicacion: "El lugar se llama 'La Antigua república de las siete pequeñas islas'. Es un lugar mágico y misterioso, conectado por puentes, donde probablemente nació Hipólito.",
                categoria: "lugares",
                dificultad: "medio"
            },
            {
                id: 6,
                pregunta: "¿Qué le pasó al libro que Sara y Benjamín trajeron de la biblioteca?",
                respuestasValidas: ["hipólito se lo comió", "se lo comió", "hipólito lo comió", "se comió el libro"],
                respuestaCorrecta: "¡Exacto! Hipólito se comió todo el libro 😄",
                explicacion: "Cuando Sara y Benjamín volvieron a la cocina, descubrieron que Hipólito se había comido todo el libro ¡y también su merienda! Los perros-dragones se comen todo lo que encuentran.",
                categoria: "trama",
                dificultad: "fácil"
            },
            {
                id: 7,
                pregunta: "¿Qué animales pequeños le dan besitos a Hipólito en la nariz?",
                respuestasValidas: ["mariposas", "mariposas azules", "mariposas azules"],
                respuestaCorrecta: "¡Correcto! Las mariposas azules 🦋",
                explicacion: "Hay mariposas azules por todos lados que le dan besitos a Hipólito en la nariz. Es una imagen muy tierna del cuento.",
                categoria: "detalles",
                dificultad: "medio"
            },
            {
                id: 8,
                pregunta: "Al principio de la historia, ¿qué tiempo hacía cuando apareció Hipólito?",
                respuestasValidas: ["lluvia", "llovía", "día de lluvia", "estaba lloviendo", "lluvioso", "tiempo lluvioso", "mal tiempo"],
                respuestaCorrecta: "¡Perfecto! Era un día de lluvia ☔",
                explicacion: "La historia comenzó un día de lluvia, cuando la ciudad estaba colapsada. En la puerta de la casa apareció una bolita blanca de plumas y pelos.",
                categoria: "inicio",
                dificultad: "fácil"
            },
            {
                id: 9,
                pregunta: "¿Qué decisión importante tomaron Sara y Benjamín al encontrar a Hipólito?",
                respuestasValidas: ["adoptarlo", "lo adoptaron", "adoptarlo", "quedárselo"],
                respuestaCorrecta: "¡Muy bien! Decidieron adoptarlo 💕",
                explicacion: "Sara y Benjamín decidieron adoptar a Hipólito. Sara dijo que le parecía una excelente idea cuidar de esta criatura mágica.",
                categoria: "decisiones",
                dificultad: "fácil"
            },
            {
                id: 10,
                pregunta: "¿Para qué usan Sara y Benjamín su casa cuando Hipólito está aprendiendo?",
                respuestasValidas: ["pista de aterrizaje", "para aterrizar", "pista", "aterrizar", "practicar vuelo", "volar", "entrenar"],
                respuestaCorrecta: "¡Exacto! Como pista de aterrizaje ✈️",
                explicacion: "La casa de Sara y Benjamín se convierte en una pista de aterrizaje porque Hipólito está aprendiendo a volar y necesita practicar sus aterrizajes.",
                categoria: "detalles",
                dificultad: "medio"
            }
        ];

        // Mezclar preguntas para variedad
        this.preguntasMezcladas = this.mezclarArray([...this.preguntas]);
    }

    /**
     * Inicializa la sesión de preguntas
     */
    async inicializar() {
        console.log('👩‍🏫 Inicializando Profesora Virtual...');
        this.sesionIniciada = true;
        return this.empezarSesion();
    }

    /**
     * Empieza una nueva sesión de preguntas
     */
    empezarSesion() {
        this.indicePregunta = 0;
        this.puntaje = 0;
        this.respuestasCorrectas = 0;
        this.conversacion = [];

        const mensajeBienvenida = "¡Hola! 👋 Soy tu profesora virtual. He leído el cuento de Hipólito y me encantaría saber qué tanto recuerdas de la historia. Te voy a hacer algunas preguntas divertidas. ¿Estás listo? 😊";

        this.conversacion.push({
            profesora: mensajeBienvenida,
            timestamp: new Date()
        });

        return mensajeBienvenida;
    }

    /**
     * Procesa la respuesta del estudiante y devuelve la siguiente pregunta
     */
    async procesarRespuesta(respuestaEstudiante) {
        if (!this.sesionIniciada) {
            return this.empezarSesion();
        }

        // Si es la primera interacción después de la bienvenida, solo confirmar y hacer la primera pregunta
        if (this.preguntaActual === null && this.indicePregunta === 0) {
            // Guardar la respuesta del estudiante (confirmación)
            this.conversacion.push({
                estudiante: respuestaEstudiante,
                timestamp: new Date()
            });

            // Responder con entusiasmo y hacer la primera pregunta
            const confirmacion = "¡Perfecto! Me encanta tu entusiasmo. Empecemos entonces... 🎉\n\n";
            const primeraPregunta = this.hacerSiguientePregunta();

            this.conversacion.push({
                profesora: confirmacion + primeraPregunta,
                timestamp: new Date()
            });

            return confirmacion + primeraPregunta;
        }

        // Si la sesión ya terminó (indicePregunta >= total de preguntas), manejar conversación libre
        if (this.indicePregunta >= this.preguntasMezcladas.length) {
            return this.manejarConversacionLibre(respuestaEstudiante);
        }

        // Si no hay pregunta activa, no evaluar nada
        if (!this.preguntaActual) {
            return "¡Hola! ¿Estás listo para comenzar? 😊";
        }

        // Guardar la respuesta del estudiante
        this.conversacion.push({
            estudiante: respuestaEstudiante,
            timestamp: new Date()
        });

        // Evaluar si la respuesta es correcta
        let respuestaProfesora;

        // Si la respuesta es "no sé" o similar, dar apoyo
        const respuestaLimpia = respuestaEstudiante.toLowerCase().trim();
        const variacionesNoSe = [
            'nose', 'no se', 'no sé', 'no',
            'no me acuerdo', 'no recuerdo', 'no lo recuerdo',
            'no me acuerdo bien', 'no me acuerdo muy bien',
            'no lo sé', 'no lo se', 'nada', 'no idea',
            'no tengo idea', 'ni idea', 'no sabe',
            'olvide', 'olvidé', 'se me olvido', 'se me olvidó',
            'no entiendo', 'no comprendo', 'no estoy seguro',
            'no estoy segura', 'mmm no', 'ehh no', 'este no',
            'paso', 'siguiente', 'skip'
        ];

        const esRespuestaNoSe = variacionesNoSe.some(variacion =>
            respuestaLimpia === variacion ||
            respuestaLimpia.includes(variacion) ||
            (variacion.length > 3 && respuestaLimpia.startsWith(variacion))
        );

        if (esRespuestaNoSe) {
            // Respuesta "no sé" - dar apoyo sin presión
            respuestaProfesora = "No pasa nada, está bien no recordar todo. Te ayudo: " + this.preguntaActual.respuestaCorrecta.replace(/¡[^!]*!/g, '').trim() + "\n\n" + this.preguntaActual.explicacion;
        } else {
            // Evaluar si la respuesta es realmente correcta
            const evaluacion = this.evaluarRespuesta(respuestaEstudiante);

            if (evaluacion.esCorrecta) {
                // Respuesta correcta - celebrar
                respuestaProfesora = this.preguntaActual.respuestaCorrecta + "\n\n" + this.preguntaActual.explicacion;
            } else {
                // Respuesta incorrecta - dar apoyo y enseñar
                respuestaProfesora = "No pasa nada, te ayudo con la respuesta correcta: " + this.preguntaActual.respuestaCorrecta.replace(/¡[^!]*!/g, '').trim() + "\n\n" + this.preguntaActual.explicacion;
            }
        }

        // Guardar respuesta de la profesora
        this.conversacion.push({
            profesora: respuestaProfesora,
            timestamp: new Date()
        });

        // Verificar si hay más preguntas
        if (this.indicePregunta < this.preguntasMezcladas.length - 1) {
            // Hacer la siguiente pregunta
            const siguientePregunta = this.hacerSiguientePregunta();
            return respuestaProfesora + "\n\n" + siguientePregunta;
        } else {
            // Terminar la sesión
            return respuestaProfesora + "\n\n" + this.generarResumenFinal();
        }
    }

    /**
     * Hace la siguiente pregunta
     */
    hacerSiguientePregunta() {
        if (this.indicePregunta >= this.preguntasMezcladas.length) {
            return this.generarResumenFinal();
        }

        this.preguntaActual = this.preguntasMezcladas[this.indicePregunta];
        this.indicePregunta++;

        const pregunta = this.preguntaActual.pregunta;

        this.conversacion.push({
            profesora: pregunta,
            timestamp: new Date()
        });

        return pregunta;
    }

    /**
     * Evalúa si la respuesta del estudiante es correcta
     */
    evaluarRespuesta(respuesta) {
        if (!this.preguntaActual) {
            return { esCorrecta: false, similitud: 0 };
        }

        const respuestaLimpia = respuesta.toLowerCase()
            .replace(/[¿?¡!.,]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        // Para preguntas que requieren múltiples respuestas
        if (this.preguntaActual.requiereMultiple) {
            const coincidencias = this.preguntaActual.respuestasValidas.filter(valida =>
                this.esRespuestaValida(respuestaLimpia, valida.toLowerCase())
            );
            return {
                esCorrecta: coincidencias.length >= 1,
                similitud: coincidencias.length / this.preguntaActual.respuestasValidas.length
            };
        }

        // Para preguntas regulares - evaluar con más flexibilidad
        const esCorrecta = this.preguntaActual.respuestasValidas.some(valida =>
            this.esRespuestaValida(respuestaLimpia, valida.toLowerCase())
        );

        return {
            esCorrecta: esCorrecta,
            similitud: esCorrecta ? 1 : 0
        };
    }

    /**
     * Verifica si una respuesta es válida con más flexibilidad
     */
    esRespuestaValida(respuestaEstudiante, respuestaValida) {
        // Limpiar ambas respuestas
        const respuestaEstudianteLimpia = respuestaEstudiante.toLowerCase()
            .replace(/[¿?¡!.,]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        const respuestaValidaLimpia = respuestaValida.toLowerCase()
            .replace(/[¿?¡!.,]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        // Coincidencia exacta
        if (respuestaEstudianteLimpia === respuestaValidaLimpia) return true;

        // Contiene la respuesta válida completa
        if (respuestaEstudianteLimpia.includes(respuestaValidaLimpia)) return true;

        // Verificar si todas las palabras clave están presentes
        const palabrasValidas = respuestaValidaLimpia.split(' ').filter(p => p.length >= 3);
        if (palabrasValidas.length === 0) return false;

        // Al menos el 60% de las palabras clave deben estar presentes
        const palabrasEncontradas = palabrasValidas.filter(palabra =>
            respuestaEstudianteLimpia.includes(palabra)
        );

        const porcentajeCoincidencia = palabrasEncontradas.length / palabrasValidas.length;

        // Ser más estricto: necesita al menos 60% de coincidencia
        // Y para respuestas cortas (1-2 palabras), necesita coincidencia exacta
        if (palabrasValidas.length <= 2) {
            return porcentajeCoincidencia >= 0.8;
        } else {
            return porcentajeCoincidencia >= 0.6;
        }
    }

    /**
     * Genera el resumen final de la sesión
     */
    generarResumenFinal() {
        let mensaje = `🎉 ¡Terminamos con todas las preguntas! Ha sido un placer conversar contigo sobre la historia de Hipólito. `;

        // Dar retroalimentación positiva general (sin mencionar puntuaciones)
        mensaje += "¡Excelente trabajo! 🌟 Se nota que disfrutaste el cuento y aprendiste muchas cosas sobre Hipólito, Sara y Benjamín.";

        mensaje += "\n\n¿Te gustaría que conversemos sobre algo específico del cuento o tienes alguna pregunta sobre Hipólito? 🤔";

        this.conversacion.push({
            profesora: mensaje,
            timestamp: new Date()
        });

        return mensaje;
    }

    /**
     * Reinicia la sesión de preguntas
     */
    reiniciarSesion() {
        this.preguntasMezcladas = this.mezclarArray([...this.preguntas]);
        return this.empezarSesion();
    }

    /**
     * Mezcla un array para variar el orden de las preguntas
     */
    mezclarArray(array) {
        const arrayMezclado = [...array];
        for (let i = arrayMezclado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayMezclado[i], arrayMezclado[j]] = [arrayMezclado[j], arrayMezclado[i]];
        }
        return arrayMezclado;
    }

    /**
     * Obtiene el progreso actual
     */
    obtenerProgreso() {
        return {
            preguntaActual: this.indicePregunta,
            totalPreguntas: this.preguntasMezcladas.length,
            respuestasCorrectas: this.respuestasCorrectas,
            puntaje: this.puntaje,
            porcentaje: Math.round((this.respuestasCorrectas / Math.max(this.indicePregunta - 1, 1)) * 100)
        };
    }

    /**
     * Obtiene estadísticas de la sesión
     */
    obtenerEstadisticas() {
        return {
            conversacion: this.conversacion,
            progreso: this.obtenerProgreso(),
            sesionCompleta: this.indicePregunta >= this.preguntasMezcladas.length
        };
    }

    /**
     * Maneja respuestas no relacionadas con las preguntas
     */
    manejarRespuestaLibre(mensaje) {
        const respuestasGenerales = [
            "Esa es una pregunta interesante, pero primero terminemos con las preguntas sobre el cuento de Hipólito. 😊",
            "Me gusta que seas curioso, pero concentrémonos en la historia de Hipólito por ahora. 📚",
            "¡Qué buena pregunta! Cuando terminemos con el cuestionario podemos hablar de eso. 🤔",
            "Veo que tienes muchas ganas de conversar, ¡perfecto! Primero acabemos con estas preguntas sobre Hipólito. 🐉"
        ];

        return respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)];
    }

    /**
     * Maneja conversaciones libres después de terminar la sesión
     */
    manejarConversacionLibre(mensaje) {
        // Guardar la pregunta del estudiante
        this.conversacion.push({
            estudiante: mensaje,
            timestamp: new Date()
        });

        const preguntaLimpia = mensaje.toLowerCase().trim();

        // Base de conocimiento sobre el cuento para responder preguntas libres
        let respuesta = "¡Qué buena pregunta! ";

        if (preguntaLimpia.includes('cuento') && (preguntaLimpia.includes('llama') || preguntaLimpia.includes('nombre'))) {
            respuesta += "El cuento se llama 'Hipólito, mi perro-dragón' 📚. Es una historia muy bonita sobre Sara y Benjamín que encuentran a una criatura mágica muy especial.";
        } else if (preguntaLimpia.includes('autor') || preguntaLimpia.includes('escribi') || preguntaLimpia.includes('quién')) {
            respuesta += "Sobre el autor del cuento, no tengo esa información específica en este momento. Lo que sí puedo contarte es todo sobre la historia de Hipólito y sus aventuras. 😊";
        } else if (preguntaLimpia.includes('otra') && (preguntaLimpia.includes('pregunta') || preguntaLimpia.includes('historia'))) {
            respuesta += "¡Por supuesto! ¿Te gustaría que te cuente más detalles sobre algún personaje específico? ¿O prefieres que hablemos de tu parte favorita de la historia?";
        } else if (preguntaLimpia.includes('favorito') || preguntaLimpia.includes('gusta')) {
            respuesta += "¡Me encanta cuando los niños me hablan de sus partes favoritas! ¿Cuál fue tu momento favorito del cuento? ¿Fue cuando apareció Hipólito, cuando aprendió a volar, o tal vez otra parte?";
        } else if (preguntaLimpia.includes('más') && preguntaLimpia.includes('cuento')) {
            respuesta += "¡Qué maravilloso que quieras saber más! Puedo contarte detalles adicionales sobre cualquier parte del cuento. ¿Hay algo específico sobre Hipólito, Sara, Benjamín o las Siete Islas que te intrigue?";
        } else if (preguntaLimpia.includes('hipólito') || preguntaLimpia.includes('hipolito')) {
            respuesta += "¡Hipólito es increíble! Es un perro-dragón con alas blancas y destellos dorados, tiene una cicatriz misteriosa de tres puntas y está aprendiendo a volar. ¿Qué más te gustaría saber sobre él?";
        } else if (preguntaLimpia.includes('sara') || preguntaLimpia.includes('benjamín') || preguntaLimpia.includes('benjamin')) {
            respuesta += "Sara y Benjamín son hermanos muy valientes y cariñosos. Sara fue quien encontró a Hipólito en la puerta de su casa un día de lluvia. ¿Te gustaría saber más sobre sus aventuras?";
        } else if (preguntaLimpia.includes('final') || preguntaLimpia.includes('termina') || preguntaLimpia.includes('acaba')) {
            respuesta += "El cuento tiene un final muy emotivo donde toda la familia decide adoptar a Hipólito y su casa se convierte en una pista de aterrizaje para que practique volar. ¡Es muy tierno!";
        } else if (preguntaLimpia.includes('gracias') || preguntaLimpia.includes('bien') || preguntaLimpia.includes('perfecto')) {
            respuesta += "¡De nada! Me encanta conversar sobre el cuento contigo. ¿Hay algo más que te gustaría preguntarme sobre la historia de Hipólito?";
        } else {
            // Respuesta general para preguntas no reconocidas
            respuesta += "Esa es una pregunta muy interesante. Como profesora virtual especializada en el cuento de Hipólito, puedo ayudarte con preguntas sobre la historia, los personajes, o los lugares del cuento. ¿Hay algo específico sobre la aventura de Hipólito que te gustaría saber?";
        }

        // Guardar respuesta de la profesora
        this.conversacion.push({
            profesora: respuesta,
            timestamp: new Date()
        });

        return respuesta;
    }

    /**
     * Limpia la conversación
     */
    limpiarConversacion() {
        this.conversacion = [];
        this.preguntaActual = null;
        this.indicePregunta = 0;
        this.puntaje = 0;
        this.respuestasCorrectas = 0;
        this.sesionIniciada = false;
        console.log('🧹 Sesión de profesora virtual reiniciada');
    }
}

// Hacer disponible globalmente
window.ProfesoraVirtual = ProfesoraVirtual;
