// ====================
// CONFIGURACIÓN GLOBAL (Constantes)
// ====================

const BANCO_IMAGENES_4 = [
    './img/blocka/blocka4/img1.png', 
    './img/blocka/blocka4/img2.jpg', 
    './img/blocka/blocka4/img3.jpg',
    './img/blocka/blocka4/img4.jpg', 
    './img/blocka/blocka4/img5.jpg',
    './img/blocka/blocka4/img6.jpg',
    './img/blocka/blocka4/img7.jpg',
    './img/blocka/blocka4/img8.jpg'
];

const BANCO_IMAGENES_6 = [
    './img/blocka/blocka6/img1.jpg',
    './img/blocka/blocka6/img2.webp',
    './img/blocka/blocka6/img3.jpg',
    './img/blocka/blocka6/img4.jpg',
    './img/blocka/blocka6/img5.webp',
    './img/blocka/blocka6/img6.avif',
    './img/blocka/blocka6/img7.jpg',
    './img/blocka/blocka6/img8.jpg'
    
];

const BANCO_IMAGENES_8 = [
    './img/blocka/blocka8/img1.jpg',
    './img/blocka/blocka8/img2.jpeg',
    './img/blocka/blocka8/img3.jpg',
    './img/blocka/blocka8/img4.jpg',
    './img/blocka/blocka8/img5.jpg',
    './img/blocka/blocka8/img6.jpg',
    './img/blocka/blocka8/img7.jpg',
    './img/blocka/blocka8/img8.jpg'
];

const NIVELES = [
    { id: 1, nombre: "Nivel 1", filtro: "escalaGrises" },
    { id: 2, nombre: "Nivel 2", filtro: "brillo" },
    { id: 3, nombre: "Nivel 3", filtro: "negativo" },
    { id: 4, nombre: "Nivel 4", filtro: "blureado" }, // Filtro Blureado
];

const PANTALLAS = [
    "menu-principal",
    "instrucciones",
    "selector-nivel",
    "selector-piezas", 
    "pantalla-pre-juego",
    "pantalla-juego",
    "pantalla-victoria"
];


// ===================================
// MÓDULO FILTROS (Encapsulado)
// ===================================

const Filtros = (() => {
    const BRIGHTNESS_FACTOR = 1.3; 

    // --- Filtros RGB (Píxel a Píxel) ---

    const escalaGrises = (r, g, b) => {
        const promedio = (r + g + b) / 3;
        return [promedio, promedio, promedio];
    };

    const brillo = (r, g, b) => {
        return [
            Math.min(255, r * BRIGHTNESS_FACTOR),
            Math.min(255, g * BRIGHTNESS_FACTOR),
            Math.min(255, b * BRIGHTNESS_FACTOR),
        ];
    };

    const negativo = (r, g, b) => [255 - r, 255 - g, 255 - b];

    // --- FILTRO DE IMAGEN (Cross Blur 9x9 Lineal) ---
    
    /**
     * Aplica el filtro de promedio lineal de 9x9 (Cruz de 17 píxeles).
     * Maneja los bordes promediando solo los píxeles disponibles.
     */
    const blureado = (datosOriginales, width, height) => {
        // Lectura: Copia real de los datos originales.
        const datosParaLeer = new Uint8ClampedArray(datosOriginales);
        
        const radius = 4; // Radio 4 -> 9x9 líneas, 17 píxeles promediados
        
        const offsets = [];
        for (let i = -radius; i <= radius; i++) {
            offsets.push(i);
        }
        
        // Itera sobre cada píxel del canvas, incluyendo los bordes
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let rTotal = 0;
                let gTotal = 0;
                let bTotal = 0;
                let pixelCount = 0; // Contador dinámico para los bordes
                
                // 1. ITERACIÓN HORIZONTAL (Eje X) - Incluye el píxel central (offset 0)
                for (const offset of offsets) {
                    const neighbourX = x + offset;
                    const neighbourY = y; 
                    
                    // CONDICIÓN DE BORDE
                    if (neighbourX >= 0 && neighbourX < width) {
                        const index = (neighbourY * width + neighbourX) * 4;
                        
                        rTotal += datosParaLeer[index];     
                        gTotal += datosParaLeer[index + 1]; 
                        bTotal += datosParaLeer[index + 2]; 
                        pixelCount++;
                    }
                }
                
                // 2. ITERACIÓN VERTICAL (Eje Y) - Omitiendo el píxel central (offset 0)
                const verticalOffsets = offsets.filter(o => o !== 0);
                
                for (const offset of verticalOffsets) {
                    const neighbourX = x; 
                    const neighbourY = y + offset;
                    
                    // CONDICIÓN DE BORDE
                    if (neighbourY >= 0 && neighbourY < height) {
                        const index = (neighbourY * width + neighbourX) * 4;
                        
                        rTotal += datosParaLeer[index];     
                        gTotal += datosParaLeer[index + 1]; 
                        bTotal += datosParaLeer[index + 2]; 
                        pixelCount++;
                    }
                }
                
                // CALCULAR PROMEDIOS
                if (pixelCount > 0) {
                    const centerIndex = (y * width + x) * 4;
                    
                    datosOriginales[centerIndex] = Math.floor(rTotal / pixelCount);
                    datosOriginales[centerIndex + 1] = Math.floor(gTotal / pixelCount);
                    datosOriginales[centerIndex + 2] = Math.floor(bTotal / pixelCount);
                }
            }
        }
        return datosOriginales; 
    };

    // MAPA que define el TIPO de filtro (rgb o imagen) y su función asociada
    const MAPA = {
        escalaGrises: { tipo: 'rgb', fn: escalaGrises },
        brillo: { tipo: 'rgb', fn: brillo },
        negativo: { tipo: 'rgb', fn: negativo },
        blureado: { tipo: 'imagen', fn: blureado }, // Añadido Blureado 
    };
    
    const obtenerFuncion = (nombre) => MAPA[nombre];
    
    return { obtenerFuncion };
})();


