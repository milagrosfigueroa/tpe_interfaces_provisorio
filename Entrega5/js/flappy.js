// ===================
// VARIABLES GLOBALES 
// ===================
const JUEGO_ALTURA = 550; 
const JUEGO_ANCHO = 1100;

const JUEGO_ALTURA_UTIL = JUEGO_ALTURA * 0.90; 

const GRAVEDAD = 0.45; 
const IMPULSO_SALTO = -6; 

// VARIABLES DE DIFICULTAD 
let VELOCIDAD_JUEGO = 4.0; 
let HUECO_TUBERIA = 130; 
let INTERVALO_GENERACION = 2500; 
let MAX_VARIACION_Y = 120; 

// Constantes de Diseño 
const ANCHO_TUBERIA = 100; 
const ALTURA_PICO_TUBERIA = 25; 

// Constantes de Sprite del Pájaro
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;

const DIFICULTAD_NIVELES = [
    { score: 10, hueco: 120, velocidad: 4.0, intervalo: 2000, variacionY: 150 }, 
    { score: 20, hueco: 100, velocidad: 4.0, intervalo: 1700, variacionY: 180 }, 
    { score: 30, hueco: 90, velocidad: 4.0, intervalo: 1500, variacionY: 210 }, 
    { score: 40, hueco: 80, velocidad: 4.0, intervalo: 1300, variacionY: 240 },
];

// ===========================================
// SONIDOS
// ===========================================
const sonidoAleteo = new Audio("./sonidos/wing.ogg");
const sonidoChoque = new Audio("./sonidos/hit.ogg");
const sonidoPunto = new Audio("./sonidos/point.ogg");
const sonidoDie = new Audio("./sonidos/die.ogg");
const sonidoCollect = new Audio ("./sonidos/collect.wav");
const sonidoWin = new Audio ("./sonidos/win.wav");
const sonidoVidaMenos = new Audio ("./sonidos/vidamenos.wav");


