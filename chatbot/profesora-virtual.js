import { IAConversacional } from './ia/ia-conversacional.js';
import { CONFIG } from './config.js';

const CONOCIMIENTO_HIPOLITO = [
	{
		titulo: 'Quién es Hipólito',
		palabrasClave: ['hipolito', 'dragon', 'perro', 'alas', 'nombre'],
		contenido:
			'Hipólito es un perro-dragón de alas blancas con destellos dorados. Tiene patas grandes para aterrizar, una cicatriz misteriosa de tres puntas en el lomo y todavía está aprendiendo a volar.'
	},
	{
		titulo: 'Los hermanos protagonistas',
		palabrasClave: ['sara', 'benjamin', 'hermanos', 'niños'],
		contenido:
			'Sara y Benjamín son hermanos curiosos y valientes. Sara fue quien encontró a Hipólito en la puerta de su casa un día de lluvia, y juntos decidieron adoptarlo y cuidarlo con mucho cariño.'
	},
	{
		titulo: 'El día lluvioso',
		palabrasClave: ['lluvia', 'inicio', 'clima', 'puerta'],
		contenido:
			'La historia comienza en un día lluvioso y con la ciudad colapsada. En medio del mal tiempo aparece una bolita blanca de pelos y plumas en la puerta de Sara y Benjamín: era Hipólito buscando un hogar.'
	},
	{
		titulo: 'La biblioteca y el grimorio',
		palabrasClave: ['biblioteca', 'libro', 'grimorio', 'informacion'],
		contenido:
			'Para descubrir de dónde venía Hipólito, los hermanos fueron a la biblioteca. Allí encontraron el "Grimorio de animales fantásticos", un libro muy antiguo con pistas sobre criaturas mágicas.'
	},
	{
		titulo: 'El origen de Hipólito',
		palabrasClave: ['siete islas', 'origen', 'lugar'],
		contenido:
			'El grimorio menciona que Hipólito proviene de la Antigua República de las Siete Pequeñas Islas, un archipiélago mágico conectado por puentes donde habitan criaturas extraordinarias.'
	},
	{
		titulo: 'Mariposas amistosas',
		palabrasClave: ['mariposas', 'azules', 'nariz'],
		contenido:
			'Alrededor de Hipólito revolotean mariposas azules que le dan besitos en la nariz. Es un detalle tierno que muestra lo especial y amable que es esta criatura.'
	},
	{
		titulo: 'La casa como pista',
		palabrasClave: ['pista', 'aterrizaje', 'casa', 'vuelo'],
		contenido:
			'Como Hipólito está aprendiendo a volar, la casa de Sara y Benjamín se transforma en una pista de aterrizaje para practicar despegues y aterrizajes con seguridad.'
	},
	{
		titulo: 'Los mordiscos curiosos',
		palabrasClave: ['libro', 'comio', 'merienda'],
		contenido:
			'Hipólito es tan curioso que, mientras los hermanos leían, se comió el libro entero y también su merienda. ¡Los perros-dragones tienen un gran apetito por el conocimiento y por galletitas!'
	},
	{
		titulo: 'Por qué lo adoptan',
		palabrasClave: ['adoptar', 'familia', 'decision'],
		contenido:
			'Sara y Benjamín deciden adoptar a Hipólito porque entienden que necesita una familia que lo quiera y le ayude a descubrir sus poderes. Prometen cuidarlo y enseñarle todo lo que saben.'
	}
];

const RESUMEN_BASE = 'Hipólito, mi perro-dragón es una historia sobre dos hermanos, Sara y Benjamín, que adoptan a una criatura mágica llamada Hipólito. Juntos investigan su origen, visitan la biblioteca y aprenden sobre las Siete Islas mientras lo ayudan a dominar el vuelo.';

