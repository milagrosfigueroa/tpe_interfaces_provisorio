// ====================
// CONFIGURACIÓN GLOBAL
// ====================

const BANCO_IMAGENES = [
  "https://picsum.photos/id/10/600/600",
  "https://picsum.photos/id/20/600/600",
  "https://picsum.photos/id/30/600/600",
  "https://picsum.photos/id/40/600/600",
  "https://picsum.photos/id/50/600/600",
  "https://picsum.photos/id/60/600/600",
  "https://picsum.photos/id/70/600/600",
  "https://picsum.photos/id/80/600/600",
];

const NIVELES = [
  { id: 1, nombre: "Nivel 1", filtro: "escalaGrises" },
  { id: 2, nombre: "Nivel 2", filtro: "brillo" },
  { id: 3, nombre: "Nivel 3", filtro: "negativo" },
];

const PANTALLAS = ["menu-principal", "instrucciones", "selector-nivel", "selector-piezas", "pantalla-juego", "pantalla-victoria"];

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
  return [255 - r, 255 - g, 255 - b];
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

  // Nueva configuración de filas/columnas (por defecto 2x2)
  filasSeleccionadas: 2,
  columnasSeleccionadas: 2,

  // UTILERÍAS DE NAVEGACIÓN Y CONFIGURACIÓN

  ocultarTodasPantallas() {
    // Asegurarse de no fallar si la pantalla no existe
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

  // INICIALIZACIÓN

  inicializar() {
    this.renderizarSelectorNivel();
    this.mostrarPantalla("menu-principal");
    this.detenerTemporizador();

    // Asignar eventos de navegación
    document.getElementById("btn-jugar-inicio").onclick = () => this.mostrarPantalla("selector-nivel");
    document.getElementById("btn-instrucciones").onclick = () => this.mostrarPantalla("instrucciones");
    document.getElementById("btn-volver-menu-instrucciones").onclick = () => this.mostrarPantalla("menu-principal");
    document.getElementById("btn-volver-menu-selector").onclick = () => this.mostrarPantalla("menu-principal");

    // Controles de juego y victoria
    document.getElementById("btn-menu-juego").onclick = () => this.mostrarPantalla("menu-principal");
    document.getElementById("btn-menu-victoria").onclick = () => this.mostrarPantalla("menu-principal");
    document.getElementById("boton-siguiente-nivel").onclick = this.siguienteNivel.bind(this);
    document.getElementById("boton-pausar-juego").onclick = this.pausarJuego.bind(this);
    document.getElementById("boton-ayudita").onclick = this.usarAyudita.bind(this);
    document.getElementById("btn-seleccionar-nivel-victoria").onclick = () => this.mostrarPantalla("selector-nivel");

    // Inicializar selector de piezas (si la pantalla ya está en el DOM)
    this.setupSelectorPiezasUI();

    // Crear botón "Cambiar piezas" fijo si no existe
    this.crearBotonCambiarPiezas();
  },

  // SELECTOR DE NIVELES

  renderizarSelectorNivel() {
    const grilla = document.getElementById("grilla-niveles");
    if (!grilla) return;
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

  // INICIAR NIVEL
  iniciarNivel(idNivel) {
    this.nivelActual = idNivel;
    this.estaPausado = false;
    this.ayuditaUsada = false;

    const botonAyudita = document.getElementById("boton-ayudita");
    if (botonAyudita) {
      botonAyudita.disabled = false;
      botonAyudita.classList.remove("deshabilitado");
    }

    const botonPausar = document.getElementById("boton-pausar-juego");
    if (botonPausar) {
      botonPausar.textContent = "Pausar";
      botonPausar.classList.remove("activo");
    }

    const indice = Math.floor(Math.random() * BANCO_IMAGENES.length);
    this.imagenActual = BANCO_IMAGENES[indice];

    document.getElementById("titulo-nivel").textContent = "Nivel " + idNivel;

    // Mostrar la pantalla para elegir la cantidad de piezas (según tu pedido)
    this.mostrarPantalla("selector-piezas");
  },

  // Configuración del selector de piezas (listeners)
  setupSelectorPiezasUI() {
    const selector = document.getElementById("selector-piezas");
    if (!selector) {
      // Si el HTML no tiene la pantalla, la creamos dinámicamente y la insertamos después de selector-nivel
      const wrapper = document.getElementById("selector-nivel");
      const nuevo = document.createElement("div");
      nuevo.id = "selector-piezas";
      nuevo.className = "oculto";
      nuevo.innerHTML = `
        <h2>Selecciona la cantidad de piezas</h2>
        <div class="grilla-piezas">
            <button class="boton boton-primario btn-piezas" data-filas="2" data-columnas="2">4 piezas (2x2)</button>
            <button class="boton boton-primario btn-piezas" data-filas="2" data-columnas="3">6 piezas (2x3)</button>
            <button class="boton boton-primario btn-piezas" data-filas="2" data-columnas="4">8 piezas (2x4)</button>
        </div>
        <button class="boton boton-secundario" id="btn-volver-selector-piezas">Volver</button>
      `;
      if (wrapper && wrapper.parentNode) wrapper.parentNode.insertBefore(nuevo, wrapper.nextSibling);
    }

    // Delegación: asignar listeners a cualquier .btn-piezas existente
    document.addEventListener("click", (e) => {
      const btn = e.target.closest && e.target.closest(".btn-piezas");
      if (btn) {
        const f = parseInt(btn.dataset.filas, 10);
        const c = parseInt(btn.dataset.columnas, 10);
        if (isFinite(f) && isFinite(c)) {
          this.filasSeleccionadas = f;
          this.columnasSeleccionadas = c;
          // cargar imagen y configurar (esto iniciará el temporizador)
          this.cargarImagenYConfigurar();
        }
      }
    });

    // Volver desde selector-piezas al selector-nivel
    document.addEventListener("click", (e) => {
      if (e.target && e.target.id === "btn-volver-selector-piezas") {
        this.mostrarPantalla("selector-nivel");
      }
    });
  },

  // crear botón cambiar piezas (esquina inferior izquierda)
  crearBotonCambiarPiezas() {
    if (document.getElementById("btn-cambiar-piezas")) return; // ya existe

    const btn = document.createElement("button");
    btn.id = "btn-cambiar-piezas";
    btn.className = "boton boton-secundario";
    btn.textContent = "Cambiar piezas";
    // estilo por defecto (el CSS adicional se encargará de posicionarlo)
    // Insertarlo dentro del wrapper para que se muestre encima del contenido
    const wrapper = document.getElementById("blocka-wrapper") || document.body;
    wrapper.appendChild(btn);

    btn.addEventListener("click", () => {
      // Pausar y mostrar selector de piezas
      this.estaPausado = true;
      // Cambiar texto del botón pausar a "Reanudar" visualmente pero sin cambiar estado del jugador
      const botonPausar = document.getElementById("boton-pausar-juego");
      if (botonPausar) {
        botonPausar.textContent = "Reanudar";
        botonPausar.classList.add("activo");
      }
      this.mostrarPantalla("selector-piezas");
    });
  },

  cargarImagenYConfigurar() {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            this.configurarPiezas(img);
            this.mostrarPantalla("pantalla-juego");
            // reiniciar temporizador desde cero
            this.iniciarTemporizador();
            // asegurar que el juego no esté pausado por defecto
            this.estaPausado = false;

            // 🔹 Ajuste: restablecer el botón de pausar
            const botonPausar = document.getElementById("boton-pausar-juego");
            if (botonPausar) {
            botonPausar.textContent = "Pausar";
            botonPausar.classList.remove("activo");
            }
        };

        img.onerror = () => {
            alert("Error al cargar la imagen. Intenta de nuevo.");
            this.mostrarPantalla("selector-nivel");
        };

        img.src = this.imagenActual;
    },


  // CONFIGURAR PIEZAS (ahora dinámico según filas/columnas)
    configurarPiezas(img) {
        const grilla = document.getElementById("grilla-blocka");
        if (!grilla) return;
        grilla.innerHTML = "";
        this.piezas = [];

        const filas = this.filasSeleccionadas;
        const columnas = this.columnasSeleccionadas;

        // Ajustar estilo de la grilla para reflejar columnas seleccionadas
        grilla.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;
        // ancho/alto de cada pieza en pixels según la imagen original
        const anchoPieza = Math.floor(img.width / columnas);
        const altoPieza = Math.floor(img.height / filas);

        // Crear piezas
        let indice = 0;
        for (let y = 0; y < filas; y++) {
            for (let x = 0; x < columnas; x++) {
                const divPieza = document.createElement("div");
                divPieza.className = "pieza-blocka";

                const canvas = document.createElement("canvas");
                // canvas en pixeles = tamaño real de la porción de imagen
                canvas.width = anchoPieza;
                canvas.height = altoPieza;
                const ctx = canvas.getContext("2d");

                // Dibujar la porción adecuada de la imagen dentro del canvas
                ctx.drawImage(
                img,
                x * anchoPieza,
                y * altoPieza,
                anchoPieza,
                altoPieza,
                0,
                0,
                anchoPieza,
                altoPieza
                );

                // Aplicar filtro según el nivel
                this.aplicarFiltro(canvas);

                divPieza.appendChild(canvas);

                const rotaciones = [0, 90, 180, 270];
                const rotacionInicial = rotaciones[Math.floor(Math.random() * 4)];

                const pieza = {
                elemento: divPieza,
                rotacion: rotacionInicial,
                estaFija: false,
                fila: y,
                columna: x,
                indice: indice,
                };

                this.piezas.push(pieza);
                this.actualizarRotacion(pieza);

                divPieza.setAttribute("data-indice", indice);

                // Eventos de rotación
                divPieza.addEventListener("click", (e) => {
                    e.preventDefault();
                    const i = parseInt(divPieza.dataset.indice, 10);
                    if (!isNaN(i)) this.rotarPieza(this.piezas[i], -90, e);
                    });

                    divPieza.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    const i = parseInt(divPieza.dataset.indice, 10);
                    if (!isNaN(i)) this.rotarPieza(this.piezas[i], 90, e);
                });


                divPieza.classList.remove("pieza-fija");

                grilla.appendChild(divPieza);
                indice++;
            }
        }

        // ocultar mensaje completado si estaba visible
        const mensaje = document.getElementById("mensaje-completado");
        if (mensaje) {
        mensaje.classList.add("oculto");
        mensaje.classList.remove("mostrar");
        }
    },

  // APLICAR FILTROS
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

  // ROTAR PIEZA
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

  // AYUDITA
  usarAyudita() {
    if (this.estaPausado || this.ayuditaUsada) return;

    const incorrectas = this.piezas.filter(p => !p.estaFija && p.rotacion !== 0);
    if (incorrectas.length === 0) return;

    const pieza = incorrectas[Math.floor(Math.random() * incorrectas.length)];

    pieza.rotacion = 0;
    pieza.estaFija = true;
    this.actualizarRotacion(pieza);
    pieza.elemento.classList.add("pieza-fija");

    // penalización: restar 5 segundos al tiempo inicio
    this.tiempoInicio -= 5000;
    this.ayuditaUsada = true;

    const botonAyudita = document.getElementById("boton-ayudita");
    if (botonAyudita) {
      botonAyudita.disabled = true;
      botonAyudita.classList.add("deshabilitado");
    }

    this.verificarVictoria();
  },

  // VERIFICAR VICTORIA
  verificarVictoria() {
    const resuelto = this.piezas.length > 0 && this.piezas.every(p => p.rotacion === 0);
    if (resuelto) {
      this.detenerTemporizador();
      this.quitarFiltros();

      this.piezas.forEach(pieza => {
        pieza.elemento.onclick = (e) => e.preventDefault();
        pieza.elemento.oncontextmenu = (e) => e.preventDefault();
      });

      const mensaje = document.getElementById("mensaje-completado");
      if (mensaje) {
        mensaje.classList.remove("oculto");
        setTimeout(() => mensaje.classList.add("mostrar"), 80);
      }

      setTimeout(() => {
        if (mensaje) {
          mensaje.classList.remove("mostrar");
          mensaje.classList.add("oculto");
        }
        this.manejarVictoria();
      }, 2000);
    }
  },

  quitarFiltros() {
    // Redibujar sin filtro usando la imagen original y la configuración actual filas/columnas
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const filas = this.filasSeleccionadas;
      const columnas = this.columnasSeleccionadas;
      const anchoPieza = Math.floor(img.width / columnas);
      const altoPieza = Math.floor(img.height / filas);

      this.piezas.forEach((pieza) => {
        const fila = pieza.fila;
        const columna = pieza.columna;
        const ctx = pieza.elemento.querySelector('canvas').getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(
          img,
          columna * anchoPieza,
          fila * altoPieza,
          anchoPieza,
          altoPieza,
          0,
          0,
          anchoPieza,
          altoPieza
        );
      });
    };

    img.src = this.imagenActual;
  },

  // VICTORIA
  manejarVictoria() {
    const tiempoFinal = this.tiempoTranscurrido;
    const record = this.obtenerRecord(this.nivelActual);

    const tv = document.getElementById("tiempo-victoria");
    if (tv) tv.textContent = this.formatearTiempo(tiempoFinal);

    let mensajeRecord = "";
    if (!record || tiempoFinal < record) {
      this.guardarRecord(this.nivelActual, tiempoFinal);
      mensajeRecord = "🏆 ¡Nuevo récord!";
    } else {
      mensajeRecord = `Récord actual: ${this.formatearTiempo(record)}`;
    }

    const msg = document.getElementById("mensaje-record");
    if (msg) msg.textContent = mensajeRecord;

    const botonSiguiente = document.getElementById("boton-siguiente-nivel");
    if (botonSiguiente) {
      if (this.nivelActual < NIVELES.length) botonSiguiente.classList.remove("oculto");
      else botonSiguiente.classList.add("oculto");
    }

    this.mostrarPantalla("pantalla-victoria");
  },

  siguienteNivel() {
    if (this.nivelActual < NIVELES.length) {
      this.iniciarNivel(this.nivelActual + 1);
    }
  },

  // TEMPORIZADOR Y TIEMPO

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
      if (boton) {
        boton.textContent = "Reanudar";
        boton.classList.add("activo");
      }
    } else {
      if (boton) {
        boton.textContent = "Pausar";
        boton.classList.remove("activo");
      }
    }
  },

  actualizarTemporizador() {
    const t = document.getElementById("temporizador");
    if (t) t.textContent = this.formatearTiempo(this.tiempoTranscurrido);
  },

  formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    const pad = n => (n < 10 ? "0" : "") + n;
    return `${pad(minutos)}:${pad(segs)}`;
  },

  // RÉCORDS
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

// INICIAR
window.onload = () => juego.inicializar();
