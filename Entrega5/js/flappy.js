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

let vidas = 3;
const corazones = document.querySelectorAll(".vida");

const CORAZON_LLENO = "./img/flappy/corazon_lleno_spritesheet.png";
const CORAZON_VACIO = "./img/flappy/corazon_vacio_spritesheet.png";

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

        // 🔥 NUEVO: Referencia al elemento de notificación
        this.notificacionVida = document.getElementById('notificacionVida');

        this.pajaro = new Pajaro(contenedorPajaro, imagenPajaro, 150, 250, 34);
        this.pipes = [];
        // 🔥 NUEVO: Array para pájaros de fondo
        this.pajarosFondo = []; 
        this.tiempoDesdeUltimoPajaro = 0; 
        const INTERVALO_PAJARO_FONDO = 15000; // Define la frecuencia base (cada 15 segundos)
        this.pipeGeneratorId = null;

        this.tiempoAnterior = 0;
        this.puntaje = 0;
        this.timerPuntaje = 0; 
        
        this.tiempoDesdeUltimaTuberia = 0; 

        this.jugando = true;
        this.iniciado = false; // controla cuándo el juego se mueve
        this.nivelDificultad = 0; 
        this.scoreDisplay = document.getElementById('puntajeNumero');

        // 🔥 NUEVO: Sistema de Vidas
        this.vidas = 3; 
        this.actualizarDisplayVidas(); // Muestra las vidas iniciales

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
    // dentro de class Juego
    actualizarDisplayVidas() {
        const corazones = [
            document.getElementById("vida1"),
            document.getElementById("vida2"),
            document.getElementById("vida3")
        ];

        for (let i = 0; i < 3; i++) {
            if (!corazones[i]) continue;
            corazones[i].src = (i < this.vidas) ? "./img/flappy/corazon_lleno_spritesheet.png" : "./img/flappy/corazon_vacio_spritesheet.png";
        }
    }

    // 🔥 NUEVO MÉTODO: Reinicia la posición y el estado del pájaro tras perder una vida
    reiniciarPosicionPajaro(pipeCercana = null) {
        // reset física
        this.pajaro.velY = 0;
        this.pajaro.contenedor.style.transform = "rotate(0deg)";

        // Opción: si querés usar siempre la posición segura (B),
        // fuerza posición 150,250 ignorando pipeCercana. 
        // Si querés usar centro del hueco cuando exista pipeCercana,
        // mantené el if. Aquí dejamos la posición segura (B) por defecto.

        this.pajaro.x = 150;
        this.pajaro.y = 250;
        this.pajaro.actualizarPosicionDiv();

        // pausar el fondo y esperar a que el jugador toque para reanudar
        if (this.juegoContenedor) this.juegoContenedor.classList.add('parallax-paused');
        this.iniciado = false;
        if (this.tapStartElement) this.tapStartElement.classList.remove('oculto');
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
        // Itera sobre el array de pipes y llama al método remove() de cada Pipe
        this.pipes.forEach(pipe => pipe.remove()); 
        // Luego limpia el array
        this.pipes = [];
    }
    
    destruir() {
        this.limpiarTuberiasPrevias();   
        this.jugando = false; 
        this.iniciado = false;
        this.resetearDificultadInicial(); 

        // 🔥 NUEVO: Limpiar pájaros de fondo
        this.pajarosFondo.forEach(p => p.remove());
        this.pajarosFondo = [];

        // 🔥 CAMBIO: Resetear vidas al destruir el juego
        this.vidas = 3;
        this.actualizarDisplayVidas();

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
        if (this.iniciado) { // Asegúrate de que solo aparezcan cuando el juego está iniciado
            // ======================================
            // GESTIÓN DE PÁJAROS DE FONDO
            // ======================================
            this.tiempoDesdeUltimoPajaro += dt;
            const INTERVALO_PAJARO_FONDO = 15000; // 15 segundos
            const MAX_PAJAROS_EN_PANTALLA = 1; // Nunca permitas más de 1 a la vez

            if (this.tiempoDesdeUltimoPajaro >= INTERVALO_PAJARO_FONDO && this.pajarosFondo.length < MAX_PAJAROS_EN_PANTALLA) {
                // Crear un nuevo pájaro de fondo
                this.pajarosFondo.push(new PajaroFondo(this.juegoContenedor));
                
                // Reiniciar el contador de tiempo (añadimos un factor de aleatoriedad para que no sea exacto)
                this.tiempoDesdeUltimoPajaro = 0; 
            }

            // Actualización y limpieza de pájaros
            for (let i = this.pajarosFondo.length - 1; i >= 0; i--) {
                const pajaro = this.pajarosFondo[i];
                
                pajaro.actualizar(dt);

                if (pajaro.isOffScreen()) {
                    pajaro.remove();
                    this.pajarosFondo.splice(i, 1);
                }
            }
            // ======================================
        }
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
            if (!pipe._colisionPlanta && this.checkCollision(this.pajaro.getBounds(), pipe)) {
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
            // COLISIÓN CON PLANTA (LÓGICA CORREGIDA PARA REINICIO)
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
                    // Si ya procesamos una colisión reciente en esta tubería, ignora
                    if (pipe._cooldownPlanta) continue;
                    // Marca cooldown para evitar procesar varias veces en frames consecutivos
                    pipe._cooldownPlanta = true;
                    setTimeout(() => { pipe._cooldownPlanta = false; }, 600);

                    // Evita que la colisión con planta active también la colisión de tubería
                    pipe._colisionPlanta = true;

                    // ** 🔥 IMPORTANTE: PAUSAR EL JUEGO INMEDIATAMENTE 🔥 **
                    this.jugando = false; 

                    // Restar vida y actualizar HUD
                    this.vidas--;
                    this.actualizarDisplayVidas();

                    // Sonidos
                    sonidoChoque.currentTime = 0;
                    sonidoChoque.play();

                    // Pausar visual y mostrar notificación si existe
                    if (this.notificacionVida) {
                        this.notificacionVida.textContent = `¡VIDA PERDIDA! Vidas restantes: ${this.vidas}`;
                        this.notificacionVida.classList.remove('oculto');
                    }
                    if (this.juegoContenedor) this.juegoContenedor.classList.add('parallax-paused');

                    // Si quedan vidas -> reposicionar seguro (opción B) y permitir reanudar
                    if (this.vidas > 0) {
                        setTimeout(() => {
                            if (this.notificacionVida) this.notificacionVida.classList.add('oculto');

                            // Reinicia posición segura del pájaro
                            this.reiniciarPosicionPajaro(/*pipe*/);

                            // ** 🔥 REANUDAR EL BUCLE DE ANIMACIÓN 🔥 **
                            this.jugando = true;
                            requestAnimationFrame(this.bucle.bind(this));

                        }, 1200); // pausa visual antes de reanudar
                        return; // Salimos del bucle 'for' de tuberías
                    } else {
                        // Última vida: game over
                        if (this.notificacionVida) {
                            this.notificacionVida.textContent = "¡ÚLTIMA VIDA PERDIDA!";
                            this.notificacionVida.classList.remove('oculto');
                        }
                        setTimeout(() => {
                            if (this.notificacionVida) this.notificacionVida.classList.add('oculto');
                            sonidoDie.currentTime = 0;
                            sonidoDie.play();
                            this.onGameOver(this.puntaje);
                        }, 1000);
                        return; // Salimos del bucle 'for' de tuberías
                    }
                }
            }


            // Eliminar tubería fuera de pantalla
            if (pipe.isOffScreen()) {
                // limpiar flags si existieran para evitar que queden colisión marcada
                try { delete pipe._colisionPlanta; delete pipe._cooldownPlanta; } catch(e){}
                pipe.remove();
                this.pipes.splice(i, 1);
            }

        }
    }

}
// ===========================================
// CLASE PAJARO DECORATIVO DE FONDO
// ===========================================
class PajaroFondo {
    constructor(contenedorJuego) {
        this.contenedor = contenedorJuego;
        
        // Crear el elemento HTML del pájaro
        this.element = document.createElement('div');
        this.element.classList.add('pajaro-fondo'); // Asegúrate de tener este CSS
        
        // Posición inicial aleatoria en X (fuera de pantalla a la derecha)
        this.x = JUEGO_ANCHO; 
        
        // Posición inicial aleatoria en Y (en el tercio superior de la pantalla útil)
        const ALTURA_MAX_Y = JUEGO_ALTURA_UTIL * 0.33; 
        this.y = Math.random() * ALTURA_MAX_Y;

        // Velocidad de movimiento (más lento que las tuberías)
        this.velocidad = (Math.random() * 0.5) + 0.8; // Velocidad entre 0.8 y 1.3
        
        // Animación del sprite (si tienes un spritesheet)
        this.frame = 0;
        this.frameAncho = 168; // Asume el mismo ancho de frame que el pájaro principal o ajústalo
        this.animacionTiempo = 0;
        
        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;
        
        this.contenedor.appendChild(this.element);
    }
    
    // Asume que el CSS maneja el tamaño y el fondo del sprite sheet.
    // Solo necesitamos cambiar la posición del background para animar.
    actualizarAnimacion(dt) {
        this.animacionTiempo += dt;

        // Cambia de frame cada 100ms
        if (this.animacionTiempo > 100) {
            const totalFrames = 4;
            this.frame = (this.frame + 1) % totalFrames; // Asume 4 frames de animación (0, 1, 2, 3)
            this.element.style.backgroundPosition = `-${this.frame * this.frameAncho}px 0px`;
            this.animacionTiempo = 0;
        }
    }

    actualizar(dt) {
        const factorNormalizacion = dt / 16.66; 
        
        // Mover hacia la izquierda (ajustar por dt)
        this.x -= this.velocidad * factorNormalizacion;
        this.element.style.left = `${this.x}px`;
        
        this.actualizarAnimacion(dt);
    }

    isOffScreen() {
        return this.x < -this.element.offsetWidth;
    }

    remove() {
        this.element.remove();
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
        juegoFlappy.vidas = 3;
        juegoFlappy.actualizarDisplayVidas();

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
