// ===========================================
// VARIABLES GLOBALES MUTABLES (INICIALES)
// ===========================================
const JUEGO_ALTURA = 550; 
const JUEGO_ANCHO = 1100;

const GRAVEDAD = 0.5;
const IMPULSO_SALTO = -10; 

// VARIABLES DE DIFICULTAD 
let VELOCIDAD_JUEGO = 2; 
let HUECO_TUBERIA = 160; 
let INTERVALO_GENERACION = 2500; // ms

// Constantes de Diseño 
const ANCHO_TUBERIA = 60; 
const ALTURA_PICO_TUBERIA = 25; 

// NIVELES DE DIFICULTAD
const DIFICULTAD_NIVELES = [
    // [Puntaje Requerido, Nuevo Hueco, Nueva Velocidad, Nuevo Intervalo (ms)]
    { score: 10, hueco: 140, velocidad: 2.5, intervalo: 2200 },
    { score: 20, hueco: 120, velocidad: 3.0, intervalo: 1900 },
    { score: 30, hueco: 100, velocidad: 3.5, intervalo: 1600 },
    { score: 40, hueco: 90, velocidad: 4.0, intervalo: 1400 },
    
];

// ===========================================
//   CLASE PAJARO 
// ===========================================

class Pajaro {
    constructor(contenedor, sprite, x, y, anchoFrame) {
        this.contenedor = contenedor;
        this.sprite = sprite;

        this.x = x;
        this.y = y;
        this.velY = 0;

        this.gravedad = GRAVEDAD;
        this.impulso = IMPULSO_SALTO;

        this.anchoFrame = anchoFrame;
        this.frameActual = 0;
        this.estaAleteando = false;
        this.tiempoAleteo = 0;

        this.actualizarPosicionDiv();
        this.mostrarFrame(0);
    }

    actualizarPosicionDiv() {
        this.contenedor.style.left = this.x + "px";
        this.contenedor.style.top = this.y + "px";
    }

    mostrarFrame(n) {
        this.frameActual = n;
        this.sprite.style.objectPosition = `-${n * this.anchoFrame}px 0px`;
    }

    aletear() {
        this.velY = this.impulso;
        this.estaAleteando = true;
        this.tiempoAleteo = 0;
    }

    actualizar(dt) {
        this.velY += this.gravedad;
        this.y += this.velY;

        this.actualizarPosicionDiv();

        if (this.estaAleteando) {
            this.tiempoAleteo += dt;
            if (this.tiempoAleteo < 60) this.mostrarFrame(1);
            else if (this.tiempoAleteo < 120) this.mostrarFrame(2);
            else {
                this.mostrarFrame(0);
                this.estaAleteando = false;
            }
        } else {
            this.mostrarFrame(0);
        }
    }
    
    getBounds() {
        return this.contenedor.getBoundingClientRect();
    }

    haChocadoAlBorde(altoJuego) {
        const ALTURA_PAJARO = this.contenedor.offsetHeight;
        const LIMITE_INFERIOR_Y = altoJuego * 0.90; 
        
        return this.y <= 0 || (this.y + ALTURA_PAJARO) >= LIMITE_INFERIOR_Y;
    }
}


// ===========================================
//   CLASE PIPE (TUBERÍA) 
//   Usa las variables globales de dificultad (HUECO_TUBERIA, VELOCIDAD_JUEGO)
// ===========================================