const PALABRAS_EMOCION = {
	alegria: ['feliz', 'bien', 'genial', 'contento', 'contenta', 'alegre', 'emocionado', 'emocionada', 'gracias'],
	duda: ['no se', 'nose', 'duda', 'confundido', 'confundida', 'no entiendo', 'no recuerdo'],
	preocupacion: ['miedo', 'preocupado', 'preocupada', 'triste', 'mal', 'nervioso', 'nerviosa'],
	entusiasmo: ['quiero saber', 'cuentame', 'wow', 'increible', 'asombroso']
};

const OBJETIVOS_POR_TURNO = [
	'romper el hielo y garantizar que el niño se sienta acompañado',
	'reforzar detalles clave del cuento de Hipólito',
	'conectar la historia con experiencias e ideas del niño',
	'invitar a la imaginación y la creatividad a partir del cuento'
];

export class ProfesoraVirtual {
	constructor() {
		this.ia = new IAConversacional({
			apiKey: CONFIG.GROQ_API_KEY,
			modelo: CONFIG.MODELO
		});
		this.historial = [];
		this.turno = 0;
		this.sesionIniciada = false;
		this.onEstado = () => {};
		this.entradasContextoActual = [];
		this.ultimaPregunta = null;
		this.preguntasRealizadas = new Set(); // Track de TODAS las preguntas hechas
	}

	asignarNotificador(handler) {
		this.onEstado = typeof handler === 'function' ? handler : () => {};
	}

	async inicializar(opciones = {}) {
		if (opciones.onEstado) {
			this.asignarNotificador(opciones.onEstado);
		}

		this.onEstado('Conectando con la profesora virtual...');
		await this.ia.cargarModelo((mensaje) => this.onEstado(mensaje));

		this.sesionIniciada = true;
		const bienvenida = this.crearBienvenida();
		this.registrarTurno('assistant', bienvenida);
		return bienvenida;
	}

	crearBienvenida() {
		return '¡Hola! 👋 Soy Valentina, tu profesora virtual. Me encanta conversar sobre la aventura de Hipólito. Contame, ¿qué es lo que más recuerdas del cuento o qué te gustaría descubrir hoy?';
	}

	registrarTurno(rol, contenido) {
		this.historial.push({ rol, contenido, timestamp: new Date().toISOString() });
	}

	async procesarRespuesta(respuestaEstudiante) {
		if (!this.sesionIniciada) {
			await this.inicializar();
		}

		this.turno += 1;
		this.registrarTurno('user', respuestaEstudiante);

		// Detecta intención para orientar a la IA (sin atajos heurísticos).
		const intencion = this.detectaAventurasOPreguntas(respuestaEstudiante) ? 'preguntas' : 'conversacion';

		const emocion = this.detectarEmocion(respuestaEstudiante);
		const objetivo = this.definirObjetivo();
		const contexto = this.buscarContexto(respuestaEstudiante);

		try {
			// Usar la IA real (Groq API) para respuestas inteligentes
			console.log('🤖 Consultando a la IA...');
			
			let respuestaIA = await this.ia.generarRespuesta({
				historial: this.historial,
				mensajeActual: respuestaEstudiante,
				contexto,
				emocion,
				objetivo,
				intencion,
				ultimaPregunta: this.ultimaPregunta
			});

			console.log('✅ Respuesta de IA recibida:', respuestaIA);

			// Validar que la respuesta de la IA sea buena
			if (this.esRespuestaDefectuosa(respuestaIA)) {
				console.warn('⚠️ Respuesta defectuosa, usando fallback');
				respuestaIA = this.generarRespuestaConContexto(respuestaEstudiante, contexto);
			}
			
			// Verificar que NO repita preguntas
			const preguntaEnRespuesta = this.extraerUltimaPregunta(respuestaIA);
			if (preguntaEnRespuesta && this.yaHizoPreguntaSimilar(preguntaEnRespuesta)) {
				console.warn('⚠️ IA repitió pregunta, reemplazando con pregunta nueva');
				// Quitar la pregunta repetida y agregar una nueva
				const sinPregunta = respuestaIA.replace(/¿[^?]+\?/g, '').trim();
				const preguntaNueva = this.sugerirPreguntaConcreta();
				respuestaIA = `${sinPregunta} ${preguntaNueva}?`;
			}

			const respuestaFinal = this.enriquecerRespuesta(respuestaIA, contexto);
			this.registrarTurno('assistant', respuestaFinal);
			
			// Extraer y guardar la pregunta para evitar repeticiones
			const pregunta = this.extraerUltimaPregunta(respuestaFinal);
			if (pregunta) {
				this.ultimaPregunta = pregunta;
				this.preguntasRealizadas.add(this.normalizarPregunta(pregunta));
				console.log('📝 Pregunta registrada:', pregunta);
				console.log('📊 Total preguntas hechas:', this.preguntasRealizadas.size);
			}
			
			return respuestaFinal;
		} catch (error) {
			// Mensajes específicos según tipo de error
			if (error.message === 'RATE_LIMIT_EXCEEDED') {
				console.error('⚠️ Límite de Groq API alcanzado, usando fallback');
			} else {
				console.error('❌ Error con IA, usando fallback:', error);
			}
			
			// Fallback inteligente si la API falla
			const respuestaIA = this.generarRespuestaConContexto(respuestaEstudiante, contexto);
			const respuestaFinal = this.enriquecerRespuesta(respuestaIA, contexto);
			this.registrarTurno('assistant', respuestaFinal);
			
			// Extraer y guardar la pregunta para evitar repeticiones
			const pregunta = this.extraerUltimaPregunta(respuestaFinal);
			if (pregunta) {
				this.ultimaPregunta = pregunta;
				this.preguntasRealizadas.add(this.normalizarPregunta(pregunta));
			}
			
			return respuestaFinal;
		}
	}

