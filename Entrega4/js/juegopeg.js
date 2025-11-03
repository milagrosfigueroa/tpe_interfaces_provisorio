// ====================================================================
// JUEGO PEG: Implementación de la lógica del juego de solitario Peg.
// ====================================================================

// --- CONSTANTES GLOBALES ---
const CENTRO_X = 960;
const CENTRO_Y = 540;
const ESPACIADO = 160;
const TAMANO_FICHA = 130;

// Rutas de las imágenes 
const RUTA_FICHA_FUEGO = "./img/pegejecucion/fichafuego.png";
const RUTA_FICHA_AGUA = "./img/pegejecucion/fichaagua.png";

// ====================================================================
// CLASE TEMPORIZADOR
// Gestiona la cuenta regresiva y el estado de urgencia visual.
// ====================================================================
class Temporizador {
    /**
     * @param {string} displayId - ID del elemento HTML donde se muestra el tiempo.
     * @param {number} [tiempoInicial=120] - Tiempo inicial en segundos.
     */
    constructor(displayId, tiempoInicial = 120) {
        this.display = document.getElementById(displayId);
        this.tiempoInicial = tiempoInicial;
        this.tiempoRestante = tiempoInicial;
        this.intervalo = null;
        this.finalizadoCallback = null;
        this.actualizarDisplay();
    }

    /**
     * Actualiza el texto del display y aplica la clase de urgencia (rojo) si es necesario.
     */
    actualizarDisplay() {
        const minutos = Math.floor(this.tiempoRestante / 60).toString().padStart(2, "0");
        const segundos = (this.tiempoRestante % 60).toString().padStart(2, "0");
        this.display.textContent = `${minutos}:${segundos}`;
        
        // LÓGICA DE CAMBIO DE COLOR (Urgencia visual)
        if (this.tiempoRestante <= 10 && this.tiempoRestante > 0) {
            this.display.classList.add('temporizador-urgencia');
        } else {
            this.display.classList.remove('temporizador-urgencia');
        }
    }

    /** Inicia la cuenta regresiva. */
    iniciar() {
        if (this.intervalo) clearInterval(this.intervalo);
        this.actualizarDisplay();

        this.intervalo = setInterval(() => {
            if (this.tiempoRestante > 0) {
                this.tiempoRestante--;
                this.actualizarDisplay();
            } else {
                this.detener();
                if (this.finalizadoCallback) this.finalizadoCallback();
            }
        }, 1000);
    }

    /** Pausa la cuenta regresiva. */
    pausar() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }

    /** Reanuda la cuenta regresiva. */
    reanudar() {
        if (!this.intervalo && this.tiempoRestante > 0) {
            this.iniciar();
        }
    }

    /** Reinicia el tiempo al valor inicial y detiene el contador. */
    reiniciar() {
        this.pausar();
        this.tiempoRestante = this.tiempoInicial;
        this.actualizarDisplay();
    }

    /** Detiene la cuenta regresiva completamente. */
    detener() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }

    /**
     * Define una función de callback a ejecutar cuando el tiempo llega a cero.
     * @param {function} callback - Función a ejecutar.
     */
    onFinalizado(callback) {
        this.finalizadoCallback = callback;
    }
}

// ====================================================================
// CLASE PANTALLA
// Controla la visibilidad de las diferentes vistas del juego.
// ====================================================================
class Pantalla {
    constructor() {
        this.pantallaInicio = document.querySelector(".pantalla-inicio");
        this.pantallaJuego = document.querySelector(".pantalla-juego");
        this.pantallaFinal = document.querySelector(".pantalla-final");
        this.pantallaInstrucciones = document.querySelector(".pantalla-instrucciones");
    }

    /** Muestra la pantalla de inicio y oculta las demás. */
    mostrarInicio() {
        this.pantallaInicio.classList.add("activo");
        this.pantallaJuego.classList.remove("activo");
        this.pantallaFinal.classList.remove("activo");
        this.pantallaInstrucciones.classList.remove("activo");
    }

