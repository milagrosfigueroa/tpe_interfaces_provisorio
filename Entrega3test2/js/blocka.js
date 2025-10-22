// ====================
// CONFIGURACIÓN GLOBAL (Sin cambios)
// ====================

const BANCO_IMAGENES = [
    './img/blocka/img1.jpeg',
    './img/blocka/img2.jpg',
    './img/blocka/img3.jpg',
    './img/blocka/img4.jpg',
    './img/blocka/img5.jpeg',
    './img/blocka/img6.jpg',
    './img/blocka/img7.jpeg',
    './img/blocka/img8.jpg'
];

const NIVELES = [
    { id: 1, nombre: "Nivel 1", filtro: "escalaGrises" },
    { id: 2, nombre: "Nivel 2", filtro: "brillo" },
    { id: 3, nombre: "Nivel 3", filtro: "negativo" },
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
// FUNCIONES DE FILTROS 🎨 (Sin cambios)
// ===================================

const BRIGHTNESS_FACTOR = 1.3;

const filtroEscalaGrises = (r, g, b) => {
    const promedio = (r + g + b) / 3;
    return [promedio, promedio, promedio];
};

const filtroBrillo = (r, g, b) => {
    return [
        Math.min(255, r * BRIGHTNESS_FACTOR),
        Math.min(255, g * BRIGHTNESS_FACTOR),
        Math.min(255, b * BRIGHTNESS_FACTOR),
    ];
};

const filtroNegativo = (r, g, b) => [255 - r, 255 - g, 255 - b];

const FILTROS_MAP = {
    escalaGrises: filtroEscalaGrises,
    brillo: filtroBrillo,
    negativo: filtroNegativo,
};

// ====================
// OBJETO JUEGO (Cambios abajo)
// ====================

const juego = {
    nivelActual: 1,
    cantidadPiezas: 4, 
    imagenActual: null,
    piezas: [],
    intervaloTemporizador: null,
    tiempoInicio: 0,
    tiempoTranscurrido: 0,
    estaPausado: false,
    ayuditaUsada: false,

    ocultarTodasPantallas() {
        PANTALLAS.forEach(id => document.getElementById(id).classList.add("oculto"));
    },

    mostrarPantalla(id) {
        this.ocultarTodasPantallas();
        document.getElementById(id).classList.remove("oculto");
    },

    inicializar() {
        this.renderizarSelectorNivel();
        this.mostrarPantalla("menu-principal");
        this.detenerTemporizador();

        // Listeners globales
        document.getElementById("btn-jugar-inicio").onclick = () => this.mostrarPantalla("selector-nivel");
        document.getElementById("btn-instrucciones").onclick = () => this.mostrarPantalla("instrucciones");
        document.getElementById("btn-volver-menu-instrucciones").onclick = () => this.mostrarPantalla("menu-principal");
        document.getElementById("btn-volver-menu-selector").onclick = () => this.mostrarPantalla("menu-principal");
        document.getElementById("btn-menu-juego").onclick = () => this.mostrarPantalla("menu-principal");
        document.getElementById("btn-menu-victoria").onclick = () => this.mostrarPantalla("menu-principal");

        // Listeners que requieren bind
        document.getElementById("boton-siguiente-nivel").onclick = this.siguienteNivel.bind(this);
        document.getElementById("boton-pausar-juego").onclick = this.pausarJuego.bind(this);
        document.getElementById("boton-ayudita").onclick = this.usarAyudita.bind(this);
        document.getElementById("btn-seleccionar-nivel-victoria").onclick = () => this.mostrarPantalla("selector-nivel");

        // LISTENERS SELECCIÓN DE PIEZAS
        const botonesPiezas = document.querySelectorAll('.boton-piezas');
        botonesPiezas.forEach(btn => {
            btn.onclick = () => {
                botonesPiezas.forEach(b => b.classList.remove('seleccionado'));
                btn.classList.add('seleccionado');

                const cantidad = parseInt(btn.dataset.cantidad);
                this.seleccionarCantidadPiezas(cantidad);
            };
        });
        
        const btnComenzar = document.getElementById('btn-comenzar-juego');
        if (btnComenzar) {
            btnComenzar.onclick = this.iniciarJuegoConSeleccion.bind(this);
        }

        const btnVolverNiveles = document.getElementById('btn-volver-niveles');
        if (btnVolverNiveles) {
            btnVolverNiveles.onclick = () => this.mostrarPantalla("selector-nivel");
        }
    },

    renderizarSelectorNivel() {
        const grilla = document.getElementById("grilla-niveles");
        grilla.innerHTML = "";

        NIVELES.forEach(nivel => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-nivel";
            const record = this.obtenerRecord(nivel.id);
            const textoRecord = record ? `Récord: ${this.formatearTiempo(record)}` : "Sin récord";

            tarjeta.innerHTML = `
                <h3>${nivel.nombre}</h3>
                <p>Filtro: ${this.obtenerNombreFiltro(nivel.filtro)}</p>
                <p class="tiempo-record">${textoRecord}</p>
            `;
            tarjeta.setAttribute("data-nivel", nivel.id);
            tarjeta.onclick = (e) => this.iniciarSeleccionPiezas(parseInt(e.currentTarget.getAttribute("data-nivel")));
            grilla.appendChild(tarjeta);
        });
    },

    iniciarSeleccionPiezas(idNivel) {
        this.nivelActual = idNivel;
        this.mostrarPantalla("selector-piezas");
        
        this.seleccionarCantidadPiezas(4);
        
        const btn4Piezas = document.getElementById('btn-4piezas');
        if (btn4Piezas) {
             document.querySelectorAll('.boton-piezas').forEach(b => b.classList.remove('seleccionado'));
             btn4Piezas.classList.add('seleccionado');
        }
        document.getElementById("btn-comenzar-juego").disabled = false;
    },

    seleccionarCantidadPiezas(num) {
        this.cantidadPiezas = num;
        
        const indice = Math.floor(Math.random() * BANCO_IMAGENES.length);
        this.imagenActual = BANCO_IMAGENES[indice];
        
        document.getElementById("btn-comenzar-juego").disabled = false;
    },

    iniciarJuegoConSeleccion() {
        if (!this.cantidadPiezas) return;

        this.tiempoTranscurrido = 0;
        this.actualizarTemporizador();
        this.estaPausado = false;
        this.ayuditaUsada = false;
        
        this.configurarPreJuego();
    },

    configurarPreJuego() {
        this.mostrarPantalla("pantalla-pre-juego");

        const nivelConfig = NIVELES.find(n => n.id === this.nivelActual);
        const infoText = `${nivelConfig.nombre} | Filtro: ${this.obtenerNombreFiltro(nivelConfig.filtro)} | ${this.cantidadPiezas} piezas`;
        document.getElementById("nivel-seleccionado-info").textContent = infoText;

        const previewContainer = document.getElementById("imagenes-preview-container");
        previewContainer.innerHTML = "";
        const imagenesParaPreview = BANCO_IMAGENES.slice(0, 8);

        imagenesParaPreview.forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.className = "imagen-preview";
            img.onerror = () => { img.src = 'img/placeholder.png'; }; 
            previewContainer.appendChild(img);
        });

        setTimeout(() => this.animarSeleccionImagen(), 500);
    },

    // ==============================================
    // CORRECCIÓN 1: Lógica de animación para seleccionar 1 imagen
    // ==============================================
    animarSeleccionImagen() {
        const previews = Array.from(document.querySelectorAll(".imagen-preview"));
        let imagenFinalIndex = BANCO_IMAGENES.indexOf(this.imagenActual);
        const numPreviews = previews.length;
        
        // Si la imagen seleccionada no está entre los previews iniciales, mostramos una
        if (imagenFinalIndex >= numPreviews) {
            imagenFinalIndex = numPreviews - 1;
            previews[imagenFinalIndex].src = this.imagenActual;
        }

        previews.forEach(p => p.classList.remove("seleccionada", "final-zoom")); 

        let counter = 0;
        const intervalTime = 120;
        // Hacemos que la animación dure 3 ciclos completos + la posición final
        const totalCarruselSteps = numPreviews * 3 + imagenFinalIndex; 

        const carrusel = setInterval(() => {
            // Eliminar la clase 'seleccionada' del elemento anterior
            if (counter > 0) {
                 const prevIndex = (counter - 1) % numPreviews;
                 previews[prevIndex].classList.remove("seleccionada");
            }
            
            // Si hemos pasado la cantidad total de pasos
            if (counter >= totalCarruselSteps) {
                clearInterval(carrusel);
                
                // Asegurarse de que SÓLO la imagen final tiene la clase 'seleccionada'
                previews.forEach(p => p.classList.remove("seleccionada"));
                
                const imagenFinalElement = previews[imagenFinalIndex];
                imagenFinalElement.classList.add("seleccionada"); // Se queda seleccionada
                imagenFinalElement.classList.add("final-zoom");
                
                // Pasar a la carga de imagen
                setTimeout(() => this.cargarImagenYConfigurar(), 1500);
                
                return;
            }

            // Aplicar la clase 'seleccionada' al elemento actual del carrusel
            const currentElement = previews[counter % numPreviews];
            currentElement.classList.add("seleccionada");

            counter++;
        }, intervalTime);
    },
    // ==============================================
    // FIN CORRECCIÓN 1
    // ==============================================

    // ==============================================
    // CORRECCIÓN 2: Manejo de carga de imagen para evitar el error de alert
    // ==============================================
    cargarImagenYConfigurar() {
        // Restaurar botones (Ya estaba bien)
        document.getElementById("boton-pausar-juego").textContent = "Pausar";
        document.getElementById("boton-pausar-juego").classList.remove("activo");
        document.getElementById("boton-ayudita").disabled = false;
        document.getElementById("boton-ayudita").classList.remove("deshabilitado");

        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
            // El proceso de configuración de piezas y inicio de juego se ejecuta SOLO si la imagen carga bien
            this.configurarPiezas(img);
            this.mostrarPantalla("pantalla-juego");
            this.iniciarTemporizador();
        };
        
        img.onerror = () => {
             // Esto se dispara si hay un problema con la URL de la imagen (Ej. no existe)
             // El código ya está bien aquí, el problema anterior era de concurrencia.
             alert("Error al cargar la imagen. Intenta de nuevo."); 
             this.mostrarPantalla("selector-nivel");
        };
        
        // Iniciar la carga de la imagen
        img.src = this.imagenActual;
    },
    // ==============================================
    // FIN CORRECCIÓN 2
    // ==============================================

    configurarPiezas(img) {
        const grilla = document.getElementById("grilla-blocka");
        grilla.innerHTML = "";
        this.piezas = [];

        const total = this.cantidadPiezas;
        let columnas = 0;
        let filas = 0;
        
        if (total === 4) {
            columnas = 2;
            filas = 2;
        } else if (total === 6) {
            columnas = 2; 
            filas = 3;
        } else if (total === 8) {
            columnas = 2; 
            filas = 4;
        } else {
            columnas = 2;
            filas = 2;
        }

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
            
            ctx.drawImage(img, columna * anchoPieza, fila * altoPieza, anchoPieza, altoPieza, 0, 0, anchoPieza, altoPieza);
            
            this.aplicarFiltro(canvas);
            divPieza.appendChild(canvas);

            const rotaciones = [0, 90, 180, 270];
            const rotacionInicial = rotaciones[Math.floor(Math.random() * 4)];

            const pieza = { elemento: divPieza, rotacion: rotacionInicial, estaFija: false };
            this.piezas.push(pieza);
            this.actualizarRotacion(pieza);

            divPieza.onclick = (e) => this.rotarPieza(pieza, -90, e);
            divPieza.oncontextmenu = (e) => this.rotarPieza(pieza, 90, e);
            
            grilla.appendChild(divPieza);
        }

        grilla.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;
        grilla.style.gridTemplateRows = `repeat(${filas}, 1fr)`;
    },

    aplicarFiltro(canvas) {
        const ctx = canvas.getContext("2d");
        const datosImagen = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const datos = datosImagen.data;

        const nivelConfig = NIVELES.find(n => n.id === this.nivelActual);
        if (!nivelConfig) return; 

        const funcionFiltro = FILTROS_MAP[nivelConfig.filtro];
        if (!funcionFiltro) return;

        for (let i = 0; i < datos.length; i += 4) {
            const [r, g, b] = [datos[i], datos[i + 1], datos[i + 2]];
            const [rN, gN, bN] = funcionFiltro(r, g, b);
            [datos[i], datos[i + 1], datos[i + 2]] = [rN, gN, bN];
        }

        ctx.putImageData(datosImagen, 0, 0);
    },

    rotarPieza(pieza, grados, e) {
        e.preventDefault();
        if (this.estaPausado || pieza.estaFija) return;
        pieza.rotacion = (pieza.rotacion + grados + 360) % 360;
        this.actualizarRotacion(pieza);
        this.verificarVictoria();
    },

    actualizarRotacion(pieza) {
        pieza.elemento.style.transform = `rotate(${pieza.rotacion}deg)`;
    },

    usarAyudita() {
        if (this.estaPausado || this.ayuditaUsada) return;
        const incorrectas = this.piezas.filter(p => !p.estaFija && p.rotacion !== 0);
        if (!incorrectas.length) return;
        
        const pieza = incorrectas[Math.floor(Math.random() * incorrectas.length)];
        pieza.rotacion = 0;
        pieza.estaFija = true; 
        this.actualizarRotacion(pieza);
        pieza.elemento.classList.add("pieza-fija");

        this.tiempoInicio -= 5000; 

        this.ayuditaUsada = true;
        const botonAyudita = document.getElementById("boton-ayudita");
        botonAyudita.disabled = true;
        botonAyudita.classList.add("deshabilitado");
        
        this.verificarVictoria();
    },

    verificarVictoria() {
        if (this.piezas.every(p => p.rotacion === 0)) {
            this.detenerTemporizador();
            
            this.piezas.forEach(p => {
                p.elemento.onclick = null;
                p.elemento.oncontextmenu = null;
            });
            
            const mensaje = document.getElementById("mensaje-completado");
            mensaje.classList.remove("oculto");
            setTimeout(() => mensaje.classList.add("mostrar"), 80); 
            
            setTimeout(() => {
                 mensaje.classList.remove("mostrar");
                 mensaje.classList.add("oculto");
                 this.manejarVictoria();
            }, 2000);
            
            this.quitarFiltros();
        }
    },
    
    quitarFiltros() {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
             const columnas = this.cantidadPiezas === 4 ? 2 : 2; 
             const filas = this.cantidadPiezas === 4 ? 2 : this.cantidadPiezas / columnas;

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
    },

    manejarVictoria() {
        const tiempoFinal = this.tiempoTranscurrido;
        const record = this.obtenerRecord(this.nivelActual);
        document.getElementById("tiempo-victoria").textContent = this.formatearTiempo(tiempoFinal);
        
        let msg = "";
        if (!record || tiempoFinal < record) {
            this.guardarRecord(this.nivelActual, tiempoFinal);
            msg = "🏆 ¡Nuevo récord!";
        } else {
             msg = `Récord actual: ${this.formatearTiempo(record)}`;
        }
        document.getElementById("mensaje-record").textContent = msg;
        
        const botonSiguiente = document.getElementById("boton-siguiente-nivel");
        if (this.nivelActual < NIVELES.length) {
            botonSiguiente.classList.remove("oculto");
        } else {
            botonSiguiente.classList.add("oculto");
        }
        
        this.mostrarPantalla("pantalla-victoria");
    },
    
    siguienteNivel() {
        if (this.nivelActual < NIVELES.length) {
            this.iniciarSeleccionPiezas(this.nivelActual + 1); 
        }
    },

    iniciarTemporizador() {
        this.tiempoInicio = Date.now() - (this.tiempoTranscurrido * 1000); 
        
        this.detenerTemporizador();
        this.intervaloTemporizador = setInterval(() => {
            if (!this.estaPausado) {
                const tiempoPasadoDesdeInicio = Math.floor((Date.now() - this.tiempoInicio) / 1000);
                this.tiempoTranscurrido = tiempoPasadoDesdeInicio;
                this.actualizarTemporizador();
            }
        }, 200);
    },

    detenerTemporizador() {
        if (this.intervaloTemporizador) clearInterval(this.intervaloTemporizador);
        this.intervaloTemporizador = null;
    },

    pausarJuego() {
        this.estaPausado = !this.estaPausado;
        const btn = document.getElementById("boton-pausar-juego");
        btn.textContent = this.estaPausado ? "Reanudar" : "Pausar";
        btn.classList.toggle("activo", this.estaPausado);
        
        if (!this.estaPausado) {
            this.tiempoInicio = Date.now() - (this.tiempoTranscurrido * 1000);
        }
    },

    actualizarTemporizador() {
        document.getElementById("temporizador").textContent = this.formatearTiempo(this.tiempoTranscurrido);
    },

    formatearTiempo(segundos) {
        const m = Math.floor(segundos / 60);
        const s = segundos % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    },

    guardarRecord(nivel, tiempo) {
        localStorage.setItem(`blocka_record_${nivel}`, tiempo);
    },

    obtenerRecord(nivel) {
        return parseInt(localStorage.getItem(`blocka_record_${nivel}`)) || null;
    },

    obtenerNombreFiltro(filtro) {
        return {
            escalaGrises: "Escala de Grises",
            brillo: "Brillo 30%",
            negativo: "Negativo",
        }[filtro] || filtro;
    },
};

window.onload = () => juego.inicializar();