class Pipe {
    constructor(x) {
        // Altura mínima del cuerpo (ej: 40px de cuerpo + 25px de pico)
        const MIN_ALTURA_SEGMENTO = 65; 
        const MAX_ALTURA_TOTAL = 325; // 300px cuerpo + 25px pico

        // Usa el HUECO_TUBERIA global (mutable)
        const alturaSuperior = Math.floor(Math.random() * (MAX_ALTURA_TOTAL - MIN_ALTURA_SEGMENTO + 1)) + MIN_ALTURA_SEGMENTO;
        const alturaInferior = JUEGO_ALTURA - alturaSuperior - HUECO_TUBERIA;

        this.element = document.createElement('div');
        this.element.classList.add('contenedor-tuberia');
        this.element.style.width = `${ANCHO_TUBERIA}px`;
        this.element.style.left = `${x}px`; 
        this.x = x; 
        this.passed = false; 

        // -------------------------
        // ESTRUCTURA TUBERÍA ARRIBA
        // -------------------------
        const tuberiaArriba = document.createElement('div');
        tuberiaArriba.classList.add('tuberia-wrapper', 'tuberia-arriba-wrapper');
        tuberiaArriba.style.height = `${alturaSuperior}px`; 
        
            const cuerpoArriba = document.createElement('div');
            cuerpoArriba.classList.add('tuberia-segmento', 'cuerpo-pipe');
            cuerpoArriba.style.height = `${alturaSuperior - ALTURA_PICO_TUBERIA}px`; 
            
            const picoArriba = document.createElement('div');
            picoArriba.classList.add('tuberia-segmento', 'pico-pipe-arriba');
            picoArriba.style.height = `${ALTURA_PICO_TUBERIA}px`;
            
        tuberiaArriba.appendChild(cuerpoArriba);
        tuberiaArriba.appendChild(picoArriba);
        
        // -------------------------
        // ESTRUCTURA TUBERÍA ABAJO
        // -------------------------
        const tuberiaAbajo = document.createElement('div');
        tuberiaAbajo.classList.add('tuberia-wrapper', 'tuberia-abajo-wrapper');
        tuberiaAbajo.style.height = `${alturaInferior}px`;
        
            const picoAbajo = document.createElement('div');
            picoAbajo.classList.add('tuberia-segmento', 'pico-pipe-abajo');
            picoAbajo.style.height = `${ALTURA_PICO_TUBERIA}px`;

            const cuerpoAbajo = document.createElement('div');
            cuerpoAbajo.classList.add('tuberia-segmento', 'cuerpo-pipe');
            cuerpoAbajo.style.height = `${alturaInferior - ALTURA_PICO_TUBERIA}px`;
            
        tuberiaAbajo.appendChild(picoAbajo);
        tuberiaAbajo.appendChild(cuerpoAbajo); 
        
        // Añadir al contenedor de la tubería
        this.element.appendChild(tuberiaArriba);
        this.element.appendChild(tuberiaAbajo);
        
        document.querySelector('.juegoFlappyContenedor').appendChild(this.element);
    }

    actualizar() {
        // Usa la VELOCIDAD_JUEGO global (mutable)
        this.x -= VELOCIDAD_JUEGO; 
        this.element.style.left = `${this.x}px`;
    }

    isOffScreen() {
        return this.x < -ANCHO_TUBERIA;
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }

    remove() {
        this.element.remove();
    }
}


// ===========================================
//   CLASE PANTALLA 
// ===========================================

class Pantalla {
    constructor(inicio, juego, instrucciones, gameOver) {
        this.inicio = inicio;
        this.juego = juego;
        this.instrucciones = instrucciones;
        this.gameOver = gameOver;
    }

    mostrarInicio() {
        this.inicio.style.display = "flex";
        this.juego.style.display = "none";
        this.instrucciones.style.display = "none";
        this.gameOver.style.display = "none";
    }

    mostrarJuego() {
        this.inicio.style.display = "none";
        this.juego.style.display = "block";
        this.instrucciones.style.display = "none";
        this.gameOver.style.display = "none";
    }

    mostrarInstrucciones() {
        this.inicio.style.display = "none";
        this.juego.style.display = "none";
        this.instrucciones.style.display = "flex";
        this.gameOver.style.display = "none";
    }