sonidoAleteo.preload = "auto";
sonidoChoque.preload = "auto";
sonidoPunto.preload = "auto";
sonidoDie.preload = "auto";
sonidoCollect.preload = "auto";
sonidoWin.preload = "auto";
sonidoVidaMenos.preload = "auto";

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

        this.isInvulnerable = false;

        this.actualizarPosicionDiv();
        this.mostrarFrame(0);
    }

    setInvulnerable(isActive) {
        this.isInvulnerable = isActive;

        if (isActive) {
            this.contenedor.classList.add('pajaro-invulnerable');
        } else {
            this.contenedor.classList.remove('pajaro-invulnerable');
        }
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

        let rotacion = 0;

        if (this.velY < 0) {
            rotacion = -25;
        } else {
            rotacion = Math.min(this.velY * 3, 90);
        }

        this.contenedor.style.transform = `rotate(${rotacion}deg)`;

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
// ===========================================
class Pipe {
    constructor(x) {

        const CENTRO_Y_SEGURO = JUEGO_ALTURA_UTIL / 2;
        const offsetAleatorio = (Math.random() * MAX_VARIACION_Y * 2) - MAX_VARIACION_Y;
        const posYCentroHueco = CENTRO_Y_SEGURO + offsetAleatorio;

        let alturaSuperior = posYCentroHueco - (HUECO_TUBERIA / 2);
        const ALTURA_MARGEN = 65; 

        const ALTURA_MIN = ALTURA_MARGEN; 
        const ALTURA_MAX = JUEGO_ALTURA_UTIL - HUECO_TUBERIA - ALTURA_MARGEN;

        if (alturaSuperior < ALTURA_MIN) {
            alturaSuperior = ALTURA_MIN;
        } else if (alturaSuperior > ALTURA_MAX) {
            alturaSuperior = ALTURA_MAX;
        }

        const alturaInferior = JUEGO_ALTURA_UTIL - alturaSuperior - HUECO_TUBERIA;

        this.alturaSuperior = alturaSuperior;
        this.hueco = HUECO_TUBERIA;

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
        planta.style.left = `${(ANCHO_TUBERIA - 48) / 2}px`; 

        if (lado === "top") {

            const tuberiaArribaWrapper = this.element.children[0]; 
            planta.style.top = `${tuberiaArribaWrapper.offsetHeight - 48}px`; 
            
            planta.dataset.orient = "top"; 

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

        let frame = 0;
        const totalFrames = 3; 
        const FRAME_PLANT_WIDTH_SCALED = 48; 

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
        this.juego.style.display = "none";
        this.instrucciones.style.display = "flex";
        this.gameOver.style.display = "none";
    }

    mostrarGameOver(puntaje) {

        if (this.finalScoreDisplay) {
            this.finalScoreDisplay.textContent = puntaje;
        }

        
        let best = localStorage.getItem("bestScoreFlappy") || 0;
        best = Math.max(best, puntaje);
        localStorage.setItem("bestScoreFlappy", best);

        const bestDisplay = document.getElementById("bestScore");
        if (bestDisplay) bestDisplay.textContent = best;
        


        this.gameOver.classList.remove("mostrar");
        void this.gameOver.offsetWidth; 


        this.inicio.style.display = "none";
        this.instrucciones.style.display = "none";


        this.gameOver.style.display = "flex";
        this.gameOver.classList.add("mostrar");
    }

}
// ===========================================
//   CLASE HEART (CORAZÓN EXTRA)
// ===========================================
class Heart {
    constructor(pipe, contenedorJuego) {
        this.pipe = pipe;
        this.contenedorJuego = contenedorJuego;

        this.element = document.createElement("div");
        this.element.classList.add("corazon-extra");

        this.element.style.width = "32px";
        this.element.style.height = "27px";
        this.element.style.backgroundImage = "url('./img/flappy/sprite_heart.png')";
        this.element.style.backgroundSize = "160px 27px"; 

        this.frame = 0;


        const alturaTop = pipe.alturaSuperior;       
        const tamanoHueco = pipe.hueco;            
        const centroHueco = alturaTop + (tamanoHueco / 2); 

        this.x = pipe.x + (ANCHO_TUBERIA / 2) - 16;
        this.y = centroHueco - 16;                   

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        contenedorJuego.appendChild(this.element);

        this.spriteInterval = setInterval(() => {
            this.frame = (this.frame + 1) % 5;
            this.element.style.backgroundPosition = `-${this.frame * 32}px 0px`;
        }, 130);
    }

    actualizar(dt) {
        const factorNormalizacion = dt / 16.66;
        this.x -= VELOCIDAD_JUEGO * factorNormalizacion;
        this.element.style.left = `${this.x}px`;
    }

    isOffScreen() {
        return this.x < -50;
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }

    remove() {
        clearInterval(this.spriteInterval);
        this.element.remove();
    }
}
// ===========================================
//   CLASE BONUS +3 
// ===========================================
class Bonus3 {
    static FRAME_WIDTH = 34; 
    static NUM_FRAMES = 13;

    constructor(pipe, contenedorJuego) {
        this.pipe = pipe;
        this.contenedorJuego = contenedorJuego;

        this.element = document.createElement("div");
        this.element.classList.add("bonus-3-extra"); 

        this.element.style.width = `${Bonus3.FRAME_WIDTH}px`;
        this.element.style.height = "34px"; 
        this.element.style.backgroundImage = "url('./img/flappy/spritesheet_bonus.png')";
        this.element.style.backgroundSize = "442px 34px"; 

        this.frame = 0;


        const alturaTop = pipe.alturaSuperior;       
        const tamanoHueco = pipe.hueco;              
        const centroHueco = alturaTop + (tamanoHueco / 2); 

        this.x = pipe.x + (ANCHO_TUBERIA / 2) - (Bonus3.FRAME_WIDTH / 2); 
        this.y = centroHueco - (34 / 2);                                  

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        contenedorJuego.appendChild(this.element);


        this.spriteInterval = setInterval(() => {
            this.frame = (this.frame + 1) % Bonus3.NUM_FRAMES;
            this.element.style.backgroundPosition = `-${this.frame * Bonus3.FRAME_WIDTH}px 0px`;
        }, 80);
    }

    actualizar(dt) {
        const factorNormalizacion = dt / 16.66;
        this.x -= VELOCIDAD_JUEGO * factorNormalizacion;
        this.element.style.left = `${this.x}px`;
    }

    isOffScreen() {
        return this.x < -50;
    }

    getBounds() {
        return this.element.getBoundingClientRect();
    }

    remove() {
        clearInterval(this.spriteInterval);
        this.element.remove();
    }
}

// ===========================================
//   CLASE EXPLOSION 
// ===========================================
class Explosion {
    static EXPLOSION_FRAME_WIDTH = 60; 
    static EXPLOSION_FRAME_HEIGHT = 60;
    static NUM_FRAMES = 10; 
    static ANIMATED_FRAMES = 7; 
    
    constructor(x, y, contenedorJuego) {
        this.x = x;
        this.y = y;
        this.contenedorJuego = contenedorJuego;
        this.frame = 0;
        this.animacionTerminada = false;

        this.element = document.createElement("div");
        this.element.classList.add("explosion-fx"); 

        // Centrar la explosión de 60x60 alrededor del punto de impacto (x, y)
        this.element.style.left = `${this.x - (Explosion.EXPLOSION_FRAME_WIDTH / 2)}px`; 
        this.element.style.top = `${this.y - (Explosion.EXPLOSION_FRAME_HEIGHT / 2)}px`;

        contenedorJuego.appendChild(this.element);

        this.spriteInterval = setInterval(() => {
            if (this.frame >= Explosion.ANIMATED_FRAMES - 1) {
                this.animacionTerminada = true;
                this.remove(); 
                return;
            }
            this.frame++;
            this.element.style.backgroundPosition = `-${this.frame * Explosion.EXPLOSION_FRAME_WIDTH}px 0px`;
        }, 60); 
    }

    remove() {
        clearInterval(this.spriteInterval);
        this.element.remove();
    }
}

// -------------------------------------------
// CLASE PAJARO DECORATIVO DE FONDO 
// -------------------------------------------
class PajaroFondo {
    constructor(contenedorJuego) {
        this.contenedor = contenedorJuego;
        
        this.element = document.createElement('div');
        this.element.classList.add('pajaro-fondo'); 
        
        this.x = JUEGO_ANCHO; 
        
        const ALTURA_MAX_Y = JUEGO_ALTURA_UTIL * 0.33; 
        this.y = Math.random() * ALTURA_MAX_Y;

        this.velocidad = (Math.random() * 0.5) + 0.8; 
        
        this.frame = 0;
        this.frameAncho = 84; 
        this.animacionTiempo = 0;
        
        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;
        
        this.contenedor.appendChild(this.element);
    }

    actualizarAnimacion(dt) {
        this.animacionTiempo += dt;

        if (this.animacionTiempo > 100) {
            const totalFrames = 4;
            this.frame = (this.frame + 1) % totalFrames; 
            this.element.style.backgroundPosition = `-${this.frame * this.frameAncho}px 0px`;
            this.animacionTiempo = 0;
        }
    }

    actualizar(dt) {
        const factorNormalizacion = dt / 16.66; 
        
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


// =========================
//   CLASE JUEGO 
// =========================
class Juego {
    constructor(onGameOver) {
        this.onGameOver = onGameOver;

        const contenedorPajaro = document.querySelector(".pajaro-contenedor");
        const imagenPajaro = document.getElementById("pajaro");
        
        this.juegoContenedor = document.querySelector('.juegoFlappyContenedor'); 
        this.pantallaJuego = document.getElementById("paginaJuego"); 
        this.tapStartElement = document.querySelector('.tapToStart'); 

        this.notificacionVida = document.getElementById('notificacionVida');

        this.pajaro = new Pajaro(contenedorPajaro, imagenPajaro, 150, 250, BIRD_WIDTH);
        this.pipes = [];

        this.pajarosFondo = []; 
        this.tiempoDesdeUltimoPajaro = 0; 
        this.pipeGeneratorId = null;

        this.tiempoAnterior = 0;
        this.puntaje = 0;
        this.timerPuntaje = 0; 
        
        this.tiempoDesdeUltimaTuberia = 0; 

        this.jugando = true;
        this.iniciado = false; 
        this.nivelDificultad = 0; 
        this.scoreDisplay = document.getElementById('puntajeNumero');

        
        this.vidas = 3; 
        this.actualizarDisplayVidas(); 

        this.primeraTuberiaPendiente = true; 


        this.resetearDificultadInicial(); 
        this.limpiarTuberiasPrevias();
        this.actualizarDisplayPuntaje();

        if (this.tapStartElement) this.tapStartElement.classList.remove('oculto'); 


        this.pajaro.actualizarPosicionDiv(); 

        this.manejarEventos = (e) => {

            if (e.type === "keydown" && e.code === "Space") {
                e.preventDefault();
                if (!this.iniciado) this.arrancarJuego();
                else if (this.jugando) this.pajaro.aletear();
                return;
            }

            if (e.type === "click" && e.target.closest('.juegoFlappyContenedor')) {
                e.preventDefault();
                if (!this.iniciado) this.arrancarJuego();
                else if (this.jugando) this.pajaro.aletear();
            }
        };

        document.addEventListener("keydown", this.manejarEventos);
        if (this.juegoContenedor) {
            this.juegoContenedor.addEventListener("click", this.manejarEventos);
        }

        this.corazonesExtra = [];
        this.tiempoUltimoCorazon = 0;

        this.bonus3 = []; 
        this.tiempoUltimoBonus3 = 0;
    }
    actualizarDisplayVidas() {
        const corazones = [
            document.getElementById("vida1"),
            document.getElementById("vida2"),
            document.getElementById("vida3")
        ];

        for (let i = 0; i < 3; i++) {
            if (!corazones[i]) continue;
            corazones[i].src = (i < this.vidas) ? "./img/flappy/corazonlleno.png" : "./img/flappy/corazonvacio.png";
        }
    }
    
    reiniciarPosicionPajaro() {
        const birdRect = this.pajaro.contenedor.getBoundingClientRect();
        const contRect = this.juegoContenedor.getBoundingClientRect();

        let pipeCercana = null;
        let menorDiferencia = Infinity;

        for (const pipe of this.pipes) {
            const pipeRect = pipe.element.getBoundingClientRect();
            
            if (pipeRect.right <= birdRect.left) continue;

            const diff = pipeRect.left - birdRect.left;

            if (diff < menorDiferencia) {
                menorDiferencia = diff;
                pipeCercana = pipe;
            }
        }

        if (!pipeCercana) {
            this.pajaro.x = 150;
            this.pajaro.y = 250;
            this.pajaro.velY = 0;
            this.pajaro.actualizarPosicionDiv();
            this.pajaro.contenedor.style.display = 'block'; // Asegurar visibilidad
            return;
        }

        const topWrapper = pipeCercana.element.children[0];
        const bottomWrapper = pipeCercana.element.children[1];

        const topRect = topWrapper.getBoundingClientRect();
        const bottomRect = bottomWrapper.getBoundingClientRect();

        const topBottomLocal = topRect.bottom - contRect.top;
        const bottomTopLocal = bottomRect.top - contRect.top;

        const centroHueco = (topBottomLocal + bottomTopLocal) / 2;

        this.pajaro.x = 150; 
        this.pajaro.y = centroHueco - (this.pajaro.contenedor.offsetHeight / 2);

        this.pajaro.velY = 0;
        this.pajaro.contenedor.style.transform = "rotate(0deg)";
        this.pajaro.contenedor.style.display = 'block'; // Asegurar visibilidad
        this.pajaro.actualizarPosicionDiv();

        this.iniciado = false;
        this.juegoContenedor.classList.add('parallax-paused');
        this.tapStartElement.classList.remove('oculto');
        
        // CORRECCIÓN: Asegurar que la notificación está oculta si se está reiniciando
        if (this.notificacionVida) this.notificacionVida.classList.add('oculto'); 
    }

    limpiarBonus3() {
        this.bonus3.forEach(bonus => {
            bonus.remove();
        });
        this.bonus3 = [];
    } 

    limpiarCorazones() {
        this.corazonesExtra.forEach(corazon => {
            corazon.remove(); 
        });
        this.corazonesExtra = []; 
    }

    resetearDificultadInicial() {
        VELOCIDAD_JUEGO = 4.0; 
        HUECO_TUBERIA = 130; 
        INTERVALO_GENERACION = 2500;
        MAX_VARIACION_Y = 120; 
        this.nivelDificultad = 0;
    }

    actualizarDisplayPuntaje() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.puntaje;
        }
    }
    
    limpiarTuberiasPrevias() {
        this.pipes.forEach(pipe => pipe.remove()); 
        this.pipes = [];
    }
    
    destruir() {
        this.limpiarTuberiasPrevias();  
        this.limpiarCorazones(); 
        this.limpiarBonus3();
        this.jugando = false; 
        this.iniciado = false;
        this.resetearDificultadInicial(); 

        this.pajarosFondo.forEach(p => p.remove());
        this.pajarosFondo = [];

        this.vidas = 3;
        this.actualizarDisplayVidas();

        document.removeEventListener("keydown", this.manejarEventos);
        if (this.juegoContenedor) this.juegoContenedor.removeEventListener("click", this.manejarEventos);
    }
    
    arrancarJuego() {
        this.iniciado = true;
        this.pajaro.aletear(); 
        
        if (this.juegoContenedor) this.juegoContenedor.classList.remove('parallax-paused');
        
        if (this.tapStartElement) this.tapStartElement.classList.add('oculto');
    } 

    actualizarDificultad() {
        if (this.nivelDificultad < DIFICULTAD_NIVELES.length) {
            const siguienteNivel = DIFICULTAD_NIVELES[this.nivelDificultad];
            
            if (this.puntaje >= siguienteNivel.score) {
                
                VELOCIDAD_JUEGO = siguienteNivel.velocidad;
                HUECO_TUBERIA = siguienteNivel.hueco;
                INTERVALO_GENERACION = siguienteNivel.intervalo; 
                MAX_VARIACION_Y = siguienteNivel.variacionY; 
                
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
            this.pajaro.actualizarPosicionDiv(); 
        }
        requestAnimationFrame(this.bucle.bind(this));
    }

    actualizar(dt) {
        this.pajaro.actualizar(dt);

        if (this.iniciado) { 
            // ======================================
            // GESTIÓN DE PÁJAROS DE FONDO 
            // ======================================
            this.tiempoDesdeUltimoPajaro += dt;
            const INTERVALO_PAJARO_FONDO = 45000 + Math.random() * 20000; 
            const MAX_PAJAROS_EN_PANTALLA = 1; 

            if (this.tiempoDesdeUltimoPajaro >= INTERVALO_PAJARO_FONDO && this.pajarosFondo.length < MAX_PAJAROS_EN_PANTALLA) {
                this.pajarosFondo.push(new PajaroFondo(this.juegoContenedor)); 
                this.tiempoDesdeUltimoPajaro = 0;
            }

            for (let i = this.pajarosFondo.length - 1; i >= 0; i--) {
                const pajaro = this.pajarosFondo[i];

                pajaro.actualizar(dt);

                if (pajaro.isOffScreen()) {
                    pajaro.remove();
                    this.pajarosFondo.splice(i, 1);
                }
            }
        }
        
        // 1. ☠️ COLISIÓN CON BORDES (AHORA CAUSA MUERTE INMEDIATA)
        if (this.pajaro.haChocadoAlBorde(JUEGO_ALTURA)) {
            
            this.jugando = false;
            sonidoChoque.currentTime = 0;
            sonidoChoque.play(); 
            
            this.vidas = 0; // Se fuerza el Game Over
            
            // === CÓDIGO CRÍTICO DE EXPLOSIÓN ===
            const OFFSET_X = -5;  
            const OFFSET_Y = -15;  

            const explosionX = this.pajaro.x + (BIRD_WIDTH / 2) + OFFSET_X;
            const explosionY = this.pajaro.y + (BIRD_HEIGHT / 2) + OFFSET_Y;

            this.pajaro.contenedor.style.display = 'none'; 
            new Explosion(explosionX, explosionY, this.juegoContenedor); 
            // === FIN CÓDIGO CRÍTICO DE EXPLOSIÓN ===

            if (this.notificacionVida) this.notificacionVida.classList.remove('oculto');
            if (this.juegoContenedor) this.juegoContenedor.classList.add('parallax-paused');

            setTimeout(() => {
                if (this.notificacionVida) this.notificacionVida.classList.add('oculto');
                sonidoDie.currentTime = 0;
                sonidoDie.play();
                this.onGameOver(this.puntaje);
            }, 1000); 
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
        const ultimaPipe = this.pipes[this.pipes.length - 1]; 


        // =========================================
        // GENERACIÓN DE BONUS +3 
        // =========================================
        if (this.pipes.length > 0) {
            this.tiempoUltimoBonus3 += dt;
            const INTERVALO_BONUS3 = 30000 + Math.random() * 20000;

            if (ultimaPipe && !ultimaPipe.planta && !ultimaPipe.heart && this.tiempoUltimoBonus3 >= INTERVALO_BONUS3) {
                if (true) { 
                    const bonus = new Bonus3(ultimaPipe, this.juegoContenedor);
                    ultimaPipe.bonus = bonus; 
                    this.bonus3.push(bonus);

                    this.tiempoUltimoBonus3 = 0; 
                }
            }
        }


        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];

            pipe.actualizar(dt);

            this.checkScore(this.pajaro.getBounds(), pipe);

            if (this.puntaje >= 120) {

                sonidoWin.currentTime = 0;
                sonidoWin.play();

                this.jugando = false;

                if (this.juegoContenedor)
                    this.juegoContenedor.classList.add('parallax-paused');

                setTimeout(() => this.onGameOver(this.puntaje), 500);

                const tituloGO = document.querySelector("#pantallaGameOver h2");
                if (tituloGO) tituloGO.textContent = "YOU WIN";

                return;
            }

            // 2. 💥 COLISIÓN CON TUBERÍA (AHORA CAUSA MUERTE INMEDIATA)
            if (!pipe._colisionPlanta && !this.pajaro.isInvulnerable && this.checkCollision(this.pajaro.getBounds(), pipe)) {
                
                this.jugando = false;
                sonidoChoque.currentTime = 0;
                sonidoChoque.play();

                this.vidas = 0; // Se fuerza el Game Over
                
                // === CÓDIGO CRÍTICO DE EXPLOSIÓN ===
                const OFFSET_X = -5;  
                const OFFSET_Y = -15;  

                const explosionX = this.pajaro.x + (BIRD_WIDTH / 2) + OFFSET_X;
                const explosionY = this.pajaro.y + (BIRD_HEIGHT / 2) + OFFSET_Y;

                this.pajaro.contenedor.style.display = 'none'; 
                new Explosion(explosionX, explosionY, this.juegoContenedor); 
                // === FIN CÓDIGO CRÍTICO DE EXPLOSIÓN ===

                if (this.notificacionVida) this.notificacionVida.classList.remove('oculto');
                if (this.juegoContenedor) this.juegoContenedor.classList.add('parallax-paused');

                setTimeout(() => {
                    if (this.notificacionVida) this.notificacionVida.classList.add('oculto');
                    sonidoDie.currentTime = 0;
                    sonidoDie.play();
                    this.onGameOver(this.puntaje); 
                }, 1000); 
                return; 
            }
            
            // 3. 🌱 COLISIÓN CON PLANTA (AHORA SOLO RESTA VIDA)
            if (pipe.planta) {
                const pRect = pipe.planta.getBoundingClientRect();
                const b = this.pajaro.getBounds();

                const overlap =
                    b.right > pRect.left &&
                    b.left < pRect.right &&
                    b.bottom > pRect.top &&
                    b.top < pRect.bottom;

                if (overlap && !this.pajaro.isInvulnerable) {
                    if (pipe._cooldownPlanta) continue;
                    pipe._cooldownPlanta = true;
                    setTimeout(() => { pipe._cooldownPlanta = false; }, 600);

                    pipe._colisionPlanta = true;

                    this.jugando = false;

                    this.vidas--; // <--- SOLO RESTA UNA VIDA
                    this.actualizarDisplayVidas();

                    sonidoVidaMenos.currentTime = 0;
                    sonidoVidaMenos.play();

                    if (this.notificacionVida) {
                        this.notificacionVida.innerHTML = `¡CONTACTO! <br> Vidas restantes: ${this.vidas}`; // Mensaje de contacto
                        this.notificacionVida.classList.remove('oculto');
                    }
                    if (this.juegoContenedor) this.juegoContenedor.classList.add('parallax-paused');

                    if (this.vidas > 0) {
                        // REINICIO (Le quedan vidas)
                        const INVULNERABILITY_DURATION = 800;

                        setTimeout(() => {
                            if (this.notificacionVida) this.notificacionVida.classList.add('oculto');

                            this.reiniciarPosicionPajaro();

                            this.pajaro.setInvulnerable(true);

                            setTimeout(() => {
                                this.pajaro.setInvulnerable(false);
                            }, INVULNERABILITY_DURATION);

                            this.jugando = true;
                            requestAnimationFrame(this.bucle.bind(this));

                        }, 500); 
                        return; 
                    } else {
                        // ÚLTIMA VIDA PERDIDA: GAME OVER (sin explosión, por planta)
                        if (this.notificacionVida) {
                            this.notificacionVida.textContent = "¡ÚLTIMO CONTACTO!";
                            this.notificacionVida.classList.remove('oculto');
                        }
                        
                        setTimeout(() => {
                            if (this.notificacionVida) this.notificacionVida.classList.add('oculto');
                            
                            sonidoDie.currentTime = 0;
                            sonidoDie.play();

                            this.pajaro.contenedor.style.display = 'block'; // Pájaro visible al morir
                            this.onGameOver(this.puntaje);
                        }, 500); 
                        return; 
                    }
                }
            }
            // Eliminar tubería fuera de pantalla
            if (pipe.isOffScreen()) {
                try { delete pipe._colisionPlanta; delete pipe._cooldownPlanta; } catch(e){}
                pipe.remove();
                this.pipes.splice(i, 1);
            }

        }


        // =========================================
        // ACTUALIZACIÓN Y COLISIÓN DE BONUS +3 
        // =========================================
        for (let i = this.bonus3.length - 1; i >= 0; i--) {
            const bonus = this.bonus3[i];
            bonus.actualizar(dt);

            if (bonus.isOffScreen()) {
                bonus.remove();
                this.bonus3.splice(i, 1);
                continue;
            }

            // Colisión con pájaro
            const bird = this.pajaro.getBounds();
            const bb = bonus.getBounds();

            const toca =
                bird.left < bb.right &&
                bird.right > bb.left &&
                bird.top < bb.bottom &&
                bird.bottom > bb.top;

            if (toca) {

                this.puntaje += 3; 
                this.actualizarDisplayPuntaje();

                sonidoCollect.currentTime = 0;
                sonidoCollect.play();

                // Eliminar bonus
                bonus.remove();
                this.bonus3.splice(i, 1);
            }
        }


        // =========================================
        // GENERAR CORAZÓN EXTRA
        // =========================================
        this.tiempoUltimoCorazon += dt;

        if (this.vidas <= 2) {
            const INTERVALO_CORAZON = 20000 + Math.random() * 15000;

            if (this.tiempoUltimoCorazon >= INTERVALO_CORAZON && this.pipes.length > 0) {

                if (ultimaPipe.planta || ultimaPipe.bonus) {
                    this.tiempoUltimoCorazon = 0;
                    return;
                }

                const heart = new Heart(ultimaPipe, this.juegoContenedor);
                ultimaPipe.heart = heart; 
                this.corazonesExtra.push(heart); 

                this.tiempoUltimoCorazon = 0;
            }
        }

        // =========================================
        // ACTUALIZACIÓN Y COLISIÓN DE CORAZÓN EXTRA
        // =========================================
        for (let i = this.corazonesExtra.length - 1; i >= 0; i--) {
            const heart = this.corazonesExtra[i];
            heart.actualizar(dt);

            if (heart.isOffScreen()) {
                heart.remove();
                this.corazonesExtra.splice(i, 1);
                continue;
            }

            // Colisión con pájaro
            const bird = this.pajaro.getBounds();
            const hb = heart.getBounds();

            const toca =
                bird.left < hb.right &&
                bird.right > hb.left &&
                bird.top < hb.bottom &&
                bird.bottom > hb.top;

            if (toca) {
                if (this.vidas < 3) {
                    this.vidas++; 
                    this.actualizarDisplayVidas();
                }

                sonidoCollect.currentTime = 0;
                sonidoCollect.play();

                // Eliminar corazón
                heart.remove();
                this.corazonesExtra.splice(i, 1);
            }
        }
    }
}


// ===========================================
//  INICIALIZACIÓN (DOMCONTENTLOADED) - CÓDIGO FINAL DE BOTONES
// ===========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Prevención de desplazamiento por la barra espaciadora
    window.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
            e.preventDefault();
        }
    });

    // 2. Definición de Contenedores de Pantalla (usando los IDs/Clases de tu HTML)
    const inicio = document.getElementById("paginaInicio");
    const juego = document.getElementById("paginaJuego");
    const instrucciones = document.querySelector(".flappy-pantalla-instrucciones");
    const gameOver = document.getElementById("pantallaGameOver");

    // Inicializar el gestor de pantallas
    const pantallas = new Pantalla(inicio, juego, instrucciones, gameOver);
    pantallas.mostrarInicio();
    
    // Mostrar BEST score
    const bestDisplay = document.getElementById("bestScore");
    if (bestDisplay) {
        let best = localStorage.getItem("bestScoreFlappy") || 0;
        bestDisplay.textContent = best;
    }

    // 3. Selección de Botones
    const btnJugar = document.getElementById("botonIniciar"); // START
    const btnInstrucciones = document.getElementById("btn-instrucciones");
    const btnVolver = document.querySelector(".flappy-btn-volver"); // Botón Volver de Instrucciones
    const btnReintentar = document.getElementById("btnReintentar");
    const btnIrInicio = document.getElementById("btnIrInicio"); // HOME/Salir

    let juegoFlappy = null;

    // 4. Función de Inicio de Partida
    const iniciarNuevaPartida = () => {
        // Limpiar cualquier juego anterior
        if (juegoFlappy) {
            juegoFlappy.destruir(); 
        }
        
        // Configurar la UI y el juego
        pantallas.mostrarJuego(); 
        
        const contPadre = document.querySelector('.juegoFlappyContenedor');
        if (contPadre) contPadre.classList.add('parallax-paused');

        const tapToStart = document.querySelector('.tapToStart');
        if (tapToStart) tapToStart.classList.remove('oculto');
        
        // Crear nueva instancia de juego, pasando la función que se ejecuta al morir/ganar
        juegoFlappy = new Juego((score) => pantallas.mostrarGameOver(score));

        // CORRECCIÓN: Asegurar que la notificación está oculta al inicio de la partida
        const notificacionVida = document.getElementById('notificacionVida');
        if (notificacionVida) {
            notificacionVida.classList.add('oculto');
        }

        // Inicializar puntaje y vidas
        juegoFlappy.puntaje = 0;             
        juegoFlappy.actualizarDisplayPuntaje(); 

        // Restablecer pájaro a la posición inicial
        juegoFlappy.pajaro.x = 150;
        juegoFlappy.pajaro.y = 250;
        juegoFlappy.pajaro.velY = 0;
        juegoFlappy.pajaro.contenedor.style.transform = "rotate(0deg)";
        juegoFlappy.pajaro.mostrarFrame(0); 
        juegoFlappy.pajaro.actualizarPosicionDiv();
        
        // CORRECCIÓN: Asegurar que el elemento es visible al iniciar
        juegoFlappy.pajaro.contenedor.style.display = 'block'; 

        juegoFlappy.iniciar(); 
        juegoFlappy.vidas = 3;
        juegoFlappy.actualizarDisplayVidas();

    };

    // 5. Asignación de Eventos de Clic

    // Botón Jugar (START)
    if (btnJugar) {
        btnJugar.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            iniciarNuevaPartida();
        });
    }

    // Botón Instrucciones
    if (btnInstrucciones) {
        btnInstrucciones.addEventListener("click", () => pantallas.mostrarInstrucciones());
    }
    
    // Botón Volver
    if (btnVolver) {
        btnVolver.addEventListener("click", () => pantallas.mostrarInicio());
    }

    // Botón Reintentar (Game Over)
    if (btnReintentar) {
        btnReintentar.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            iniciarNuevaPartida();
        });
    }
    
    // Botón Salir/Home (Game Over)
    if (btnIrInicio) {
        btnIrInicio.addEventListener("click", () => {
            if (juegoFlappy) {
                juegoFlappy.destruir();
                juegoFlappy = null; // Es importante liberar la referencia
            }
            pantallas.mostrarInicio();
        });
    }
});




