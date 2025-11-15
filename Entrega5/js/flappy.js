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

        // this.gravedad = 0.4;
        this.gravedad = 0.08;
        // this.impulso = -7;
        this.impulso = -2.5;

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

    // ⭐ Si toca arriba (0) o abajo (471px), muere
    haChocadoAlBorde(altoJuego) {
        // altoJuego es 550px. El suelo (.layer-1) es 10% de altura, lo que significa
        // que el inicio del suelo está en el 90% (550 * 0.90 = 495px).
        
        // 1. Posición Y del borde superior del suelo (495px)
        const LIMITE_INFERIOR_Y = altoJuego * 0.90; 
        
        // 2. Límite final para el top del pájaro (495px - 24px de altura del pájaro = 471px)
        const COLISION_Y_PAJARO = LIMITE_INFERIOR_Y - 24; 

        // Colisión si toca el borde superior o el suelo corregido (471px)
        return this.y <= 0 || this.y >= COLISION_Y_PAJARO;
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
//   CLASE JUEGO
// ===========================================
class Juego {
    constructor(onGameOver) {
        this.onGameOver = onGameOver;

        const contenedorPajaro = document.getElementById("pajaroContenedor");
        const imagenPajaro = document.getElementById("pajaro");

        this.pajaro = new Pajaro(contenedorPajaro, imagenPajaro, 100, 250, 34);

        this.tiempoAnterior = 0;
        this.puntaje = 0;
        this.timerPuntaje = 0;

        this.jugando = true;

        document.addEventListener("keydown", (e) => {
            if (e.code === "Space" && this.jugando) {
                e.preventDefault();
                this.pajaro.aletear();
            }
        });
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

        // ⭐ MUERTE
        if (this.pajaro.haChocadoAlBorde(550)) {
            this.jugando = false;
            this.onGameOver();
            return;
        }

        // Puntaje
        this.timerPuntaje += dt;
        if (this.timerPuntaje >= 1000) {
            this.puntaje++;
            this.timerPuntaje = 0;
            console.log("Puntaje:", this.puntaje);
        }
    }
}



// ===========================================
//   INICIALIZACIÓN
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

    // Start game
    btnJugar.addEventListener("click", () => {
        pantallas.mostrarJuego();
        juegoFlappy = new Juego(() => pantallas.mostrarGameOver());
        juegoFlappy.iniciar();
    });

    btnInstrucciones.addEventListener("click", () => {
        pantallas.mostrarInstrucciones();
    });

    btnVolver.addEventListener("click", () => {
        pantallas.mostrarInicio();
    });


    // ⭐ BOTÓN REINTENTAR
    btnReintentar.addEventListener("click", () => {
        pantallas.mostrarJuego();
        juegoFlappy = new Juego(() => pantallas.mostrarGameOver());
        juegoFlappy.iniciar();
    });

    // ⭐ BOTÓN IR AL INICIO
    btnIrInicio.addEventListener("click", () => {
        pantallas.mostrarInicio();
    });
});