// ===================================
// OBJETO VISTA (Manejo del DOM) 
// ===================================

const Vista = {
    ocultarTodasPantallas() {
        PANTALLAS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add("oculto");
        });
    },

    mostrarPantalla(id) {
        this.ocultarTodasPantallas();
        const el = document.getElementById(id);
        if (el) el.classList.remove("oculto");
    },
    
    actualizarRotacionPieza(elemento, rotacion) {
        elemento.style.transform = `rotate(${rotacion}deg)`;
    },

    actualizarTemporizador(tiempoFormateado) {
        const el = document.getElementById("temporizador");
        if (el) el.textContent = tiempoFormateado;
    },
    
    renderizarSelectorNivel(niveles, obtenerRecord, formatearTiempo, obtenerNombreFiltro, iniciarSeleccionPiezasCallback) {
        const grilla = document.getElementById("grilla-niveles");
        if (!grilla) return;
        grilla.innerHTML = "";

        niveles.forEach(nivel => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-nivel";
            const record = obtenerRecord(nivel.id);
            const textoRecord = record ? `Récord: ${formatearTiempo(record)}` : "Sin récord";

            tarjeta.innerHTML = `
                <h3>${nivel.nombre}</h3>
                <p>Filtro: ${obtenerNombreFiltro(nivel.filtro)}</p>
                <p class="tiempo-record">${textoRecord}</p>
            `;
            tarjeta.setAttribute("data-nivel", nivel.id);
            tarjeta.onclick = (e) => iniciarSeleccionPiezasCallback(parseInt(e.currentTarget.getAttribute("data-nivel")));
            grilla.appendChild(tarjeta);
        });
    },
    
    mostrarMensajeVictoria() {
        const mensaje = document.getElementById("mensaje-completado");
        if (!mensaje) return Promise.resolve();
        
        mensaje.classList.remove("oculto");
        setTimeout(() => mensaje.classList.add("mostrar"), 80);

        return new Promise(resolve => {
            setTimeout(() => {
                mensaje.classList.remove("mostrar");
                mensaje.classList.add("oculto");
                resolve();
            }, 2000);
        });
    },
    
    actualizarPantallaVictoria(tiempoFinal, mensajeRecord, esUltimoNivel) {
        document.getElementById("tiempo-victoria").textContent = tiempoFinal;
        document.getElementById("mensaje-record").textContent = mensajeRecord;

        const botonSiguiente = document.getElementById("boton-siguiente-nivel");
        if (esUltimoNivel) {
            botonSiguiente.classList.add("oculto");
        } else {
            botonSiguiente.classList.remove("oculto");
        }
    }
};