    /** Muestra la pantalla de juego y oculta las demás. */
    mostrarJuego() {
        this.pantallaInicio.classList.remove("activo");
        this.pantallaJuego.classList.add("activo");
        this.pantallaFinal.classList.remove("activo");
        this.pantallaInstrucciones.classList.remove("activo");
    }

    /** Muestra la pantalla de final de juego y oculta las demás. */
    mostrarFinal() {
        this.pantallaInicio.classList.remove("activo");
        this.pantallaJuego.classList.remove("activo");
        this.pantallaFinal.classList.add("activo");
        this.pantallaInstrucciones.classList.remove("activo");
    }

    /** Muestra la pantalla de instrucciones y oculta las demás. */
    mostrarInstrucciones() { 
        this.pantallaInicio.classList.remove("activo");
        this.pantallaJuego.classList.remove("activo");
        this.pantallaFinal.classList.remove("activo");
        if (this.pantallaInstrucciones) this.pantallaInstrucciones.classList.add("activo");
    }
}

// ====================================================================
// CLASE TABLERO
// Dibuja el fondo del tablero en el canvas.
// ====================================================================
class Tablero {
    /**
     * @param {string} canvasId - ID del elemento Canvas.
     * @param {string} rutaImagen - Ruta de la imagen del tablero.
     */
    constructor(canvasId, rutaImagen) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
        this.imagen.onload = () => this.dibujarTablero();
    }

    /** Dibuja la imagen del tablero en el canvas. */
    dibujarTablero() {
        const { ctx, canvas, imagen } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
    }
}

// ====================================================================
// CLASE FICHA
// Representa una ficha de juego (Fuego o Agua).
// ====================================================================
class Ficha {
    /**
     * @param {number} x - Posición X central.
     * @param {number} y - Posición Y central.
     * @param {string} rutaImagen - Ruta de la imagen de la ficha.
     * @param {string} tipo - Tipo de ficha ("fuego" o "agua").
     */
    constructor(x, y, rutaImagen, tipo) {
        // La posición (x, y) se ajusta para ser la esquina superior izquierda.
        this.x = x - TAMANO_FICHA / 2;
        this.y = y - TAMANO_FICHA / 2;
        this.ancho = TAMANO_FICHA;
        this.alto = TAMANO_FICHA;
        this.tipo = tipo; // "fuego" o "agua"
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
    }

    /**
     * Dibuja la ficha en el contexto del canvas.
     * @param {CanvasRenderingContext2D} ctx - Contexto 2D del canvas.
     */
    dibujar(ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
    }
}

// ====================================================================
// CLASE JUEGO
// Orquesta toda la lógica del juego Peg.
// ====================================================================
class Juego {
    /**
     * @param {string} canvasId - ID del elemento Canvas.
     * @param {string} rutaImagen - Ruta de la imagen del tablero.
     */
    constructor(canvasId, rutaImagen) {
        this.tablero = new Tablero(canvasId, rutaImagen);
        this.pantallas = new Pantalla();
        this.fichas = [];
        this.posicionesFijas = this.generarPosiciones();
        this.fichaActiva = null; // Ficha que está siendo arrastrada
        this.origenActivo = null; // Posición fija de la ficha arrastrada
        this.posicionInicialX = 0;
        this.posicionInicialY = 0;
        this.pausado = false; 

        // Control de animación (Hints)
        this.hintAnimationTime = 0;
        this.hintAnimationId = null; 
        
        // Control de hover (Resaltado de posibles movimientos)
        this.fichasHover = null; 

        this.inicializarFichas();

        this.botonJugar = document.querySelector("#botonIniciar");
        this.botonSalir = document.querySelector("#botonSalir");
        this.botonPausar = document.getElementById("btnPausar"); 
        this.botonReiniciar = document.getElementById("btnReiniciar");
        this.botonInstrucciones = document.getElementById("btn-instrucciones");

        // Asignación de Eventos de Interfaz
        if (this.botonInstrucciones)
            this.botonInstrucciones.addEventListener("click", () => this.irAInstrucciones());
        // El evento botonVolverInicio no estaba definido, se deja la referencia a la salida.
        // if (this.botonVolverInicio)
        //     this.botonVolverInicio.addEventListener("click", () => this.volverInicio());

        if (this.botonJugar)
            this.botonJugar.addEventListener("click", () => this.iniciarJuego());

        if (this.botonSalir)
            this.botonSalir.addEventListener("click", () => this.volverInicio());

        if (this.botonPausar)
            this.botonPausar.addEventListener("click", () => this.togglePausa());

        if (this.botonReiniciar)
            this.botonReiniciar.addEventListener("click", () => this.reiniciarJuego());

        this.tablero.imagen.onload = () => this.dibujarTodo();

        // Eventos de interacción con el canvas
        this.tablero.canvas.addEventListener("mousedown", (e) => this.presionarMouse(e));
        this.tablero.canvas.addEventListener("mousemove", (e) => this.moverMouse(e));
        document.addEventListener("mouseup", (e) => this.soltarMouse(e));
        
        // [NUEVO] Evento para la lógica de resaltar fichas al pasar el mouse
        this.tablero.canvas.addEventListener("mousemove", (e) => this.hoverFichas(e));


        // Temporizador
        this.temporizador = new Temporizador("temporizadorDisplay", 120);
        this.temporizador.onFinalizado(() => this.terminarJuego());

        // LÓGICA DE MOVIMIENTOS
        this.movimientosRestantes = 45; 
        this.movimientosDisplay = document.getElementById("movimientosRestantes"); 
        this.actualizarContador(); 
    }
    
