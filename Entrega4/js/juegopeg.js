
// Coordenadas del centro del tablero
const CENTRO_X = 950; 
const CENTRO_Y = 600;

// Espaciado y tamaño de las fichas 
const ESPACIADO = 120; 
const TAMANO_FICHA = 110; 


// Rutas de las imágenes de las fichas
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

class Ficha {
    constructor(x, y, rutaImagen, tipo) { 
        // Las coordenadas (x, y) son el centro del hueco
        this.x = x - TAMANO_FICHA / 2;
        this.y = y - TAMANO_FICHA / 2; 
        this.ancho = TAMANO_FICHA; 
        this.alto = TAMANO_FICHA;
        this.tipo = tipo; 
        
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
    }

    dibujar(ctx) {
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

        this.botonJugar = document.querySelector(".btn-primary-play");
        if (this.botonJugar) {
            this.botonJugar.addEventListener("click", () => this.iniciarJuego());
        }

        this.botonFinalizar = document.querySelector(".btn-finalizar-juego");
        if (this.botonFinalizar) {
            this.botonFinalizar.addEventListener("click", () => this.finalizarJuego());
        }
        
        this.tablero.imagen.onload = () => {
            this.dibujarTodo();
        };
        
        // Añadir el listener para la interacción con el tablero
        this.tablero.canvas.addEventListener("click", (event) => this.manejarClick(event));
    }
    
    /**
     * Genera las 33 coordenadas para el tablero.
     * La posición central (0,0) queda marcada como vacía.
     */
    generarPosiciones() {
        const posiciones = [];
        for (let row = -3; row <= 3; row++) {
            for (let col = -3; col <= 3; col++) {
                const isCorner = (Math.abs(row) >= 2 && Math.abs(col) >= 2);
                if (!isCorner) {
                    const x = CENTRO_X + col * ESPACIADO;
                    const y = CENTRO_Y + row * ESPACIADO;
                    
                    posiciones.push({
                        id: `${row}_${col}`, 
                        row: row, // Guardar fila para lógica de juego
                        col: col, // Guardar columna para lógica de juego
                        x: x, 
                        y: y,
                        tieneFicha: true 
                    });
                }
            }
        }
        
        // Dejamos el centro (0,0) vacío para la versión estándar (32 fichas)
        const centro = posiciones.find(p => p.id === '0_0');
        if (centro) {
            centro.tieneFicha = false;
        }

        return posiciones; // Retorna 33 posiciones, 32 ocupadas, 1 vacía
    }
    
    /**
     * Inicializa las 32 fichas con una distribución de 16 de Fuego y 16 de Agua, de forma alternada.
     */

    inicializarFichas() {
        this.fichas = [];
        let contadorFichas = 0;
        
        // Solo iteramos sobre las posiciones que tienen ficha (32 en total)
        this.posicionesFijas.forEach(pos => {
            if (pos.tieneFicha) { 
                let tipo, ruta;
                
                // Distribución alternada Fuego/Agua
                if (contadorFichas % 2 === 0) {
                    tipo = "fuego";
                    ruta = RUTA_FICHA_FUEGO;
                } else {
                    tipo = "agua";
                    ruta = RUTA_FICHA_AGUA;
                }
                
                const nuevaFicha = new Ficha(pos.x, pos.y, ruta, tipo); 
                nuevaFicha.posicion = pos; 
                pos.ficha = nuevaFicha;
                
                this.fichas.push(nuevaFicha);
                contadorFichas++;
            }
        });
    }

    dibujarTodo() {
        this.tablero.dibujarTablero(); 
        
        this.fichas.forEach(ficha => {
            ficha.dibujar(this.tablero.ctx); 
        });     
        
    }
    
    iniciarJuego() {
        this.pantallas.mostrarJuego();
        this.dibujarTodo(); 
    }

    finalizarJuego() {
        this.pantallas.mostrarFinal();
    }

    iniciar() {
        this.pantallas.mostrarInicio();
        if (this.tablero.imagen.complete) {
            this.dibujarTodo();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const juegoPeg = new Juego(
        "pegCanvas",
        "./img/pegejecucion/tableropeg.png"
    );
    juegoPeg.iniciar();
});