// ====================
// CLASE TEMPORIZADOR 
// ====================

class Temporizador {
    constructor(callback) {
        this.tiempoInicio = 0;
        this.tiempoTranscurrido = 0;
        this.intervalo = null;
        this.pausado = false;
        this.callbackActualizar = callback;
    }

    iniciar() {
        this.tiempoInicio = Date.now() - (this.tiempoTranscurrido * 1000); 
        this.pausado = false;
        this.detener();

        this.intervalo = setInterval(() => {
            if (!this.pausado) {
                this.tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);
                this.callbackActualizar(this.tiempoTranscurrido);
            }
        }, 200);
    }

    pausar() {
        this.pausado = true;
    }

    reanudar() {
        this.pausado = false;
        this.tiempoInicio = Date.now() - (this.tiempoTranscurrido * 1000); 
    }

    detener() {
        if (this.intervalo) clearInterval(this.intervalo);
        this.intervalo = null;
    }

    penalizar(segundos) {
        this.tiempoInicio -= (segundos * 1000); 
    }

    get tiempo() {
        return this.tiempoTranscurrido;
    }
    
    set tiempo(segundos) {
        this.tiempoTranscurrido = segundos;
    }
}


// ====================
// CLASE PIEZA 
// ====================

class Pieza {
    constructor(elemento, rotacionInicial, juegoControlador) {
        this.elemento = elemento;
        this.rotacion = rotacionInicial;
        this.estaFija = false;
        this.juegoControlador = juegoControlador;

        this.elemento.onclick = (e) => this.rotar(-90, e);
        this.elemento.oncontextmenu = (e) => this.rotar(90, e);
        
        Vista.actualizarRotacionPieza(this.elemento, this.rotacion);
    }

    rotar(grados, evento) {
        evento.preventDefault();
        if (this.juegoControlador.estaPausado || this.estaFija) return; 

        this.rotacion = (this.rotacion + grados + 360) % 360;

        Vista.actualizarRotacionPieza(this.elemento, this.rotacion);
        this.juegoControlador.verificarVictoria();
    }

    fijar() {
        this.rotacion = 0;
        this.estaFija = true;
        Vista.actualizarRotacionPieza(this.elemento, this.rotacion);
        this.elemento.classList.add("pieza-fija");
    }
    
    esCorrecta() {
        return this.rotacion === 0;
    }
}


// ====================
// CLASE JUEGO (Controlador Principal) - 
// ====================

class Juego {
    constructor() {
        this.nivelActual = 1;
        this.cantidadPiezas = 4;
        this.imagenActual = null;
        this.piezas = [];
        this.estaPausado = false;
        this.ayuditaUsada = false;
        
        this.temporizador = new Temporizador(this.actualizarTemporizadorVista.bind(this));
        this.bancoActual = BANCO_IMAGENES_4;
    }
    
    obtenerBancoPorCantidad(cantidad) {
        if (cantidad === 4) return BANCO_IMAGENES_4;
        if (cantidad === 6) return BANCO_IMAGENES_6;
        if (cantidad === 8) return BANCO_IMAGENES_8;
        return BANCO_IMAGENES_4;
    }