    // ===================================
    // Lógica de Juego y Tablero
    // ===================================

    /** Actualiza el display de movimientos restantes en el HTML. */
    actualizarContador() {
        if (this.movimientosDisplay) {
            this.movimientosDisplay.textContent = this.movimientosRestantes;
        }
    }

    /** Alterna el estado de pausa del juego, deteniendo el tiempo y la animación. */
    togglePausa() {
        if (!this.pausado) {
            this.pausado = true;
            this.temporizador.pausar();
            this.botonPausar.classList.add("activo");
            this.botonPausar.textContent = "Reanudar";
            
            // Detiene la animación si está activa al pausar
            if (this.hintAnimationId) {
                cancelAnimationFrame(this.hintAnimationId);
                this.hintAnimationId = null;
            }

        } else {
            this.pausado = false;
            this.temporizador.reanudar();
            this.botonPausar.classList.remove("activo");
            this.botonPausar.textContent = "Pausar";
        }
        this.dibujarTodo();
    }

    /** Reinicia el juego, reseteando tiempo, fichas y movimientos. */
    reiniciarJuego() {
        this.pausado = false;
        if (this.botonPausar) {
            this.botonPausar.classList.remove("activo");
            this.botonPausar.textContent = "Pausar";
        }
        
        // Asegura que no haya animación corriendo
        if (this.hintAnimationId) {
            cancelAnimationFrame(this.hintAnimationId);
            this.hintAnimationId = null;
        }

        this.inicializarFichas();
        this.movimientosRestantes = 45; 
        this.actualizarContador(); 

        this.temporizador.reiniciar(); 
        this.temporizador.iniciar(); 

        if (this.tablero.imagen.complete) {
            this.dibujarTodo();
        } else {
            this.tablero.imagen.onload = () => this.dibujarTodo();
        }
    }

    /** * Genera la lista de coordenadas fijas de las celdas del tablero.
     * @returns {Array<Object>} Lista de objetos con propiedades de posición.
     */
    generarPosiciones() {
        const posiciones = [];
        for (let row = -3; row <= 3; row++) {
            for (let col = -3; col <= 3; col++) {
                // Excluye las 4 esquinas del tablero
                const isCorner = (Math.abs(row) >= 2 && Math.abs(col) >= 2);
                if (!isCorner) {
                    const x = CENTRO_X + col * ESPACIADO;
                    const y = CENTRO_Y + row * ESPACIADO;
                    posiciones.push({ id: `${row}_${col}`, row, col, x, y, tieneFicha: true, ficha: null });
                }
            }
        }
        // El centro (0_0) se inicializa vacío
        const centro = posiciones.find(p => p.id === '0_0');
        if (centro) centro.tieneFicha = false;
        return posiciones;
    }

