// ===========================================
// VARIABLES GLOBALES MUTABLES (INICIALES)
// ===========================================
const JUEGO_ALTURA = 550; 
const JUEGO_ANCHO = 1100;

const JUEGO_ALTURA_UTIL = JUEGO_ALTURA * 0.90; 

const GRAVEDAD = 0.45; //0.35
const IMPULSO_SALTO = -6; 

// VARIABLES DE DIFICULTAD 
let VELOCIDAD_JUEGO = 3.2; //2 
let HUECO_TUBERIA = 130; //160
let INTERVALO_GENERACION = 2500; // ms

// Constantes de Diseño 
const ANCHO_TUBERIA = 100; 
const ALTURA_PICO_TUBERIA = 25; 

// NIVELES DE DIFICULTAD
const DIFICULTAD_NIVELES = [
    { score: 10, hueco: 140, velocidad: 3.5, intervalo: 2200 }, //2.5
    { score: 20, hueco: 120, velocidad: 4.0, intervalo: 1900 }, //3.0
    { score: 30, hueco: 100, velocidad: 4.5, intervalo: 1600 }, //3.5
    { score: 40, hueco: 90, velocidad: 5.0, intervalo: 1400 }, //4.0
];

// ===========================================
// SONIDOS
// ===========================================
const sonidoAleteo = new Audio("./sonidos/wing.ogg");
const sonidoChoque = new Audio("./sonidos/hit.ogg");
const sonidoPunto = new Audio("./sonidos/point.ogg");
const sonidoDie = new Audio("./sonidos/die.ogg");

