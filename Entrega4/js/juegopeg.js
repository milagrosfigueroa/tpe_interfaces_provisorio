// Coordenadas del centro del tablero
const CENTRO_X = 960;
const CENTRO_Y = 540;

// Espaciado y tamaño de las fichas
const ESPACIADO = 160;
const TAMANO_FICHA = 130;

// Rutas de las imágenes
const RUTA_FICHA_FUEGO = "./img/pegejecucion/fichafuego.png";
const RUTA_FICHA_AGUA = "./img/pegejecucion/fichaagua.png";

// =========================
// Clase Temporizador
// =========================
class Temporizador {
    constructor(displayId, tiempoInicial = 120) {
        this.display = document.getElementById(displayId);
        this.tiempoInicial = tiempoInicial;
        this.tiempoRestante = tiempoInicial;
        this.intervalo = null;
        this.finalizadoCallback = null;
        this.actualizarDisplay();
    }

    actualizarDisplay() {
        const minutos = Math.floor(this.tiempoRestante / 60).toString().padStart(2, "0");
        const segundos = (this.tiempoRestante % 60).toString().padStart(2, "0");
        this.display.textContent = `${minutos}:${segundos}`;
    }

    iniciar() {
        if (this.intervalo) clearInterval(this.intervalo);
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

    pausar() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }

    reanudar() {
        if (!this.intervalo && this.tiempoRestante > 0) {
            this.iniciar();
        }
    }

    reiniciar() {
        this.pausar();
        this.tiempoRestante = this.tiempoInicial;
        this.actualizarDisplay();
    }

    detener() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }

    onFinalizado(callback) {
        this.finalizadoCallback = callback;
    }
}

// =========================
// Clase Pantalla
// =========================
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

// =========================
// Clase Tablero
// =========================
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

// =========================
// Clase Ficha
// =========================
class Ficha {
    constructor(x, y, rutaImagen, tipo) {
        this.x = x - TAMANO_FICHA / 2;
        this.y = y - TAMANO_FICHA / 2;
        this.ancho = TAMANO_FICHA;
        this.alto = TAMANO_FICHA;
        this.tipo = tipo; // "fuego" o "agua"
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
    }

    dibujar(ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(this.imagen, this.x, this.y, this.ancho, this.alto);
    }
}

// =========================
// Clase Juego
// =========================
class Juego {
    constructor(canvasId, rutaImagen) {
        this.tablero = new Tablero(canvasId, rutaImagen);
        this.pantallas = new Pantalla();
        this.fichas = [];
        this.posicionesFijas = this.generarPosiciones();
        this.fichaSeleccionada = null;
        this.origenActivo = null;
        this.posicionInicialX = 0;
        this.posicionInicialY = 0;
        this.pausado = false; // Estado de pausa

        this.inicializarFichas();

        this.botonJugar = document.querySelector("#botonIniciar");
        this.botonSalir = document.querySelector("#botonSalir");
        this.botonPausar = document.getElementById("btnPausar"); // ahora alterna
        this.botonReiniciar = document.getElementById("btnReiniciar");

        if (this.botonJugar)
            this.botonJugar.addEventListener("click", () => this.iniciarJuego());

        if (this.botonSalir)
            this.botonSalir.addEventListener("click", () => this.volverInicio());

        if (this.botonPausar)
            this.botonPausar.addEventListener("click", () => this.togglePausa());

        if (this.botonReiniciar)
            this.botonReiniciar.addEventListener("click", () => this.reiniciarJuego());

        this.tablero.imagen.onload = () => this.dibujarTodo();

        // Eventos de mouse
        this.tablero.canvas.addEventListener("mousedown", (e) => this.presionarMouse(e));
        this.tablero.canvas.addEventListener("mousemove", (e) => this.moverMouse(e));
        document.addEventListener("mouseup", (e) => this.soltarMouse(e));

        // Temporizador
        this.temporizador = new Temporizador("temporizadorDisplay", 120);
        this.temporizador.onFinalizado(() => this.terminarJuego());
    }

    // =========================
    // Pausa / Reanudar
    // =========================
    togglePausa() {
        if (!this.pausado) {
            this.pausado = true;
            this.temporizador.pausar();
            this.botonPausar.classList.add("pausado");
            this.botonPausar.textContent = "Reanudar";
        } else {
            this.pausado = false;
            this.temporizador.reanudar();
            this.botonPausar.classList.remove("pausado");
            this.botonPausar.textContent = "Pausar";
        }
    }

    reiniciarJuego() {
        this.pausado = false;
        this.temporizador.reiniciar();
        if (this.botonPausar) {
            this.botonPausar.classList.remove("pausado");
            this.botonPausar.textContent = "Pausar";
        }
        this.inicializarFichas();
        this.dibujarTodo();
    }