    /** Crea y posiciona las fichas iniciales en el tablero. */
    inicializarFichas() {
        let contadorFichas = 0;
        this.fichas = [];
        this.posicionesFijas.forEach(pos => {
            pos.ficha = null; 
            pos.tieneFicha = pos.id !== '0_0'; // Centro vacío
            if (pos.tieneFicha) {
                let tipo = contadorFichas % 2 === 0 ? "fuego" : "agua";
                let ruta = tipo === "fuego" ? RUTA_FICHA_FUEGO : RUTA_FICHA_AGUA;
                const ficha = new Ficha(pos.x, pos.y, ruta, tipo);
                pos.ficha = ficha;
                this.fichas.push(ficha);
                contadorFichas++;
            }
        });
    }

    /** Dibuja el tablero de fondo y todas las fichas en el canvas. */
    dibujarTodo() {
        this.tablero.dibujarTablero();
        this.fichas.forEach(f => f.dibujar(this.tablero.ctx));
    }

    /** Muestra la pantalla de juego y comienza el juego. */
    iniciarJuego() {
        this.pantallas.mostrarJuego();
        this.reiniciarJuego();
        this.temporizador.iniciar();
    }

    /** Vuelve a la pantalla de inicio. */
    volverInicio() {
        this.temporizador.reiniciar();
        if (this.botonPausar) {
            this.botonPausar.classList.remove("activo");
            this.botonPausar.textContent = "Pausar";
        }
        this.pantallas.mostrarInicio();
    }

    /** Muestra la pantalla de instrucciones. */
    irAInstrucciones() {
        this.pantallas.mostrarInstrucciones();
    }

    /** Muestra la pantalla de inicio al cargar. */
    iniciar() {
        this.pantallas.mostrarInicio();
        if (this.tablero.imagen.complete) this.dibujarTodo();
    }
    
    // ===================================
    // Lógica de Movimiento y Validación
    // ===================================
    
    /**
     * Verifica si un movimiento es válido (salto de dos celdas sobre otra ficha).
     * @param {Object} origen - Posición de origen.
     * @param {Object} destino - Posición de destino.
     * @returns {boolean} True si el movimiento es legal.
     */
    movimientoValido(origen, destino) {
        if (!origen || !destino) return false;
        if (destino.tieneFicha) return false; // Destino debe estar vacío

        const dx = destino.col - origen.col;
        const dy = destino.row - origen.row;

        // Debe ser un salto de 2 casillas horizontal o vertical
        if ((Math.abs(dx) === 2 && dy === 0) || (Math.abs(dy) === 2 && dx === 0)) {
            const intermedia = this.obtenerPosicionMedia(origen, destino);
            // La posición intermedia debe existir y tener una ficha
            return intermedia && intermedia.tieneFicha;
        }

        return false;
    }

    /**
     * Obtiene la posición intermedia entre dos celdas.
     * @param {Object} origen - Posición de origen.
     * @param {Object} destino - Posición de destino.
     * @returns {Object | null} Posición intermedia o null si no existe.
     */
    obtenerPosicionMedia(origen, destino) {
        const filaMedia = (origen.row + destino.row) / 2;
        const colMedia = (origen.col + destino.col) / 2;
        // La posición debe ser un punto de la grilla (col y row deben ser enteros)
        if (filaMedia % 1 !== 0 || colMedia % 1 !== 0) return null;
        
        return this.posicionesFijas.find(p => p.row === filaMedia && p.col === colMedia);
    }
    
    /**
     * Verifica si una ficha en una posición dada tiene al menos un movimiento legal posible.
     * @param {Object} origen - Posición de la ficha a verificar.
     * @returns {boolean} True si puede saltar a cualquier destino.
     */
    checkMoveExists(origen) {
        if (!origen || !origen.tieneFicha) return false;
        
        for (let destino of this.posicionesFijas) {
            if (this.movimientoValido(origen, destino)) {
                return true;
            }
        }
        return false;
    }

    // ===================================
    // Dibujo, Hints y Animación
    // ===================================