    mostrarGameOver() {
        this.gameOver.style.display = "flex";
        this.juego.style.display = "none";
        this.inicio.style.display = "none";
        this.instrucciones.style.display = "none";
    }
}

// ===========================================
//   CLASE JUEGO (LÓGICA DE DIFICULTAD)
// ===========================================

class Juego {
    constructor(onGameOver) {
        this.onGameOver = onGameOver;

        const contenedorPajaro = document.querySelector(".pajaro-contenedor");
        const imagenPajaro = document.getElementById("pajaro");

        this.pajaro = new Pajaro(contenedorPajaro, imagenPajaro, 150, 250, 34);
        this.pipes = [];
        this.pipeGeneratorId = null;

        this.tiempoAnterior = 0;
        this.puntaje = 0;
        this.timerPuntaje = 0; // Usado solo para actualizar el display

        this.jugando = true;
        this.nivelDificultad = 0; // Empieza en el nivel 0
        this.scoreDisplay = document.querySelector('.flappy-puntaje');

        this.resetearDificultadInicial(); // Inicializa la dificultad
        this.limpiarTuberiasPrevias();
        this.iniciarGeneradorTuberias();
        this.actualizarDisplayPuntaje();

        document.addEventListener("keydown", (e) => {
            if (e.code === "Space" && this.jugando) {
                e.preventDefault();
                this.pajaro.aletear();
            }
        });
        
        document.querySelector('.juegoFlappyContenedor').addEventListener("click", (e) => {
            if (this.jugando && e.target.closest('.juegoFlappyContenedor')) {
                this.pajaro.aletear();
            }
        });
    }
    
    // Método para resetear las variables globales al iniciar o reintentar
    resetearDificultadInicial() {
        VELOCIDAD_JUEGO = 2; 
        HUECO_TUBERIA = 160; 
        INTERVALO_GENERACION = 2500;
        this.nivelDificultad = 0;
    }

