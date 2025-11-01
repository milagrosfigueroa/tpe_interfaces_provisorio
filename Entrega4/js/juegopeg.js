// Coordenadas del centro del tablero
const CENTRO_X = 960; 
const CENTRO_Y = 540;

// Espaciado y tamaño de las fichas 
const ESPACIADO = 160; 
const TAMANO_FICHA = 130; 

// Rutas de las imágenes
const RUTA_FICHA_FUEGO = "./img/pegejecucion/fichafuego.png"; 
const RUTA_FICHA_AGUA = "./img/pegejecucion/fichaagua.png";   

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
        this.ctx = this.canvas.getContext("2d");
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
        this.imagen.onload = () => this.dibujarTablero();
    }

    dibujarTablero() {
        const { ctx, canvas, imagen } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
    }
}

class Ficha {
    constructor(x, y, rutaImagen, tipo) {
        this.x = x - TAMANO_FICHA / 2;
        this.y = y - TAMANO_FICHA / 2;
        this.ancho = TAMANO_FICHA;
        this.alto = TAMANO_FICHA;
        this.tipo = tipo;
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
    }

    dibujar(ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
    }
}

class Juego {
    constructor(canvasId, rutaImagen) {
        this.tablero = new Tablero(canvasId, rutaImagen);
        this.pantallas = new Pantalla();
        this.fichas = [];
        this.posicionesFijas = this.generarPosiciones();
        this.fichaSeleccionada = null;

        this.inicializarFichas();

        this.botonJugar = document.querySelector("#botonIniciar");
        this.botonSalir = document.querySelector("#botonSalir");

        if (this.botonJugar)
            this.botonJugar.addEventListener("click", () => this.iniciarJuego());

        if (this.botonSalir)
            this.botonSalir.addEventListener("click", () => this.volverInicio());

        this.tablero.imagen.onload = () => this.dibujarTodo();
    }

    generarPosiciones() {
        const posiciones = [];
        for (let row = -3; row <= 3; row++) {
            for (let col = -3; col <= 3; col++) {
                const isCorner = (Math.abs(row) >= 2 && Math.abs(col) >= 2);
                if (!isCorner) {
                    const x = CENTRO_X + col * ESPACIADO;
                    const y = CENTRO_Y + row * ESPACIADO;
                    posiciones.push({ id: `${row}_${col}`, row, col, x, y, tieneFicha: true });
                }
            }
        }
        const centro = posiciones.find(p => p.id === '0_0');
        if (centro) centro.tieneFicha = false;
        return posiciones;
    }

    inicializarFichas() {
        let contadorFichas = 0;
        this.fichas = [];
        this.posicionesFijas.forEach(pos => {
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

    dibujarTodo() {
        this.tablero.dibujarTablero();
        this.fichas.forEach(f => f.dibujar(this.tablero.ctx));
    }

    iniciarJuego() {
        this.pantallas.mostrarJuego();
        this.dibujarTodo();
    }

    volverInicio() {
        this.pantallas.mostrarInicio();
    }

    iniciar() {
        this.pantallas.mostrarInicio();
        if (this.tablero.imagen.complete) this.dibujarTodo();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const juegoPeg = new Juego("pegCanvas", "./img/pegejecucion/tableropeg.png");
    juegoPeg.iniciar();
});