    /**
     * Dibuja un borde de resaltado alrededor de una ficha.
     * @param {Ficha} ficha - Ficha a resaltar.
     * @param {string} [color=null] - Color de resaltado (e.g., "yellow", "red"). Si es null, usa el color del tipo de ficha.
     */
    resaltarFicha(ficha, color = null) {
        const ctx = this.tablero.ctx;
        
        // Determina el color del borde (hover, comer o selección)
        let colorBorde;
        if (color) {
            colorBorde = color;
        } else {
            // Color por defecto (selección: naranja/azul)
            colorBorde = ficha.tipo === "fuego" ? "orange" : ficha.tipo === "agua" ? "blue" : "yellow";
        }

        ctx.strokeStyle = colorBorde;
        ctx.lineWidth = 5;

        const radio = TAMANO_FICHA / 2 + 5;
        const centroX = ficha.x + TAMANO_FICHA / 2;
        const centroY = ficha.y + TAMANO_FICHA / 2;

        ctx.beginPath();
        ctx.arc(centroX, centroY, radio, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
    }

    /** Muestra indicadores visuales de destino válido y resaltado de la ficha a "comer". */
    mostrarHints() {
        if (this.pausado || !this.origenActivo) return;

        this.posicionesFijas.forEach(destino => {
            if (this.movimientoValido(this.origenActivo, destino)) {
                
                // 1. Resaltar la ficha intermedia (la que será removida)
                const intermedia = this.obtenerPosicionMedia(this.origenActivo, destino);
                if (intermedia && intermedia.ficha) {
                    this.resaltarFicha(intermedia.ficha, "rgba(255, 0, 0, 0.7)"); // Borde rojo
                }
                
                // 2. Dibujar el hint animado en el destino
                this.dibujarHint(destino);
            }
        });
    }

    /**
     * Dibuja un pequeño círculo como indicador de destino válido, con animación de pulso.
     * @param {Object} posicion - Posición donde dibujar el hint.
     */
    dibujarHint(posicion) {
        const ctx = this.tablero.ctx;
        
        // Cálculo de escala basado en tiempo para el efecto de pulso (Math.sin)
        const escala = 0.9 + Math.sin(this.hintAnimationTime / 150) * 0.2; 
        
        ctx.fillStyle = "rgba(74, 242, 45, 0.83)"; // Verde semi-transparente
        ctx.beginPath();
        
        const radioHint = (TAMANO_FICHA / 4) * escala; // Aplica el pulso al radio
        
        ctx.arc(posicion.x, posicion.y, radioHint, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    /** Inicia el bucle de animación para el resaltado de la ficha activa y los hints. */
    iniciarAnimacionHints() {
        if (this.hintAnimationId) return; // Evita iniciar múltiples bucles

        const animate = (timestamp) => {
            // 1. Actualiza el tiempo para el pulso
            this.hintAnimationTime = timestamp; 
            
            // 2. Redibuja todo el fondo y las fichas estáticas
            this.dibujarTodo();
            
            // 3. Redibuja los elementos dinámicos
            if (this.fichaActiva) {
                this.resaltarFicha(this.fichaActiva); 
                this.mostrarHints(); 
                
                // 4. Repite el bucle
                this.hintAnimationId = requestAnimationFrame(animate);
            } else {
                // 5. Se detiene si la ficha activa es null
                cancelAnimationFrame(this.hintAnimationId);
                this.hintAnimationId = null;
                this.dibujarTodo(); // Redibuja final para limpiar
            }
        };

        this.hintAnimationId = requestAnimationFrame(animate);
    }
    
    // ===================================
    // Manejo de Interacción (Mouse/Touch)
    // ===================================
    
    /**
     * Maneja el evento mousemove para resaltar fichas seleccionables (hover).
     * @param {MouseEvent} e - Evento de mouse.
     */
    hoverFichas(e) {
        // Ejecuta solo si NO se está arrastrando una ficha, NO está pausado y NO hay animación (arrastre)
        if (this.fichaActiva || this.pausado || this.hintAnimationId) return; 

        const rect = this.tablero.canvas.getBoundingClientRect();
        const escalaX = this.tablero.canvas.width / rect.width;
        const escalaY = this.tablero.canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * escalaX;
        const mouseY = (e.clientY - rect.top) * escalaY;

        let nuevaFichaHover = this.fichas.find(f =>
            mouseX >= f.x && mouseX <= f.x + f.ancho &&
            mouseY >= f.y && mouseY <= f.y + f.alto
        );
        
        // Si el estado de hover ha cambiado, redibuja para aplicar o quitar el resaltado
        if (nuevaFichaHover !== this.fichasHover) {
            this.fichasHover = nuevaFichaHover;
            this.dibujarTodo(); 
            
            if (this.fichasHover) {
                const origen = this.posicionesFijas.find(p => p.ficha === this.fichasHover);
                
                // Resalta en amarillo solo si la ficha tiene movimientos disponibles
                if (this.checkMoveExists(origen)) {
                    this.resaltarFicha(this.fichasHover, "rgba(255, 255, 0, 0.7)"); 
                }
            }
        }
    }

    /**
     * Maneja el evento mousedown (inicio de arrastre).
     * @param {MouseEvent} e - Evento de mouse.
     */
    presionarMouse(e) {
        if (this.pausado) return; 

        const rect = this.tablero.canvas.getBoundingClientRect();
        const escalaX = this.tablero.canvas.width / rect.width;
        const escalaY = this.tablero.canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * escalaX;
        const mouseY = (e.clientY - rect.top) * escalaY;

        // Identifica la ficha clickeada
        this.fichaActiva = this.fichas.find(f =>
            mouseX >= f.x && mouseX <= f.x + f.ancho &&
            mouseY >= f.y && mouseY <= f.y + f.alto
        );

        if (this.fichaActiva) {
            this.origenActivo = this.posicionesFijas.find(p => p.ficha === this.fichaActiva);
            this.posicionInicialX = this.fichaActiva.x;
            this.posicionInicialY = this.fichaActiva.y;
            this.fichaActiva.seleccionada = true;
            
            // Inicia el bucle de animación para gestionar el dibujo de arrastre y hints
            this.iniciarAnimacionHints(); 
        }
    }

    /**
     * Maneja el evento mousemove (arrastre de ficha).
     * @param {MouseEvent} e - Evento de mouse.
     */
    moverMouse(e) {
        if (this.pausado || !this.fichaActiva) return; 

        const rect = this.tablero.canvas.getBoundingClientRect();
        const escalaX = this.tablero.canvas.width / rect.width;
        const escalaY = this.tablero.canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * escalaX;
        const mouseY = (e.clientY - rect.top) * escalaY;

        // Mueve la ficha siguiendo el mouse
        this.fichaActiva.x = mouseX - TAMANO_FICHA / 2;
        this.fichaActiva.y = mouseY - TAMANO_FICHA / 2;

        // El redibujado se maneja en el bucle de requestAnimationFrame
    }

    /**
     * Maneja el evento mouseup (soltar ficha y validar movimiento).
     * @param {MouseEvent} e - Evento de mouse.
     */
    soltarMouse(e) {
        if (this.pausado || !this.fichaActiva) return; 

        const rect = this.tablero.canvas.getBoundingClientRect();
        const escalaX = this.tablero.canvas.width / rect.width;
        const escalaY = this.tablero.canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * escalaX;
        const mouseY = (e.clientY - rect.top) * escalaY;

        const origen = this.origenActivo;
        // Encuentra la posición de destino más cercana
        const destino = this.posicionesFijas.find(pos => {
            const dx = mouseX - pos.x;
            const dy = mouseY - pos.y;
            return Math.sqrt(dx * dx + dy * dy) < TAMANO_FICHA / 2;
        });

        let movimientoExitoso = false;

        if (destino && this.movimientoValido(origen, destino)) {
            // Ejecutar movimiento
            destino.tieneFicha = true;
            destino.ficha = this.fichaActiva;
            this.fichaActiva.x = destino.x - TAMANO_FICHA / 2;
            this.fichaActiva.y = destino.y - TAMANO_FICHA / 2;

            // Remover ficha intermedia
            const intermedia = this.obtenerPosicionMedia(origen, destino);
            if (intermedia && intermedia.ficha) {
                this.fichas = this.fichas.filter(f => f !== intermedia.ficha);
                intermedia.ficha = null;
                intermedia.tieneFicha = false;
            }

            origen.tieneFicha = false;
            origen.ficha = null;
            movimientoExitoso = true;
            
            // Descontar movimiento
            if (this.movimientosRestantes > 0) {
                this.movimientosRestantes--;
                this.actualizarContador(); 
            }
        }

        if (!movimientoExitoso) {
            // Vuelve a la posición inicial
            this.fichaActiva.x = this.posicionInicialX;
            this.fichaActiva.y = this.posicionInicialY;
        }

        this.fichaActiva.seleccionada = false;
        this.fichaActiva = null; // Esto detiene el bucle de animación
        this.origenActivo = null;

        // Revisar condiciones de fin de juego
        if (!this.hayMovimientosDisponibles() || this.fichas.length <= 1 || this.movimientosRestantes <= 0) {
            this.terminarJuego();
        }
    }

    // ===================================
    // Fin del Juego
    // ===================================

    /** Revisa si aún quedan movimientos legales en el tablero. */
    hayMovimientosDisponibles() {
        for (let pos of this.posicionesFijas) {
            if (pos.tieneFicha) {
                for (let destino of this.posicionesFijas) {
                    if (this.movimientoValido(pos, destino)) return true;
                }
            }
        }
        return false;
    }

    /** Finaliza la partida, detiene el temporizador y determina el resultado. */
    terminarJuego() {
        this.temporizador.detener();
        this.pausado = true; // Bloquea movimientos
        
        // Detiene la animación si está activa
        if (this.hintAnimationId) {
            cancelAnimationFrame(this.hintAnimationId);
            this.hintAnimationId = null;
        }

        let mensaje;
        let esVictoria = false;
        
        // Condición de Victoria: Solo queda 1 ficha
        if (this.fichas.length === 1) {
            esVictoria = true;
            mensaje = "¡Felicidades, ganaste! Lograste aislar la última ficha.";
        } 
        // Condición de Derrota: Se acabaron los movimientos
        else if (this.movimientosRestantes <= 0) {
            mensaje = "Se agotaron tus movimientos con " + this.fichas.length + " fichas.<br>¡Vuelve a intentarlo!";
        }
        // Condición de Derrota: El tiempo se agotó
        else if (this.temporizador.tiempoRestante <= 0) {
            mensaje = "El tiempo se ha agotado.<br>¡Trata de hacerlo más rápido!";
        }
        // Condición de Derrota: Sin movimientos legales (stuck)
        else {
            mensaje = `Te quedaste sin movimientos legales con ${this.fichas.length} fichas.<br>¡Sigue practicando!`;
        }

        if (this.botonPausar) this.botonPausar.classList.remove("activo"); 
        
        this.mostrarResultadoFinal(esVictoria, mensaje);
    }

    /**
     * Muestra la pantalla final con el resultado del juego.
     * @param {boolean} esVictoria - Indica si el resultado es una victoria.
     * @param {string} mensaje - Mensaje a mostrar (puede contener <br>).
     */
    mostrarResultadoFinal(esVictoria, mensaje) {
        const resultadoTitulo = document.getElementById('resultadoTitulo');
        const resultadoMensaje = document.getElementById('resultadoMensaje');
        
        if (resultadoTitulo) {
            resultadoTitulo.textContent = esVictoria ? "Victoria" : "Fin del juego"; 
            resultadoTitulo.className = esVictoria ? 'titulo-victoria' : 'titulo-derrota';
        }

        if (resultadoMensaje) {
            resultadoMensaje.innerHTML = mensaje; // Usa innerHTML para procesar <br>
        }

        this.pantallas.mostrarFinal();
    }
}


// ====================================================================
// INICIO DEL SCRIPT (PUNTO DE ENTRADA)
// ====================================================================

// Declaración de la variable global (acceso desde el HTML)
let juegoPeg; 

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar el objeto al cargar el DOM
    juegoPeg = new Juego("pegCanvas", "./img/pegejecucion/tableropeg.png");
    
    // Iniciar el juego en la pantalla de inicio
    juegoPeg.iniciar();
});