    // Formateo de tiempo //
    formatearTiempo(segundos) {
        const m = Math.floor(segundos / 60);
        const s = segundos % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    
    // Delega la actualización de la vista del temporizador //
    actualizarTemporizadorVista(tiempoSegundos) {
        Vista.actualizarTemporizador(this.formatearTiempo(tiempoSegundos));
    }

    // --- Control de Aplicación --- //
    
    inicializar() {
        Vista.renderizarSelectorNivel(NIVELES, this.obtenerRecord.bind(this), this.formatearTiempo.bind(this), this.obtenerNombreFiltro.bind(this), this.iniciarSeleccionPiezas.bind(this));
        Vista.mostrarPantalla("menu-principal");
        this.temporizador.detener();

        // Listeners globales //
        document.getElementById("btn-jugar-inicio").onclick = () => Vista.mostrarPantalla("selector-nivel");
        document.getElementById("btn-instrucciones").onclick = () => Vista.mostrarPantalla("instrucciones");
        document.getElementById("btn-volver-menu-instrucciones").onclick = () => Vista.mostrarPantalla("menu-principal");
        document.getElementById("btn-volver-menu-selector").onclick = () => Vista.mostrarPantalla("menu-principal");
        document.getElementById("btn-menu-juego").onclick = () => Vista.mostrarPantalla("menu-principal");
        document.getElementById("btn-menu-victoria").onclick = () => Vista.mostrarPantalla("menu-principal");
    
        document.getElementById("boton-siguiente-nivel").onclick = this.siguienteNivel.bind(this);
        document.getElementById("boton-pausar-juego").onclick = this.pausarJuego.bind(this);
        document.getElementById("boton-ayudita").onclick = this.usarAyudita.bind(this);
        document.getElementById("btn-seleccionar-nivel-victoria").onclick = () => Vista.mostrarPantalla("selector-nivel");

        // LISTENERS SELECCIÓN DE PIEZAS //
        const botonesPiezas = document.querySelectorAll('.boton-piezas');
        botonesPiezas.forEach(btn => {
            btn.onclick = () => {
                botonesPiezas.forEach(b => b.classList.remove('seleccionado'));
                btn.classList.add('seleccionado');
                this.seleccionarCantidadPiezas(parseInt(btn.dataset.cantidad));
            };
        });
        
        const btnComenzar = document.getElementById('btn-comenzar-juego');
        if (btnComenzar) btnComenzar.onclick = this.iniciarJuegoConSeleccion.bind(this);

        const btnVolverNiveles = document.getElementById('btn-volver-niveles');
        if (btnVolverNiveles) btnVolverNiveles.onclick = () => Vista.mostrarPantalla("selector-nivel");
    }

    iniciarSeleccionPiezas(idNivel) {
        this.nivelActual = idNivel;
        Vista.mostrarPantalla("selector-piezas");
        
        this.seleccionarCantidadPiezas(4);
        const btn4Piezas = document.getElementById('btn-4piezas');
        document.querySelectorAll('.boton-piezas').forEach(b => b.classList.remove('seleccionado'));
        if (btn4Piezas) btn4Piezas.classList.add('seleccionado');
        document.getElementById("btn-comenzar-juego").disabled = false;
    }

    seleccionarCantidadPiezas(num) {
        this.cantidadPiezas = num;
        this.bancoActual = this.obtenerBancoPorCantidad(num);
        const indice = Math.floor(Math.random() * this.bancoActual.length);
        this.imagenActual = this.bancoActual[indice];
        document.getElementById("btn-comenzar-juego").disabled = false;
    }

    iniciarJuegoConSeleccion() {
        if (!this.cantidadPiezas) return;

        this.temporizador.tiempo = 0; 
        this.actualizarTemporizadorVista(0);
        this.estaPausado = false;
        this.ayuditaUsada = false;
        
        this.configurarPreJuego();
    }

    // --- Lógica del Juego --- //

    configurarPreJuego() {
        Vista.mostrarPantalla("pantalla-pre-juego");

        const nivelConfig = NIVELES.find(n => n.id === this.nivelActual);
        const infoText = `${nivelConfig.nombre} | Filtro: ${this.obtenerNombreFiltro(nivelConfig.filtro)} | ${this.cantidadPiezas} piezas`;
        document.getElementById("nivel-seleccionado-info").textContent = infoText;

        const previewContainer = document.getElementById("imagenes-preview-container");
        previewContainer.innerHTML = "";
        
        // Usa el banco actual
        const imagenesParaPreview = this.bancoActual.slice(0, 8);

        imagenesParaPreview.forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.className = "imagen-preview";
            img.onerror = () => { img.src = 'img/placeholder.png'; }; 
            previewContainer.appendChild(img);
        });

