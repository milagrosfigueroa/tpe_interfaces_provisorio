// ===========================================
// VARIABLES GLOBALES MUTABLES (INICIALES)
// ===========================================
const JUEGO_ALTURA = 550; 
const JUEGO_ANCHO = 1100;

const JUEGO_ALTURA_UTIL = JUEGO_ALTURA * 0.90; 

const GRAVEDAD = 0.35;
const IMPULSO_SALTO = -6; 

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

        // -----------------------------
        // ROTACIÓN SEGÚN VELOCIDAD
        // -----------------------------
        let rotacion = 0;

        if (this.velY < 0) {
            // Subiendo → inclinar hacia arriba (-35° máx)
            rotacion = -25;
        } else {
            // Cayendo → rotación proporcional a la velocidad (hasta 90°)
            rotacion = Math.min(this.velY * 3, 90);
        }

        this.contenedor.style.transform = `rotate(${rotacion}deg)`;

        this.actualizarPosicionDiv();

        // FRAMES del aleteo
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
// ===========================================

class Pipe {
    constructor(x) {
        const MIN_ALTURA_SEGMENTO = 65; 
        
        const MIN_ALTURA_ALEATORIA = 120;
        
        //Cálculo de la altura máxima que faltaba en tu versión
        const MAX_ALTURA_SUPERIOR = JUEGO_ALTURA_UTIL - MIN_ALTURA_SEGMENTO - HUECO_TUBERIA;

        // CÁLCULO DE ALTURA DE LA TUBERÍA SUPERIOR
        // El rango aleatorio usa MIN_ALTURA_ALEATORIA (120px) como límite inferior.
        const alturaSuperior = Math.floor(Math.random() * (MAX_ALTURA_SUPERIOR - MIN_ALTURA_ALEATORIA + 1)) + MIN_ALTURA_ALEATORIA;
        
        // CORRECCIÓN GEOMETRÍA: Usar JUEGO_ALTURA_UTIL para el cálculo total
        const alturaInferior = JUEGO_ALTURA_UTIL - alturaSuperior - HUECO_TUBERIA; 

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
            
        // 💡 CORRECCIÓN GEOMETRÍA: Posicionar al 10% del fondo para alinearse con el suelo.
        tuberiaAbajo.style.bottom = '10%';
        tuberiaAbajo.appendChild(picoAbajo);
        tuberiaAbajo.appendChild(cuerpoAbajo); 
        
        
        // Añadir al contenedor de la tubería
        this.element.appendChild(tuberiaArriba);
        this.element.appendChild(tuberiaAbajo);
        
        document.querySelector('.juegoFlappyContenedor').appendChild(this.element);
    }

    actualizar(dt) {
        // 💡 CORRECCIÓN TEMPORIZACIÓN: Usar dt para normalizar la velocidad (frame-rate independent)
        const factorNormalizacion = dt / 16.66; 

        this.x -= VELOCIDAD_JUEGO * factorNormalizacion; 
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
        this.timerPuntaje = 0; 
        
        // 💡 CORRECCIÓN TEMPORIZACIÓN: Inicializar temporizador para la generación de tuberías (reemplaza setInterval)
        this.tiempoDesdeUltimaTuberia = 0; 

        this.jugando = true;
        this.nivelDificultad = 0; 
        this.scoreDisplay = document.querySelector('.flappy-puntaje');

        this.resetearDificultadInicial(); 
        this.limpiarTuberiasPrevias();
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
    
    destruir() {
        this.limpiarTuberiasPrevias();   
        this.jugando = false; 
        this.resetearDificultadInicial(); 
    }

    // NUEVO MÉTODO: Aumenta la dificultad
    actualizarDificultad() {
        if (this.nivelDificultad < DIFICULTAD_NIVELES.length) {
            const siguienteNivel = DIFICULTAD_NIVELES[this.nivelDificultad];
            
            if (this.puntaje >= siguienteNivel.score) {
                
                VELOCIDAD_JUEGO = siguienteNivel.velocidad;
                HUECO_TUBERIA = siguienteNivel.hueco;
                INTERVALO_GENERACION = siguienteNivel.intervalo; 
                
                this.nivelDificultad++;
                
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
        if (!pipe.passed && birdBounds.left > pipe.x + ANCHO_TUBERIA) {
            this.puntaje++;
            pipe.passed = true;
            this.actualizarDisplayPuntaje();
            this.actualizarDificultad(); 
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
            this.onGameOver();
            return;
        }
        
        // 💡 CORRECCIÓN TEMPORIZACIÓN: Generación de tuberías basada en dt (reemplaza setInterval)
        this.tiempoDesdeUltimaTuberia += dt;
        if (this.tiempoDesdeUltimaTuberia >= INTERVALO_GENERACION) {
            this.pipes.push(new Pipe(JUEGO_ANCHO));
            this.tiempoDesdeUltimaTuberia = 0; 
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            
            // 💡 CORRECCIÓN TEMPORIZACIÓN: Pasar dt a la tubería
            pipe.actualizar(dt);
            
            if (this.checkCollision(this.pajaro.getBounds(), pipe)) {
                this.jugando = false;
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
    window.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            e.preventDefault();
        }
    });

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
