
class Pantalla {
    constructor() {
        this.pantallaInicio = document.querySelector(".pantalla-inicio");
        this.pantallaJuego = document.querySelector(".pantalla-juego");
        this.pantallaFinal = document.querySelector(".pantalla-final");
    }

    mostrarInicio() {
        this.pantallaInicio.classList.add("activo");
        this.pantallaJuego.classList.remove("activo");
        this.pantallaFinal.classList.remove("activo");
    }

    mostrarJuego() {
        this.pantallaInicio.classList.remove("activo");
        this.pantallaJuego.classList.add("activo");
        this.pantallaFinal.classList.remove("activo");
    }

    mostrarFinal() {
        this.pantallaInicio.classList.remove("activo");
        this.pantallaJuego.classList.remove("activo");
        this.pantallaFinal.classList.add("activo");
    }
}

class Tablero {
    constructor(canvasId, rutaImagen) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`No se encontró el canvas`);
            return;
        }

        this.ctx = this.canvas.getContext("2d");
        this.imagen = new Image();
        this.imagen.src = rutaImagen;

        this.imagen.onload = () => this.dibujarTablero();
        this.imagen.onerror = () => console.error("No se pudo cargar la imagen del tablero");
    }

    dibujarTablero() {
        const { ctx, canvas, imagen } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
    }

    actualizar() {
        this.dibujarTablero();
    }
}


class Juego {
    constructor(canvasId, rutaImagen) {
        this.tablero = new Tablero(canvasId, rutaImagen);
        this.pantallas = new Pantallas();

        this.botonJugar = document.querySelector(".btn-primary-play");
        if (this.botonJugar) {
            this.botonJugar.addEventListener("click", () => this.iniciarJuego());
        }

        this.botonFinalizar = document.querySelector(".btn-finalizar-juego");
        if (this.botonFinalizar) {
            this.botonFinalizar.addEventListener("click", () => this.finalizarJuego());
        }
    }

    iniciarJuego() {
        this.pantallas.mostrarJuego();
        this.tablero.dibujarTablero();
    }

    finalizarJuego() {
        this.pantallas.mostrarFinal();
    }

    iniciar() {
        this.pantallas.mostrarInicio();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const juegoPeg = new Juego(
        "pegCanvas",
        "./img/pegejecucion/tableropeg.png"
    );
    juegoPeg.iniciar();
});