    actualizarDisplayPuntaje() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.puntaje;
        }
    }
    
    limpiarTuberiasPrevias() {
        document.querySelectorAll('.contenedor-tuberia').forEach(t => t.remove());
    }
    
    iniciarGeneradorTuberias() {
        // Usa la variable INTERVALO_GENERACION (mutable)
        this.pipeGeneratorId = setInterval(() => {
            if (this.jugando) {
                this.pipes.push(new Pipe(JUEGO_ANCHO));
            }
        }, INTERVALO_GENERACION); 
    }
    
    detenerGeneradorTuberias() {
        clearInterval(this.pipeGeneratorId);
    }
    
    destruir() {
        this.detenerGeneradorTuberias(); 
        this.limpiarTuberiasPrevias();   
        this.jugando = false; 
        this.resetearDificultadInicial(); // Restablecer dificultad al destruir
    }

    // NUEVO MÉTODO: Aumenta la dificultad
    actualizarDificultad() {
        // Comprueba si existe un siguiente nivel y si el puntaje lo ha superado
        if (this.nivelDificultad < DIFICULTAD_NIVELES.length) {
            const siguienteNivel = DIFICULTAD_NIVELES[this.nivelDificultad];
            
            if (this.puntaje >= siguienteNivel.score) {
                
                VELOCIDAD_JUEGO = siguienteNivel.velocidad;
                HUECO_TUBERIA = siguienteNivel.hueco;
                
                const intervaloAnterior = INTERVALO_GENERACION;
                INTERVALO_GENERACION = siguienteNivel.intervalo;

                this.nivelDificultad++;
                
                // Si el intervalo de generación ha cambiado, reiniciamos el generador
                if (intervaloAnterior !== INTERVALO_GENERACION) {
                    this.detenerGeneradorTuberias();
                    this.iniciarGeneradorTuberias();
                }

                console.log(`¡Nivel ${this.nivelDificultad}! Velocidad: ${VELOCIDAD_JUEGO}, Hueco: ${HUECO_TUBERIA}`);
            }
        }
    }

    checkCollision(birdBounds, pipe) {
        const pipeContainerBounds = pipe.getBounds();
        
        if (birdBounds.right < pipeContainerBounds.left || birdBounds.left > pipeContainerBounds.right) {
            return false;
        }

        const topPipeWrapper = pipe.element.children[0];
        const bottomPipeWrapper = pipe.element.children[1];

        const topPipeBounds = topPipeWrapper.getBoundingClientRect();
        
        if (birdBounds.top < topPipeBounds.bottom) {
            return true;
        }
        
        const bottomPipeBounds = bottomPipeWrapper.getBoundingClientRect();

        if (birdBounds.bottom > bottomPipeBounds.top) {
            return true;
        }
        
        return false;
    }
    
    checkScore(birdBounds, pipe) {
        // La puntuación se basa en cruzar el borde de la tubería
        if (!pipe.passed && birdBounds.left > pipe.x + ANCHO_TUBERIA) {
            this.puntaje++;
            pipe.passed = true;
            this.actualizarDisplayPuntaje();
            this.actualizarDificultad(); // Llamada clave aquí
        }
    }

    iniciar() {
        requestAnimationFrame(this.bucle.bind(this));
    }

    bucle(timestamp) {
        if (!this.jugando) return;

        const dt = timestamp - this.tiempoAnterior;
        this.tiempoAnterior = timestamp;

        this.actualizar(dt);

        requestAnimationFrame(this.bucle.bind(this));
    }

    actualizar(dt) {
        this.pajaro.actualizar(dt);

        if (this.pajaro.haChocadoAlBorde(JUEGO_ALTURA)) {
            this.jugando = false;
            this.detenerGeneradorTuberias();
            this.onGameOver();
            return;
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.actualizar();
            
            if (this.checkCollision(this.pajaro.getBounds(), pipe)) {
                this.jugando = false;
                this.detenerGeneradorTuberias();
                this.onGameOver();
                return;
            }
            
            this.checkScore(this.pajaro.getBounds(), pipe);

            if (pipe.isOffScreen()) {
                pipe.remove();
                this.pipes.splice(i, 1);
            }
        }
    }
}

// ===========================================
//  INICIALIZACIÓN 
// ===========================================

document.addEventListener("DOMContentLoaded", () => {
    const inicio = document.getElementById("paginaInicio");
    const juego = document.getElementById("paginaJuego");
    const instrucciones = document.querySelector(".flappy-pantalla-instrucciones");
    const gameOver = document.getElementById("pantallaGameOver");
    const pantallas = new Pantalla(inicio, juego, instrucciones, gameOver);
    pantallas.mostrarInicio();

    const btnJugar = document.getElementById("botonIniciar");
    const btnInstrucciones = document.getElementById("btn-instrucciones");
    const btnVolver = document.querySelector(".flappy-btn-volver");
    const btnReintentar = document.getElementById("btnReintentar");
    const btnIrInicio = document.getElementById("btnIrInicio");

    let juegoFlappy = null;

    const iniciarNuevaPartida = () => {
        if (juegoFlappy) {
            juegoFlappy.destruir(); 
        }
        pantallas.mostrarJuego();
        juegoFlappy = new Juego(() => pantallas.mostrarGameOver());
        juegoFlappy.iniciar();
    };

    btnJugar.addEventListener("click", iniciarNuevaPartida);
    btnInstrucciones.addEventListener("click", () => pantallas.mostrarInstrucciones());
    btnVolver.addEventListener("click", () => pantallas.mostrarInicio());

    if (btnReintentar) {
        btnReintentar.addEventListener("click", iniciarNuevaPartida);
    }
    
    if (btnIrInicio) {
        btnIrInicio.addEventListener("click", () => {
            if (juegoFlappy) {
                juegoFlappy.destruir();
                juegoFlappy = null;
            }
            pantallas.mostrarInicio();
        });
    }
});