    generarPosiciones() {
        const posiciones = [];
        for (let row = -3; row <= 3; row++) {
            for (let col = -3; col <= 3; col++) {
                const isCorner = (Math.abs(row) >= 2 && Math.abs(col) >= 2);
                if (!isCorner) {
                    const x = CENTRO_X + col * ESPACIADO;
                    const y = CENTRO_Y + row * ESPACIADO;
                    posiciones.push({ id: `${row}_${col}`, row, col, x, y, tieneFicha: true, ficha: null });
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
            pos.ficha = null; // reset
            pos.tieneFicha = pos.id !== '0_0'; // centro vacío
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
        
        this.reiniciarJuego();

        this.temporizador.iniciar();
    }


    volverInicio() {
        this.temporizador.reiniciar();
        this.pantallas.mostrarInicio();
    }

    iniciar() {
        this.pantallas.mostrarInicio();
        if (this.tablero.imagen.complete) this.dibujarTodo();
    }

    // =========================
    // Interacción con el mouse
    // =========================
    presionarMouse(e) {
        if (this.pausado) return;

        const rect = this.tablero.canvas.getBoundingClientRect();
        const escalaX = this.tablero.canvas.width / rect.width;
        const escalaY = this.tablero.canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * escalaX;
        const mouseY = (e.clientY - rect.top) * escalaY;

        this.fichaActiva = this.fichas.find(f =>
            mouseX >= f.x && mouseX <= f.x + f.ancho &&
            mouseY >= f.y && mouseY <= f.y + f.alto
        );

        if (this.fichaActiva) {
            this.origenActivo = this.posicionesFijas.find(p => p.ficha === this.fichaActiva);
            this.posicionInicialX = this.fichaActiva.x;
            this.posicionInicialY = this.fichaActiva.y;
            this.fichaActiva.seleccionada = true;
            this.dibujarTodo();
            this.resaltarFicha(this.fichaActiva);
            this.mostrarHints();
        }
    }

    moverMouse(e) {
        if (this.pausado || !this.fichaActiva) return;

        const rect = this.tablero.canvas.getBoundingClientRect();
        const escalaX = this.tablero.canvas.width / rect.width;
        const escalaY = this.tablero.canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * escalaX;
        const mouseY = (e.clientY - rect.top) * escalaY;

        this.fichaActiva.x = mouseX - TAMANO_FICHA / 2;
        this.fichaActiva.y = mouseY - TAMANO_FICHA / 2;

        this.dibujarTodo();
        this.resaltarFicha(this.fichaActiva);
        this.mostrarHints();
    }

    soltarMouse(e) {
        if (this.pausado || !this.fichaActiva) return;

        const rect = this.tablero.canvas.getBoundingClientRect();
        const escalaX = this.tablero.canvas.width / rect.width;
        const escalaY = this.tablero.canvas.height / rect.height;

        const mouseX = (e.clientX - rect.left) * escalaX;
        const mouseY = (e.clientY - rect.top) * escalaY;

        const origen = this.origenActivo;
        const destino = this.posicionesFijas.find(pos => {
            const dx = mouseX - pos.x;
            const dy = mouseY - pos.y;
            return Math.sqrt(dx * dx + dy * dy) < TAMANO_FICHA / 2;
        });

        let movimientoExitoso = false;

        if (destino && this.movimientoValido(origen, destino)) {
            destino.tieneFicha = true;
            destino.ficha = this.fichaActiva;
            this.fichaActiva.x = destino.x - TAMANO_FICHA / 2;
            this.fichaActiva.y = destino.y - TAMANO_FICHA / 2;

            const intermedia = this.obtenerPosicionMedia(origen, destino);
            if (intermedia && intermedia.ficha) {
                this.fichas = this.fichas.filter(f => f !== intermedia.ficha);
                intermedia.ficha = null;
                intermedia.tieneFicha = false;
            }

            origen.tieneFicha = false;
            origen.ficha = null;
            movimientoExitoso = true;
        }

        if (!movimientoExitoso) {
            this.fichaActiva.x = this.posicionInicialX;
            this.fichaActiva.y = this.posicionInicialY;
        }

        this.fichaActiva.seleccionada = false;
        this.fichaActiva = null;
        this.origenActivo = null;

        this.dibujarTodo();

        if (!this.hayMovimientosDisponibles() || this.fichas.length <= 1) {
            this.terminarJuego();
        }
    }

    movimientoValido(origen, destino) {
        if (!origen || !destino) return false;
        if (destino.tieneFicha) return false;

        const dx = destino.col - origen.col;
        const dy = destino.row - origen.row;

        // Movimiento horizontal o vertical de 2 casillas
        if ((Math.abs(dx) === 2 && dy === 0) || (Math.abs(dy) === 2 && dx === 0)) {
            const intermedia = this.obtenerPosicionMedia(origen, destino);
            return intermedia && intermedia.tieneFicha;
        }

        return false;
    }

    obtenerPosicionMedia(origen, destino) {
        const filaMedia = (origen.row + destino.row) / 2;
        const colMedia = (origen.col + destino.col) / 2;
        return this.posicionesFijas.find(p => p.row === filaMedia && p.col === colMedia);
    }

    resaltarFicha(ficha) {
        const ctx = this.tablero.ctx;
        let colorBorde = ficha.tipo === "fuego" ? "orange" : ficha.tipo === "agua" ? "blue" : "yellow";

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

    mostrarHints() {
        if (this.pausado || !this.origenActivo) return;

        this.posicionesFijas.forEach(destino => {
            if (this.movimientoValido(this.origenActivo, destino)) {
                this.dibujarHint(destino);
            }
        });
    }

    dibujarHint(posicion) {
        const ctx = this.tablero.ctx;
        ctx.fillStyle = "rgba(74, 242, 45, 0.83)";
        ctx.beginPath();
        const radioHint = TAMANO_FICHA / 4;
        ctx.arc(posicion.x, posicion.y, radioHint, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

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

    terminarJuego() {
        this.temporizador.detener();
        this.pausado = true; // Bloquea movimientos
        this.pantallas.mostrarFinal();
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const juegoPeg = new Juego("pegCanvas", "./img/pegejecucion/tableropeg.png");
    juegoPeg.iniciar();
});
