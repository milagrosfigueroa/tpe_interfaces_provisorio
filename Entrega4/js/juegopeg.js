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
        
        // *** LÓGICA DE CAMBIO DE COLOR (AÑADIDO) ***
        // Aplica la clase de urgencia si quedan 10 segundos o menos, pero no si ya terminó (tiempoRestante > 0)
        if (this.tiempoRestante <= 10 && this.tiempoRestante > 0) {
            this.display.classList.add('temporizador-urgencia');
        } else {
            // Remueve la clase si el tiempo es mayor a 10 o si se reinicia el temporizador
            this.display.classList.remove('temporizador-urgencia');
        }
    }

    iniciar() {
        if (this.intervalo) clearInterval(this.intervalo);
        
        // Llama a actualizarDisplay para establecer el estado inicial de color/tiempo
        this.actualizarDisplay();

        this.intervalo = setInterval(() => {
            if (this.tiempoRestante > 0) {
                this.tiempoRestante--;
                this.actualizarDisplay(); // Esta llamada activa la lógica del color cada segundo
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
        // El llamado aquí asegura que el color rojo se elimine al reiniciar
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
        this.pantallaInstrucciones = document.querySelector(".pantalla-instrucciones");
    }

    mostrarInicio() {
        this.pantallaInicio.classList.add("activo");
        this.pantallaJuego.classList.remove("activo");
        this.pantallaFinal.classList.remove("activo");
        this.pantallaInstrucciones.classList.remove("activo");
    }

    mostrarJuego() {
        this.pantallaInicio.classList.remove("activo");
        this.pantallaJuego.classList.add("activo");
        this.pantallaFinal.classList.remove("activo");
        this.pantallaInstrucciones.classList.remove("activo");
    }

    mostrarFinal() {
        this.pantallaInicio.classList.remove("activo");
        this.pantallaJuego.classList.remove("activo");
        this.pantallaFinal.classList.add("activo");
        this.pantallaInstrucciones.classList.remove("activo");
    }

    mostrarInstrucciones() { 
        this.pantallaInicio.classList.remove("activo");
        this.pantallaJuego.classList.remove("activo");
        this.pantallaFinal.classList.remove("activo");
        if (this.pantallaInstrucciones) this.pantallaInstrucciones.classList.add("activo");
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
        this.botonPausar = document.getElementById("btnPausar"); 
        this.botonReiniciar = document.getElementById("btnReiniciar");
        this.botonInstrucciones = document.getElementById("btn-instrucciones");

        if (this.botonInstrucciones)
            this.botonInstrucciones.addEventListener("click", () => this.irAInstrucciones());

        if (this.botonVolverInicio)
            this.botonVolverInicio.addEventListener("click", () => this.volverInicio());

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

        // --- INICIO: LÓGICA DE MOVIMIENTOS AÑADIDA ---
        this.movimientosRestantes = 45; // 45 movimientos iniciales
        this.movimientosDisplay = document.getElementById("movimientosRestantes"); 
        this.actualizarContador(); // Muestra el valor inicial en el HTML
}
    actualizarContador() {
        if (this.movimientosDisplay) {
            this.movimientosDisplay.textContent = this.movimientosRestantes;
        }
    }
    // ---------------------------------------------------------------------

    // =========================
    // Pausa / Reanudar
    // =========================
    togglePausa() {
        if (!this.pausado) {
            // Pausar
            this.pausado = true;
            this.temporizador.pausar();
            
           
            this.botonPausar.classList.add("activo");
            this.botonPausar.textContent = "Reanudar";
        } else {
            // Reanudar
            this.pausado = false;
            this.temporizador.reanudar();
            
        
            this.botonPausar.classList.remove("activo");
            this.botonPausar.textContent = "Pausar";
        }
    }

    reiniciarJuego() {
        this.pausado = false;
        if (this.botonPausar) {
            this.botonPausar.classList.remove("activo");
            this.botonPausar.textContent = "Pausar";
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

        if (this.tablero.imagen.complete) {
            this.dibujarTodo();
        } else {
            this.tablero.imagen.onload = () => this.dibujarTodo();
        }

        this.temporizador.iniciar();
    }



    volverInicio() {
        this.temporizador.reiniciar();
        if (this.botonPausar) {
            this.botonPausar.classList.remove("activo");
            this.botonPausar.textContent = "Pausar";
        }
        this.pantallas.mostrarInicio();
    }

    irAInstrucciones() {
        this.pantallas.mostrarInstrucciones();
    }

    iniciar() {
        this.pantallas.mostrarInicio();
        if (this.tablero.imagen.complete) this.dibujarTodo();
    }

    // =========================
    // Interacción con el mouse
    // =========================
    presionarMouse(e) {
        if (this.pausado) return; // Bloquea si está pausado

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
        if (this.pausado || !this.fichaActiva) return; // Bloquea si está pausado

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
        if (this.pausado || !this.fichaActiva) return; // Bloquea si está pausado

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
            
            // --- LÓGICA DE DESCUENTO: Descontar y actualizar si el movimiento es válido ---
            if (this.movimientosRestantes > 0) {
                this.movimientosRestantes--;
                this.actualizarContador(); 
            }
            
        }

        if (!movimientoExitoso) {
            this.fichaActiva.x = this.posicionInicialX;
            this.fichaActiva.y = this.posicionInicialY;
        }

        this.fichaActiva.seleccionada = false;
        this.fichaActiva = null;
        this.origenActivo = null;

        this.dibujarTodo();

        // Modificar la condición de terminación para incluir los movimientos restantes
        if (!this.hayMovimientosDisponibles() || this.fichas.length <= 1 || this.movimientosRestantes <= 0) {
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

    // =========================
    // Terminar Juego 
    // =========================
    terminarJuego() {
        this.temporizador.detener();
        this.pausado = true; // Bloquea movimientos
        
        // --- LÓGICA DE RESULTADO ---
        let mensaje;
        let esVictoria = false;
        
        // Condición de Victoria: Solo queda 1 ficha
        if (this.fichas.length === 1) {
            esVictoria = true;
            mensaje = "¡Felicidades, ganaste!";
        } 
        // Condición de Derrota: Se acabaron los movimientos O el tiempo
        else if (this.movimientosRestantes <= 0) {
            // Múltiples líneas con <br>
            mensaje = "Se agotaron tus movimientos con " + this.fichas.length + " fichas.<br>¡Vuelve a intentarlo!";
        }
        else if (this.temporizador.tiempoRestante <= 0) {
            mensaje = "El tiempo se ha agotado.<br>¡Trata de hacerlo más rápido!";
        }
        // Condición de Derrota: Sin movimientos legales y más de 1 ficha
        else {
            mensaje = `Te quedaste sin movimientos con ${this.fichas.length} fichas.<br>¡Sigue practicando!`;
        }
        // --- FIN LÓGICA DE RESULTADO ---

        // Aseguramos que el botón se reinicie
        if (this.botonPausar) this.botonPausar.classList.remove("activo"); 
        
        this.mostrarResultadoFinal(esVictoria, mensaje);
    }

    // =========================
    // Pantalla Final 
    // =========================
    mostrarResultadoFinal(esVictoria, mensaje) {
        const resultadoTitulo = document.getElementById('resultadoTitulo');
        const resultadoMensaje = document.getElementById('resultadoMensaje');
        
        if (resultadoTitulo) {
            
            resultadoTitulo.textContent = esVictoria ? "Victoria" : "Fin del juego"; 
            
            // Usamos una clase para aplicar estilos de color (verde/rojo)
            resultadoTitulo.className = esVictoria ? 'titulo-victoria' : 'titulo-derrota';
        }

        if (resultadoMensaje) {
            // **** USO CRÍTICO DE innerHTML para que <br> funcione ****
            resultadoMensaje.innerHTML = mensaje;
        }

        this.pantallas.mostrarFinal();
    }
}


// Declarar juegoPeg con 'let' fuera del evento para que sea global y el HTML pueda acceder a ella
let juegoPeg; 

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar el objeto y asignarlo a la variable global
    juegoPeg = new Juego("pegCanvas", "./img/pegejecucion/tableropeg.png");
    
    // Iniciar el juego en la pantalla de inicio
    juegoPeg.iniciar();
});