// Evita delay en Chrome
sonidoAleteo.preload = "auto";
sonidoChoque.preload = "auto";
sonidoPunto.preload = "auto";
sonidoDie.preload = "auto";

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

        sonidoAleteo.currentTime = 0;
        sonidoAleteo.play();
    }

    actualizar(dt) {
        this.velY += this.gravedad;
        this.y += this.velY;

        // ROTACIÓN SEGÚN VELOCIDAD
        let rotacion = 0;

        if (this.velY < 0) {
            rotacion = -25;
        } else {
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
        const MAX_ALTURA_SUPERIOR = JUEGO_ALTURA_UTIL - MIN_ALTURA_SEGMENTO - HUECO_TUBERIA;

        const alturaSuperior = Math.floor(Math.random() * (MAX_ALTURA_SUPERIOR - MIN_ALTURA_ALEATORIA + 1)) + MIN_ALTURA_ALEATORIA;
        const alturaInferior = JUEGO_ALTURA_UTIL - alturaSuperior - HUECO_TUBERIA; 

        this.element = document.createElement('div');
        this.element.classList.add('contenedor-tuberia');
        this.element.style.width = `${ANCHO_TUBERIA}px`;
        this.element.style.left = `${x}px`; 
        this.x = x; 
        this.passed = false; 

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
        
        const tuberiaAbajo = document.createElement('div');
        tuberiaAbajo.classList.add('tuberia-wrapper', 'tuberia-abajo-wrapper');
        tuberiaAbajo.style.height = `${alturaInferior}px`;
        
            const picoAbajo = document.createElement('div');
            picoAbajo.classList.add('tuberia-segmento', 'pico-pipe-abajo');
            picoAbajo.style.height = `${ALTURA_PICO_TUBERIA}px`;

            const cuerpoAbajo = document.createElement('div');
            cuerpoAbajo.classList.add('tuberia-segmento', 'cuerpo-pipe');
            cuerpoAbajo.style.height = `${alturaInferior - ALTURA_PICO_TUBERIA}px`;
            
        tuberiaAbajo.style.bottom = '10%';
        tuberiaAbajo.appendChild(picoAbajo);
        tuberiaAbajo.appendChild(cuerpoAbajo); 
        
        this.element.appendChild(tuberiaArriba);
        this.element.appendChild(tuberiaAbajo);
        
        document.querySelector('.juegoFlappyContenedor').appendChild(this.element);

        this.generarPlanta();
    }
    // ==============================
    // GENERAR PLANTA CARNÍVORA
    // ==============================
    generarPlanta() {
        // 25% de probabilidad de aparecer
        if (Math.random() > 0.25) {
            this.planta = null;
            return;
        }

        const lado = "top";

        const planta = document.createElement("div");
        planta.classList.add("planta-carnivora");

        planta.style.position = "absolute";
        planta.style.width = "48px";
        planta.style.height = "48px";
        planta.style.left = `${(ANCHO_TUBERIA - 48) / 2}px`; // Centrar en la tubería (100px)

        if (lado === "top") {

            const tuberiaArribaWrapper = this.element.children[0]; 
            planta.style.top = `${tuberiaArribaWrapper.offsetHeight - 48}px`; // Coloca el tope de la planta justo en el borde de salida del pico
            
            // Establecer la orientación para la animación:
            planta.dataset.orient = "top"; 

            // Adjuntamos la planta al wrapper de la tubería superior
            tuberiaArribaWrapper.appendChild(planta); 
        }
        this.planta = planta;

        // ANIMACIÓN DE SALIR Y ENTRAR
        this.offset = 0;
        this.dir = 1;
        this.maxOffset = 80;

        this.plantaInterval = setInterval(() => {
            if (!this.planta) return;

            this.offset += this.dir;

            if (this.offset > this.maxOffset) this.dir = -1;
            if (this.offset < 0) this.dir = 1;

            if (lado === "top") {
                this.planta.style.transform = `translateY(${this.offset}px)`;
            }
        }, 18);

        // ANIMACIÓN DE SPRITE FRAME A FRAME
        let frame = 0;
        const totalFrames = 3; // cantidad de frames en tu sprite
        const FRAME_PLANT_WIDTH_SCALED = 48; // El nuevo ancho de un frame escalado

        this.plantaFrame = setInterval(() => {
            if (!this.planta) return;

            frame = (frame + 1) % totalFrames;
            this.planta.style.backgroundPosition = `-${frame * FRAME_PLANT_WIDTH_SCALED}px 0px`;

        }, 120);
    }


    actualizar(dt) {
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
        if (this.plantaInterval) clearInterval(this.plantaInterval);
        if (this.plantaFrame) clearInterval(this.plantaFrame);

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
        this.finalScoreDisplay = document.getElementById("finalScore"); 
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

    mostrarGameOver(puntaje) {

        if (this.finalScoreDisplay) {
            this.finalScoreDisplay.textContent = puntaje;
        }

        // ==== BEST SCORE ====
        let best = localStorage.getItem("bestScoreFlappy") || 0;
        best = Math.max(best, puntaje);
        localStorage.setItem("bestScoreFlappy", best);

        const bestDisplay = document.getElementById("bestScore");
        if (bestDisplay) bestDisplay.textContent = best;
        // =====================


        // 🔥 Reiniciar animación ANTES de mostrar el Game Over
        this.gameOver.classList.remove("mostrar");
        void this.gameOver.offsetWidth; // reinicia la animación


        // 🔥 Ocultar pantallas del juego
        this.inicio.style.display = "none";
        this.instrucciones.style.display = "none";


        // 🔥 Mostrar Game Over con animación
        this.gameOver.style.display = "flex";
        this.gameOver.classList.add("mostrar");
    }

}

// ===========================================
//   CLASE JUEGO (LÓGICA DE DIFICULTAD Y CONTROL)
// ===========================================
class Juego {
    constructor(onGameOver) {
        this.onGameOver = onGameOver;

        const contenedorPajaro = document.querySelector(".pajaro-contenedor");
        const imagenPajaro = document.getElementById("pajaro");
        
        // Elementos de la pantalla
        this.juegoContenedor = document.querySelector('.juegoFlappyContenedor'); // contenedor padre donde toggleamos la pausa
        this.pantallaJuego = document.getElementById("paginaJuego"); 
        this.tapStartElement = document.querySelector('.tapToStart'); 

        this.pajaro = new Pajaro(contenedorPajaro, imagenPajaro, 150, 250, 34);
        this.pipes = [];
        this.pipeGeneratorId = null;

        this.tiempoAnterior = 0;
        this.puntaje = 0;
        this.timerPuntaje = 0; 
        
        this.tiempoDesdeUltimaTuberia = 0; 

        this.jugando = true;
        this.iniciado = false; // controla cuándo el juego se mueve
        this.nivelDificultad = 0; 
        this.scoreDisplay = document.getElementById('puntajeNumero');

        this.primeraTuberiaPendiente = true; 


        this.resetearDificultadInicial(); 
        this.limpiarTuberiasPrevias();
        this.actualizarDisplayPuntaje();

        // Asegurar que el mensaje de inicio esté visible al crear el objeto
        if (this.tapStartElement) this.tapStartElement.classList.remove('oculto'); 

        // Asegurar que el pájaro empiece en el centro
        this.pajaro.actualizarPosicionDiv(); 

        // Eventos para iniciar el juego (salto inicial)
        this.manejarEventos = (e) => {
            // Space key
            if (e.type === "keydown" && e.code === "Space") {
                e.preventDefault();
                if (!this.iniciado) this.arrancarJuego();
                else if (this.jugando) this.pajaro.aletear();
                return;
            }

            // Click dentro del contenedor del juego
            if (e.type === "click" && e.target.closest('.juegoFlappyContenedor')) {
                e.preventDefault();
                if (!this.iniciado) this.arrancarJuego();
                else if (this.jugando) this.pajaro.aletear();
            }
        };

        document.addEventListener("keydown", this.manejarEventos);
        // Asegurarse de que this.juegoContenedor exista antes de añadir listener
        if (this.juegoContenedor) {
            this.juegoContenedor.addEventListener("click", this.manejarEventos);
        }
    }
    
    // --- MÉTODOS DE CONFIGURACIÓN ---
    resetearDificultadInicial() {
        VELOCIDAD_JUEGO = 2; 
        HUECO_TUBERIA = 130; //160
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
        this.iniciado = false;
        this.resetearDificultadInicial(); 
        
        // Limpiar los eventos del juego
        document.removeEventListener("keydown", this.manejarEventos);
        if (this.juegoContenedor) this.juegoContenedor.removeEventListener("click", this.manejarEventos);
    }
    
    arrancarJuego() {
        this.iniciado = true;
        this.pajaro.aletear(); // El primer toque es el primer salto
        
        // Quitar la pausa del fondo Parallax en el contenedor principal
        if (this.juegoContenedor) this.juegoContenedor.classList.remove('parallax-paused');
        
        // Ocultar el mensaje de "Tap to Start"
        if (this.tapStartElement) this.tapStartElement.classList.add('oculto');
    } 

    // --- MÉTODOS DE DIFICULTAD Y PUNTUACIÓN ---
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

    checkScore(birdBounds, pipe) {
        if (!pipe.passed && birdBounds.left > pipe.x + ANCHO_TUBERIA) {
            this.puntaje++;
            pipe.passed = true;

            sonidoPunto.currentTime = 0;
            sonidoPunto.play();

            this.actualizarDisplayPuntaje();
            this.actualizarDificultad(); 
        }
    }
    
    // --- DETECCIÓN DE COLISIONES ---
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

    // --- BUCLE PRINCIPAL DEL JUEGO ---
    iniciar() {
        requestAnimationFrame(this.bucle.bind(this));
    }

    bucle(timestamp) {
        if (!this.jugando) return;

        const dt = timestamp - this.tiempoAnterior;
        this.tiempoAnterior = timestamp;

        if (this.iniciado) { 
            this.actualizar(dt);
        } else {
            // Mantiene al pájaro en posición inicial (pausa)
            this.pajaro.actualizarPosicionDiv(); 
        }
        requestAnimationFrame(this.bucle.bind(this));
    }

    actualizar(dt) {
        this.pajaro.actualizar(dt);

        // Colisión con bordes
        if (this.pajaro.haChocadoAlBorde(JUEGO_ALTURA)) {
            this.jugando = false;

            sonidoChoque.currentTime = 0;
            sonidoChoque.play();

            sonidoDie.currentTime = 0;
            sonidoDie.play();

            if (this.juegoContenedor) this.juegoContenedor.classList.add('parallax-paused');
            setTimeout(() => this.onGameOver(this.puntaje), 1000);
            return;
        }

        // Generación de tuberías
        this.tiempoDesdeUltimaTuberia += dt;
        if (this.primeraTuberiaPendiente) {
            if (this.tiempoDesdeUltimaTuberia >= 50) {
                this.pipes.push(new Pipe(JUEGO_ANCHO));
                this.primeraTuberiaPendiente = false;
                this.tiempoDesdeUltimaTuberia = 0;
            }
        } else {
            if (this.tiempoDesdeUltimaTuberia >= INTERVALO_GENERACION) {
                this.pipes.push(new Pipe(JUEGO_ANCHO));
                this.tiempoDesdeUltimaTuberia = 0;
            }
        }

        // Actualización tuberías, colisiones y puntuación
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];

            pipe.actualizar(dt);

            // Puntaje
            this.checkScore(this.pajaro.getBounds(), pipe);

            // VICTORIA (120 puntos)
            if (this.puntaje >= 120) {

                this.jugando = false;

                // Detener fondo
                if (this.juegoContenedor)
                    this.juegoContenedor.classList.add('parallax-paused');

                // Mostrar pantalla final
                setTimeout(() => this.onGameOver(this.puntaje), 500);

                // Cambiar texto del Game Over a “Ganaste”
                const tituloGO = document.querySelector("#pantallaGameOver h2");
                if (tituloGO) tituloGO.textContent = "¡GANASTE!";

                return;
            }

            // Colisión con tubería
            if (this.checkCollision(this.pajaro.getBounds(), pipe)) {
                this.jugando = false;

                sonidoChoque.currentTime = 0;
                sonidoChoque.play();

                sonidoDie.currentTime = 0;
                sonidoDie.play();

                if (this.juegoContenedor) this.juegoContenedor.classList.add('parallax-paused');
                setTimeout(() => this.onGameOver(this.puntaje), 1000);
                return;
            }
            // ==========================
            // COLISIÓN CON PLANTA
            // ==========================
            if (pipe.planta) {
                const pRect = pipe.planta.getBoundingClientRect();
                const b = this.pajaro.getBounds();

                const overlap =
                    b.right > pRect.left &&
                    b.left < pRect.right &&
                    b.bottom > pRect.top &&
                    b.top < pRect.bottom;

                if (overlap) {
                    this.jugando = false;

                    sonidoChoque.currentTime = 0;
                    sonidoChoque.play();
                    sonidoDie.currentTime = 0;
                    sonidoDie.play();

                    if (this.juegoContenedor)
                        this.juegoContenedor.classList.add('parallax-paused');

                    setTimeout(() => this.onGameOver(this.puntaje), 1000);
                    return;
                }
            }

            // Eliminar tubería fuera de pantalla
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

    // Mostrar BEST apenas carga la página
    const bestDisplay = document.getElementById("bestScore");
    if (bestDisplay) {
        let best = localStorage.getItem("bestScoreFlappy") || 0;
        bestDisplay.textContent = best;
    }


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
        // 1. Mostrar la pantalla del juego (quitando el display: none)
        pantallas.mostrarJuego(); 
        
        // 2. Configurar el estado de pausa inicial en el contenedor principal (.juegoFlappyContenedor)
        const contPadre = document.querySelector('.juegoFlappyContenedor');
        if (contPadre) contPadre.classList.add('parallax-paused');

        document.querySelector('.tapToStart').classList.remove('oculto');
        
        // Crear nueva instancia de juego
        juegoFlappy = new Juego((score) => pantallas.mostrarGameOver(score));

        juegoFlappy.puntaje = 0;             
        juegoFlappy.actualizarDisplayPuntaje(); 

        juegoFlappy.pajaro.velY = 0;
        juegoFlappy.pajaro.contenedor.style.transform = "rotate(0deg)";
        juegoFlappy.pajaro.mostrarFrame(0); 
        juegoFlappy.pajaro.actualizarPosicionDiv();

        juegoFlappy.iniciar(); 
    };

    // Evitar que el click del botón "Jugar" burbujee y arranque el juego inmediatamente
    if (btnJugar) {
        btnJugar.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            iniciarNuevaPartida();
        });
    }

    btnInstrucciones.addEventListener("click", () => pantallas.mostrarInstrucciones());
    btnVolver.addEventListener("click", () => pantallas.mostrarInicio());

    if (btnReintentar) {
        btnReintentar.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            iniciarNuevaPartida();
        });
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
