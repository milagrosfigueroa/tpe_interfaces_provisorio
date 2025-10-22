// ====================
// CONFIGURACIÓN GLOBAL
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

const PANTALLAS = ["menu-principal", "instrucciones", "selector-nivel", "pantalla-pre-juego", "pantalla-juego", "pantalla-victoria"];

// ===================================
// FUNCIONES PURAS PARA LOS FILTROS 🎨
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

const filtroNegativo = (r, g, b) => {
    return [
        255 - r,
        255 - g,
        255 - b,
    ];
};

const FILTROS_MAP = {
    escalaGrises: filtroEscalaGrises,
    brillo: filtroBrillo,
    negativo: filtroNegativo,
};


// ====================
// OBJETO JUEGO
// ====================

const juego = {
    nivelActual: 1,
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

        document.getElementById("btn-jugar-inicio").onclick = () => this.mostrarPantalla("selector-nivel");
        document.getElementById("btn-instrucciones").onclick = () => this.mostrarPantalla("instrucciones");
        document.getElementById("btn-volver-menu-instrucciones").onclick = () => this.mostrarPantalla("menu-principal");
        document.getElementById("btn-volver-menu-selector").onclick = () => this.mostrarPantalla("menu-principal");

        document.getElementById("btn-menu-juego").onclick = () => this.mostrarPantalla("menu-principal");
        document.getElementById("btn-menu-victoria").onclick = () => this.mostrarPantalla("menu-principal");
        document.getElementById("boton-siguiente-nivel").onclick = this.siguienteNivel.bind(this);
        document.getElementById("boton-pausar-juego").onclick = this.pausarJuego.bind(this);
        document.getElementById("boton-ayudita").onclick = this.usarAyudita.bind(this);
        document.getElementById("btn-seleccionar-nivel-victoria").onclick = () => this.mostrarPantalla("selector-nivel");
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
            tarjeta.onclick = (e) => this.iniciarNivel(parseInt(e.currentTarget.getAttribute("data-nivel")));
            grilla.appendChild(tarjeta);
        });
    },

    iniciarNivel(idNivel) {
        this.nivelActual = idNivel;
        this.estaPausado = false;
        this.ayuditaUsada = false;

        const indice = Math.floor(Math.random() * BANCO_IMAGENES.length);
        this.imagenActual = BANCO_IMAGENES[indice];

        this.configurarPreJuego();
    },

    configurarPreJuego() {
        this.mostrarPantalla("pantalla-pre-juego");

        const nivelConfig = NIVELES.find(n => n.id === this.nivelActual);
        const infoText = `${nivelConfig.nombre} | Filtro: ${this.obtenerNombreFiltro(nivelConfig.filtro)}`;
        document.getElementById("nivel-seleccionado-info").textContent = infoText;

        const previewContainer = document.getElementById("imagenes-preview-container");
        previewContainer.innerHTML = "";
        
        const numPreviews = Math.min(8, BANCO_IMAGENES.length); 
        const imagenesParaPreview = BANCO_IMAGENES.slice(0, numPreviews);

        imagenesParaPreview.forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.className = "imagen-preview";
            img.onerror = () => { img.src = 'img/placeholder.png'; }; 
            previewContainer.appendChild(img);
        });


        // Iniciar la animación de selección después de un pequeño retraso
        setTimeout(() => this.animarSeleccionImagen(), 500);
    },

    animarSeleccionImagen() {
        const previews = Array.from(document.querySelectorAll(".imagen-preview"));
        let imagenFinalIndex = BANCO_IMAGENES.indexOf(this.imagenActual);
        
        if (imagenFinalIndex >= previews.length) {
            imagenFinalIndex = previews.length - 1;
            previews[imagenFinalIndex].src = this.imagenActual;
        }

        previews.forEach(p => p.classList.remove("seleccionada", "final-zoom"));

        let currentIndex = 0;
        const intervalTime = 120; 
        const totalCarruselTime = previews.length * 2 + imagenFinalIndex; 

        const carrusel = setInterval(() => {
            if (currentIndex > 0) {
                const prevIndex = (currentIndex - 1) % previews.length;
                previews[prevIndex].classList.remove("seleccionada");
            } else if (currentIndex === 0 && previews.length > 0) {
                previews[previews.length - 1].classList.remove("seleccionada");
            }

            if (currentIndex > totalCarruselTime) {
                clearInterval(carrusel);
                
                const imagenFinalElement = previews[imagenFinalIndex];
                imagenFinalElement.classList.remove("seleccionada");
                imagenFinalElement.classList.add("final-zoom");
                
                // CAMBIO CLAVE: Iniciar el juego automáticamente después de la animación final
                setTimeout(() => {
                    this.cargarImagenYConfigurar();
                }, 1500); // Dar un poco más de tiempo para que se vea el zoom final
                
                return;
            }

            const currentElement = previews[currentIndex % previews.length];
            currentElement.classList.add("seleccionada");

            currentIndex++;
        }, intervalTime);
    },

    cargarImagenYConfigurar() {
        document.getElementById("boton-pausar-juego").textContent = "Pausar";
        document.getElementById("boton-pausar-juego").classList.remove("activo");

        document.getElementById("boton-ayudita").disabled = false;
        document.getElementById("boton-ayudita").classList.remove("deshabilitado");
        
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            this.configurarPiezas(img);
            this.mostrarPantalla("pantalla-juego");
            this.iniciarTemporizador();
        };

        img.onerror = () => {
            alert("Error al cargar la imagen. Intenta de nuevo.");
            this.mostrarPantalla("selector-nivel");
        };

        img.src = this.imagenActual;
    },

    configurarPiezas(img) {
        const grilla = document.getElementById("grilla-blocka");
        grilla.innerHTML = "";
        this.piezas = [];

        const anchoPieza = img.width / 2;
        const altoPieza = img.height / 2;

        for (let i = 0; i < 4; i++) {
            const fila = Math.floor(i / 2);
            const columna = i % 2;

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

            const pieza = {
                elemento: divPieza,
                rotacion: rotacionInicial,
                estaFija: false,
            };

            this.piezas.push(pieza);
            this.actualizarRotacion(pieza);

            divPieza.setAttribute("data-indice", i);
            divPieza.onclick = (e) => this.rotarPieza(this.piezas[i], -90, e); 
            divPieza.oncontextmenu = (e) => this.rotarPieza(this.piezas[i], 90, e); 
            divPieza.classList.remove("pieza-fija");

            grilla.appendChild(divPieza);
        }
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
            let r = datos[i];
            let g = datos[i + 1];
            let b = datos[i + 2];

            const [r_nuevo, g_nuevo, b_nuevo] = funcionFiltro(r, g, b);

            datos[i] = r_nuevo;
            datos[i + 1] = g_nuevo;
            datos[i + 2] = b_nuevo;
        }

        ctx.putImageData(datosImagen, 0, 0);
    },

    rotarPieza(pieza, grados, evento) {
        evento.preventDefault();
        if (this.estaPausado || pieza.estaFija) return;

        pieza.rotacion = (pieza.rotacion + grados) % 360;
        if (pieza.rotacion < 0) pieza.rotacion += 360;

        this.actualizarRotacion(pieza);
        this.verificarVictoria();
    },

    actualizarRotacion(pieza) {
        pieza.elemento.style.transform = `rotate(${pieza.rotacion}deg)`;
    },

    usarAyudita() {
        if (this.estaPausado || this.ayuditaUsada) return;

        const incorrectas = this.piezas.filter(p => !p.estaFija && p.rotacion !== 0);

        if (incorrectas.length === 0) return;

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
        const resuelto = this.piezas.every(p => p.rotacion === 0);
        if (resuelto) {
            this.detenerTemporizador();
            this.quitarFiltros();

            this.piezas.forEach(pieza => {
                pieza.elemento.onclick = (e) => e.preventDefault();
                pieza.elemento.oncontextmenu = (e) => e.preventDefault();
            });

            const mensaje = document.getElementById("mensaje-completado");
            mensaje.classList.remove("oculto");
            setTimeout(() => mensaje.classList.add("mostrar"), 80);

            setTimeout(() => {
                mensaje.classList.remove("mostrar");
                mensaje.classList.add("oculto");
                this.manejarVictoria();
            }, 2000);
        }
    },

    quitarFiltros() {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const anchoPieza = img.width / 2;
            const altoPieza = img.height / 2;

            this.piezas.forEach((pieza, i) => {
                const fila = Math.floor(i / 2);
                const columna = i % 2;
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

        let mensajeRecord = "";
        if (!record || tiempoFinal < record) {
            this.guardarRecord(this.nivelActual, tiempoFinal);
            mensajeRecord = "🏆 ¡Nuevo récord!";
        } else {
            mensajeRecord = `Récord actual: ${this.formatearTiempo(record)}`;
        }
        document.getElementById("mensaje-record").textContent = mensajeRecord;

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
            this.iniciarNivel(this.nivelActual + 1);
        }
    },

    iniciarTemporizador() {
        this.tiempoInicio = Date.now();
        this.tiempoTranscurrido = 0;
        this.actualizarTemporizador();

        this.detenerTemporizador(); 
        this.intervaloTemporizador = setInterval(() => {
            if (!this.estaPausado) {
                this.tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);
                this.actualizarTemporizador();
            }
        }, 100);
    },

    detenerTemporizador() {
        if (this.intervaloTemporizador) {
            clearInterval(this.intervaloTemporizador);
            this.intervaloTemporizador = null;
        }
    },

    pausarJuego() {
        this.estaPausado = !this.estaPausado;
        const boton = document.getElementById("boton-pausar-juego");

        if (this.estaPausado) {
            boton.textContent = "Reanudar";
            boton.classList.add("activo"); 
        } else {
            boton.textContent = "Pausar";
            boton.classList.remove("activo"); 
        }
    },

    actualizarTemporizador() {
        document.getElementById("temporizador").textContent = this.formatearTiempo(this.tiempoTranscurrido);
    },

    formatearTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        const pad = n => (n < 10 ? "0" : "") + n;
        return `${pad(minutos)}:${pad(segs)}`;
    },

    guardarRecord(nivel, tiempo) {
        localStorage.setItem(`blocka_record_${nivel}`, tiempo);
    },

    obtenerRecord(nivel) {
        const record = localStorage.getItem(`blocka_record_${nivel}`);
        return record ? parseInt(record) : null;
    },

    obtenerNombreFiltro(filtro) {
        const nombres = {
            escalaGrises: "Escala de Grises",
            brillo: "Brillo 30%",
            negativo: "Negativo",
        };
        return nombres[filtro] || filtro;
    },
};

window.onload = () => juego.inicializar();