        setTimeout(() => this.animarSeleccionImagen(), 500);
    }
    
    animarSeleccionImagen() {
        const previews = Array.from(document.querySelectorAll(".imagen-preview"));
        let imagenFinalIndex = this.bancoActual.indexOf(this.imagenActual);
        const numPreviews = previews.length;
        
        if (imagenFinalIndex >= numPreviews) {
            imagenFinalIndex = numPreviews - 1;
            previews[imagenFinalIndex].src = this.imagenActual;
        }

        previews.forEach(p => p.classList.remove("seleccionada", "final-zoom")); 

        let counter = 0;
        const intervalTime = 120;
        const totalCarruselSteps = numPreviews * 3 + imagenFinalIndex; 

        const carrusel = setInterval(() => {
            if (counter > 0) {
                 const prevIndex = (counter - 1) % numPreviews;
                 previews[prevIndex].classList.remove("seleccionada");
            }
            
            if (counter >= totalCarruselSteps) {
                clearInterval(carrusel);
                
                previews.forEach(p => p.classList.remove("seleccionada"));
                
                const imagenFinalElement = previews[imagenFinalIndex];
                imagenFinalElement.classList.add("seleccionada");
                imagenFinalElement.classList.add("final-zoom");
                
                setTimeout(() => this.cargarImagenYConfigurar(), 1500);
                
                return;
            }

            const currentElement = previews[counter % numPreviews];
            currentElement.classList.add("seleccionada");

            counter++;
        }, intervalTime);
    }

    cargarImagenYConfigurar() {
        document.getElementById("boton-pausar-juego").textContent = "Pausar";
        document.getElementById("boton-pausar-juego").classList.remove("activo");
        document.getElementById("boton-ayudita").disabled = false;
        document.getElementById("boton-ayudita").classList.remove("deshabilitado");

        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
            this.configurarPiezas(img);
            Vista.mostrarPantalla("pantalla-juego");
            this.temporizador.iniciar();
        };
        
        img.onerror = () => {
             alert("Error al cargar la imagen. Intenta de nuevo."); 
             Vista.mostrarPantalla("selector-nivel");
        };
        
        img.src = this.imagenActual;
    }

    configurarPiezas(img) {
        const grilla = document.getElementById("grilla-blocka");
        grilla.innerHTML = ""; 
        this.piezas = [];

        const total = this.cantidadPiezas;
        const filas = 2; 
        const columnas = total / filas; 
        
        grilla.classList.remove('grilla-6', 'grilla-8');
        if (total === 6) grilla.classList.add('grilla-6');
        else if (total === 8) grilla.classList.add('grilla-8');
        
        const anchoPieza = img.width / columnas;
        const altoPieza = img.height / filas;

        for (let i = 0; i < total; i++) {
            const fila = Math.floor(i / columnas);
            const columna = i % columnas;

            const divPieza = document.createElement("div");
            divPieza.className = "pieza-blocka";

            const canvas = document.createElement("canvas");
            canvas.width = anchoPieza;
            canvas.height = altoPieza;
            const ctx = canvas.getContext("2d");
            
            ctx.drawImage(img, 
                columna * anchoPieza, 
                fila * altoPieza,     
                anchoPieza, altoPieza, 
                0, 0, 
                anchoPieza, altoPieza
            );
            
            this.aplicarFiltro(canvas);
            divPieza.appendChild(canvas);

            const rotaciones = [0, 90, 180, 270];
            const rotacionInicial = rotaciones[Math.floor(Math.random() * 4)];

            // INSTANCIACIÓN DE LA CLASE PIEZA //
            const piezaObj = new Pieza(divPieza, rotacionInicial, this); 
            this.piezas.push(piezaObj);
            
            grilla.appendChild(divPieza);
        }
    }

    aplicarFiltro(canvas) {
        const ctx = canvas.getContext("2d");
        const datosImagen = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const datos = datosImagen.data;

        const nivelConfig = NIVELES.find(n => n.id === this.nivelActual);
        if (!nivelConfig) return; 

        // Obtenemos TIPO y FUNCION
        const filtroObj = Filtros.obtenerFuncion(nivelConfig.filtro);
        if (!filtroObj) return;

        const { tipo, fn } = filtroObj;

        // LÓGICA DE APLICACIÓN SEGÚN EL TIPO
        if (tipo === 'rgb') {
            // Aplica filtros píxel a píxel
            for (let i = 0; i < datos.length; i += 4) {
                const [r, g, b] = [datos[i], datos[i + 1], datos[i + 2]];
                const [rN, gN, bN] = fn(r, g, b);
                [datos[i], datos[i + 1], datos[i + 2]] = [rN, gN, bN];
            }
        } else if (tipo === 'imagen') {
            // Aplica filtros a la imagen completa (Cross Blur)
            fn(datos, canvas.width, canvas.height); 
        }

        ctx.putImageData(datosImagen, 0, 0);
    }
    
    usarAyudita() {
        if (this.estaPausado || this.ayuditaUsada) return;
        
        const incorrectas = this.piezas.filter(p => !p.estaFija && !p.esCorrecta()); 
        if (!incorrectas.length) return;
        
        const pieza = incorrectas[Math.floor(Math.random() * incorrectas.length)];
        
        pieza.fijar();
        this.temporizador.penalizar(5); 

        this.ayuditaUsada = true;
        const botonAyudita = document.getElementById("boton-ayudita");
        botonAyudita.disabled = true;
        botonAyudita.classList.add("deshabilitado");
        
        this.verificarVictoria();
    }

    verificarVictoria() {
        if (this.piezas.every(p => p.esCorrecta())) {
            this.temporizador.detener();
            
            this.piezas.forEach(p => {
                p.elemento.onclick = null;
                p.elemento.oncontextmenu = null;
            });
            
            this.quitarFiltros();
            
            Vista.mostrarMensajeVictoria().then(() => this.manejarVictoria());
        }
    }
    
    quitarFiltros() {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
             const filas = 2; 
             const columnas = this.cantidadPiezas / filas; 

             const anchoPieza = img.width / columnas;
             const altoPieza = img.height / filas;
            
            this.piezas.forEach((pieza, i) => {
                 const fila = Math.floor(i / columnas);
                 const columna = i % columnas;
                 const ctx = pieza.elemento.querySelector('canvas').getContext("2d");

                 ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                 ctx.drawImage(img, columna * anchoPieza, fila * altoPieza, anchoPieza, altoPieza, 0, 0, anchoPieza, altoPieza);
            });
        };
        img.src = this.imagenActual;
    }

    manejarVictoria() {
        const tiempoFinal = this.temporizador.tiempo;
        const record = this.obtenerRecord(this.nivelActual);
        
        let msg = "";
        if (!record || tiempoFinal < record) {
            this.guardarRecord(this.nivelActual, tiempoFinal);
            msg = "🏆 ¡Nuevo récord!";
        } else {
             msg = `Récord actual: ${this.formatearTiempo(record)}`;
        }
        
        Vista.actualizarPantallaVictoria(
            this.formatearTiempo(tiempoFinal),
            msg, 
            this.nivelActual >= NIVELES.length
        );
        
        Vista.mostrarPantalla("pantalla-victoria");
    }
    
    siguienteNivel() {
        if (this.nivelActual < NIVELES.length) {
            this.iniciarSeleccionPiezas(this.nivelActual + 1); 
        }
    }

    pausarJuego() {
        this.estaPausado = !this.estaPausado;
        const btn = document.getElementById("boton-pausar-juego");
        
        if (this.estaPausado) {
            this.temporizador.pausar();
            btn.textContent = "Reanudar";
        } else {
            this.temporizador.reanudar();
            btn.textContent = "Pausar";
        }
        btn.classList.toggle("activo", this.estaPausado);
    }
    
    // --- Récords y Filtros  --- //
    
    guardarRecord(nivel, tiempo) {
        localStorage.setItem(`blocka_record_${nivel}`, tiempo);
    }

    obtenerRecord(nivel) {
        return parseInt(localStorage.getItem(`blocka_record_${nivel}`)) || null;
    }

    obtenerNombreFiltro(filtro) {
        return {
            escalaGrises: "Escala de Grises",
            brillo: "Brillo 30%",
            negativo: "Negativo",
            blureado: "Blureado", // Filtro Blureado 
        }[filtro] || filtro;
    }
}

// ====================
// PUNTO DE INICIO
// ====================

// Instancia única del juego (Controlador Singleton)
const juegoControlador = new Juego(); 
window.onload = () => juegoControlador.inicializar();