	buscarContexto(textoUsuario) {
		const limpio = this.normalizar(textoUsuario);
		const puntajes = CONOCIMIENTO_HIPOLITO.map((entrada) => {
			const coincidencias = entrada.palabrasClave.reduce((total, palabra) => {
				return limpio.includes(palabra) ? total + 1 : total;
			}, 0);
			return { entrada, puntaje: coincidencias };
		});

		this.entradasContextoActual = puntajes
			.filter(({ puntaje }) => puntaje > 0)
			.sort((a, b) => b.puntaje - a.puntaje)
			.slice(0, 2)
			.map(({ entrada }) => entrada);

		if (this.entradasContextoActual.length === 0) {
			this.entradasContextoActual = [CONOCIMIENTO_HIPOLITO[0]];
		}

		// Solo el primer detalle relevante, no todos.
		return this.entradasContextoActual[0].contenido;
	}

	detectarEmocion(texto) {
		const normalizado = this.normalizar(texto);
		for (const [emocion, palabras] of Object.entries(PALABRAS_EMOCION)) {
			if (palabras.some((palabra) => normalizado.includes(palabra))) {
				return emocion;
			}
		}
		return 'curiosa';
	}

	definirObjetivo() {
		if (this.turno <= 1) return OBJETIVOS_POR_TURNO[0];
		if (this.turno <= 3) return OBJETIVOS_POR_TURNO[1];
		if (this.turno <= 6) return OBJETIVOS_POR_TURNO[2];
		return OBJETIVOS_POR_TURNO[3];
	}

	enriquecerRespuesta(respuesta, contexto) {
		if (!respuesta) {
			const preguntaConcreta = this.sugerirPreguntaConcreta();
			return `Mmm, interesante. ${preguntaConcreta}?`;
		}

		const incluyePregunta = /\?/.test(respuesta);
		
		// Si no hay pregunta, añadimos una concreta.
		if (!incluyePregunta) {
			const preguntaConcreta = this.sugerirPreguntaConcreta();
			return `${respuesta} ${preguntaConcreta}?`;
		}

		// Evita preguntas meta; si detecta una, la sustituye por una pregunta concreta.
		const metaPattern = /(que parte te gustaria|que te gustaria saber|que mas te gustaria|volvamos a leer)/i;
		if (metaPattern.test(respuesta)) {
			const preguntaConcreta = this.sugerirPreguntaConcreta();
			// Reemplaza toda la pregunta meta.
			const antesPreg = respuesta.split(/[¿?]/)[0];
			return `${antesPreg.trim()} ${preguntaConcreta}?`;
		}

		return respuesta;
	}

	esRespuestaDefectuosa(texto) {
		if (!texto) return true;
		const limpio = texto.trim().toLowerCase();
		if (limpio.length < 10) return true;
		const frasesDefectuosas = [
			'perdón, me quedé pensando',
			'deja que lo piense',
			'no estoy seguro',
			'no puedo responder',
			'no tengo información'
		];
		return frasesDefectuosas.some((fragmento) => limpio.includes(fragmento));
	}

	reiniciarSesion() {
		this.historial = [];
		this.turno = 0;
		this.sesionIniciada = true;
		const saludo = this.crearBienvenida();
		this.registrarTurno('assistant', saludo);
		return saludo;
	}

	limpiarConversacion() {
		this.historial = [];
		this.turno = 0;
		this.sesionIniciada = false;
	}

	obtenerProgreso() {
		return {
			turnos: this.turno,
			historial: this.historial.slice(-10)
		};
	}

	generarRespuestaConContexto(mensajeUsuario, contexto) {
		// Sistema inteligente que usa contexto real del cuento
		console.log('💬 Generando respuesta inteligente para:', mensajeUsuario);
		
		const mensajeLimpio = this.normalizar(mensajeUsuario);
		
		// Detectar si el niño dice que NO sabe algo
		const noSabe = /^(no|nose|nada|ni idea|que|qué|huh|eh)/.test(mensajeLimpio);
		
		if (noSabe) {
			// El niño no sabe, le damos la respuesta del contexto
			if (contexto && contexto.length > 20) {
				const primeraOracion = contexto.split('.')[0] + '.';
				const pregunta = this.sugerirPreguntaConcreta();
				return `No pasa nada, te cuento: ${primeraOracion} ${pregunta}`;
			}
			const pregunta = this.sugerirPreguntaConcreta();
			return `Está bien, sigamos adelante. ${pregunta}`;
		}
		
		// Si tenemos contexto relacionado, lo usamos para confirmar
		if (contexto && contexto.length > 20) {
			// Extraer primera oración del contexto
			const primeraOracion = contexto.split('.')[0] + '.';
			const respuestas = [
				`¡Exacto! ${primeraOracion}`,
				`¡Muy bien! ${primeraOracion}`,
				`¡Qué buena memoria! ${primeraOracion}`,
				`Sí, así es. ${primeraOracion}`
			];
			const respuestaConContexto = respuestas[Math.floor(Math.random() * respuestas.length)];
			const pregunta = this.sugerirPreguntaConcreta();
			return `${respuestaConContexto} ${pregunta}`;
		}
		
		// Respuestas generales si no hay contexto específico
		const respuestasGenerales = [
			`¡Me encanta que te acuerdes de Hipólito! Es un perro-dragón con alas blancas.`,
			`Hipólito tiene aventuras increíbles. ¿Sabías que tiene una cicatriz misteriosa?`,
			`Es una historia hermosa. Sara y Benjamín cuidan muy bien a Hipólito.`
		];
		const respuestaGeneral = respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)];
		const pregunta = this.sugerirPreguntaConcreta();
		return `${respuestaGeneral} ${pregunta}`;
	}

	obtenerEstadisticas() {
		return {
			sesionCompleta: false,
			progreso: this.obtenerProgreso(),
			emocionActual: this.detectarEmocion(this.historial.at(-1)?.contenido ?? ''),
			historial: this.historial,
			ultimaPregunta: this.ultimaPregunta
		};
	}

	normalizar(texto) {
		return texto
			.toLowerCase()
			.normalize('NFD')
			.replace(/[^a-z\s]/g, '')
			.replace(/\s+/g, ' ') 
			.trim();
	}
	sugerirPreguntaConcreta() {
		const banco = [
			'¿De qué color eran las mariposas que revoloteaban a Hipólito',
			'¿Cómo se llamaba el libro antiguo que encontraron en la biblioteca',
			'¿A dónde fueron Sara y Benjamín para investigar a Hipólito',
			'¿De qué lugar mágico dice el grimorio que proviene Hipólito',
			'¿Qué detalle curioso tenía el lomo de Hipólito',
			'¿Quién encontró a Hipólito primero: Sara o Benjamín',
			'¿En qué día especial apareció Hipólito en la puerta',
			'¿Para qué usaban la casa Sara y Benjamín cuando Hipólito practicaba',
			'¿Qué se comió Hipólito mientras los hermanos leían',
			'¿Cuántas islas menciona el grimorio en el origen de Hipólito',
			'¿Qué características especiales tienen las alas de Hipólito',
			'¿Por qué la casa se convirtió en pista de aterrizaje',
			'¿Qué encontraron Sara y Benjamín en la biblioteca',
			'¿Cómo era el día cuando apareció Hipólito',
			'¿Qué comió Hipólito además del libro'
		];
		
		// Filtrar preguntas que NO se han hecho aún
		const preguntasNoRealizadas = banco.filter((pregunta) => {
			return !this.yaHizoPreguntaSimilar(pregunta);
		});
		
		console.log(`💡 Preguntas disponibles: ${preguntasNoRealizadas.length}/${banco.length}`);
		
		// Si quedan preguntas nuevas, usar esas
		const lista = preguntasNoRealizadas.length > 0 ? preguntasNoRealizadas : banco;
		
		// Si se agotaron TODAS, reiniciar el set
		if (preguntasNoRealizadas.length === 0) {
			console.log('🔄 Reiniciando banco de preguntas');
			this.preguntasRealizadas.clear();
		}
		
		const eleccion = lista[Math.floor(Math.random() * lista.length)];
		return eleccion;
	}

	// --- Intención "preguntas" para orientar a la IA (sin atajos) ---
	detectaAventurasOPreguntas(texto) {
		const t = this.normalizar(texto);
		const triggers = ['aventura', 'aventuras', 'pregunta', 'jugar', 'trivia', 'quiz'];
		return triggers.some((w) => t.includes(w));
	}

	extraerUltimaPregunta(texto) {
		if (!texto) return null;
		// Extrae la última oración con signo de interrogación.
		const oraciones = texto.split(/(?<=[\?¡!\.])\s+/).filter(Boolean);
		const ultima = [...oraciones].reverse().find((s) => s.includes('?'));
		return ultima ?? null;
	}

	normalizarPregunta(pregunta) {
		// Normaliza la pregunta para comparación (quita acentos, minúsculas, signos)
		return this.normalizar(pregunta).replace(/[¿?]/g, '').trim();
	}

	yaHizoPreguntaSimilar(preguntaNueva) {
		const normalizada = this.normalizarPregunta(preguntaNueva);
		
		// Buscar si ya existe una pregunta muy similar
		for (const preguntaAnterior of this.preguntasRealizadas) {
			// Calcular similitud: contar palabras en común
			const palabrasNuevas = normalizada.split(' ').filter(p => p.length > 3);
			const palabrasAnteriores = preguntaAnterior.split(' ').filter(p => p.length > 3);
			
			const palabrasComunes = palabrasNuevas.filter(p => palabrasAnteriores.includes(p));
			const similitud = palabrasComunes.length / Math.max(palabrasNuevas.length, palabrasAnteriores.length);
			
			// Si hay más de 50% de palabras en común, es repetida
			if (similitud > 0.5) {
				console.log('⚠️ Pregunta similar ya realizada:', preguntaAnterior);
				return true;
			}
		}
		
		return false;
	}
}

if (typeof window !== 'undefined') {
	window.ProfesoraVirtual = ProfesoraVirtual;
}
