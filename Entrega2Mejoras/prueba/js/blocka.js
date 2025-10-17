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

// ====================
// OBJETO PRINCIPAL DEL JUEGO
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
  imagenOriginal: null,

  inicializar() {
    // Pantallas
    this.menu = document.querySelector(".menu-principal");
    this.selector = document.querySelector(".niveles");
    this.pantallaJuego = document.querySelector(".juego");

    this.tituloNivel = this.pantallaJuego.querySelector(".nivel-titulo");
    this.temporizador = this.pantallaJuego.querySelector(".timer");
    this.grilla = this.pantallaJuego.querySelector(".puzzle");

    // Botones
    document.querySelector(".btn-jugar").onclick = () => this.mostrarSelector();
    document.querySelector(".btn-volver").onclick = () => this.mostrarMenu();
    document
      .querySelector(".btn-volver-niveles")
      ?.addEventListener("click", () => this.mostrarSelector());

    document.querySelectorAll(".nivel").forEach((n) =>
      n.addEventListener("click", () =>
        this.iniciarNivel(parseInt(n.getAttribute("data-nivel")))
      )
    );

    // Botones dentro del juego
    document.querySelector(".btn-ayuda").onclick = () => this.usarAyudita();
    document.querySelector(".btn-pausar").onclick = () => this.pausarJuego();
    document.querySelector(".btn-salir").onclick = () => this.mostrarMenu();

    // Crear overlay de victoria
    this.crearOverlayVictoria();

    this.mostrarMenu();
  },

  mostrarMenu() {
    this.menu.style.display = "flex";
    this.selector.style.display = "none";
    this.pantallaJuego.style.display = "none";
  },

  mostrarSelector() {
    this.menu.style.display = "none";
    this.selector.style.display = "block";
    this.pantallaJuego.style.display = "none";
  },

  mostrarJuego() {
    this.menu.style.display = "none";
    this.selector.style.display = "none";
    this.pantallaJuego.style.display = "block";
  },

  iniciarNivel(idNivel) {
    this.nivelActual = idNivel;
    this.ayuditaUsada = false;
    this.estaPausado = false;
    this.piezas = [];

    document.querySelector(".btn-ayuda").disabled = false;
    document.querySelector(".btn-ayuda").classList.remove("deshabilitado");
    document.querySelector(".btn-pausar").textContent = "Pausar";

    const indice = Math.floor(Math.random() * BANCO_IMAGENES.length);
    this.imagenActual = BANCO_IMAGENES[indice];

    this.tituloNivel.textContent = "Nivel " + idNivel;
    this.cargarImagenYConfigurar();
  },

  cargarImagenYConfigurar() {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
        this.imagenOriginal = img;
        this.configurarPiezas(img);
        this.mostrarJuego();
        this.iniciarTemporizador();
    };

    img.onerror = () => {
      alert("Error al cargar la imagen. Intenta de nuevo.");
      this.mostrarSelector();
    };

    img.src = this.imagenActual;
  },

  configurarPiezas(img) {
    this.grilla.innerHTML = "";
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

      divPieza.onclick = (e) => this.rotarPieza(pieza, -90, e);
      divPieza.oncontextmenu = (e) => this.rotarPieza(pieza, 90, e);

      this.grilla.appendChild(divPieza);
    }
  },

  aplicarFiltro(canvas) {
    const ctx = canvas.getContext("2d");
    const datosImagen = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const datos = datosImagen.data;

    for (let i = 0; i < datos.length; i += 4) {
      let r = datos[i],
        g = datos[i + 1],
        b = datos[i + 2];

      if (this.nivelActual === 1) {
        const promedio = (r + g + b) / 3;
        datos[i] = datos[i + 1] = datos[i + 2] = promedio;
      } else if (this.nivelActual === 2) {
        datos[i] = Math.min(255, r * 1.3);
        datos[i + 1] = Math.min(255, g * 1.3);
        datos[i + 2] = Math.min(255, b * 1.3);
      } else if (this.nivelActual === 3) {
        datos[i] = 255 - r;
        datos[i + 1] = 255 - g;
        datos[i + 2] = 255 - b;
      }
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

    const incorrectas = this.piezas.filter((p) => !p.estaFija && p.rotacion !== 0);
    if (incorrectas.length === 0) return;

    const pieza = incorrectas[Math.floor(Math.random() * incorrectas.length)];
    pieza.rotacion = 0;
    pieza.estaFija = true;
    pieza.elemento.classList.add("pieza-fija");
    this.actualizarRotacion(pieza);

    this.tiempoInicio -= 5000; // penalización
    this.ayuditaUsada = true;

    const botonAyuda = document.querySelector(".btn-ayuda");
    botonAyuda.disabled = true;
    botonAyuda.classList.add("deshabilitado");

    this.verificarVictoria();
  },

  verificarVictoria() {
    const resuelto = this.piezas.every((p) => p.rotacion === 0);
    if (resuelto) {
      this.detenerTemporizador();
      this.reconstruirImagenOriginal();
      this.mostrarOverlayVictoria();
      this.actualizarRecord();
    }
  },
  reconstruirImagenOriginal() {
        if (!this.imagenOriginal) return;
        const img = this.imagenOriginal;
        const anchoPieza = img.width / 2;
        const altoPieza = img.height / 2;

        this.grilla.innerHTML = ""; // limpiar piezas

        for (let i = 0; i < 4; i++) {
            const fila = Math.floor(i / 2);
            const columna = i % 2;

            const canvas = document.createElement("canvas");
            canvas.width = anchoPieza;
            canvas.height = altoPieza;
            const ctx = canvas.getContext("2d");
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

            const divPieza = document.createElement("div");
            divPieza.className = "pieza-blocka completa";
            divPieza.appendChild(canvas);
            this.grilla.appendChild(divPieza);
        }
    },

  iniciarTemporizador() {
    this.detenerTemporizador();
    this.tiempoInicio = Date.now();
    this.tiempoTranscurrido = 0;
    this.intervaloTemporizador = setInterval(() => {
      if (!this.estaPausado) {
        this.tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);
        this.actualizarTemporizador();
      }
    }, 200);
  },

  detenerTemporizador() {
    if (this.intervaloTemporizador) clearInterval(this.intervaloTemporizador);
  },

  pausarJuego() {
    this.estaPausado = !this.estaPausado;
    const boton = document.querySelector(".btn-pausar");
    boton.textContent = this.estaPausado ? "Reanudar" : "Pausar";
  },

  actualizarTemporizador() {
    const minutos = Math.floor(this.tiempoTranscurrido / 60);
    const segs = this.tiempoTranscurrido % 60;
    this.temporizador.textContent =
      (minutos < 10 ? "0" : "") + minutos + ":" + (segs < 10 ? "0" : "") + segs;
  },

  // ====================
  // OVERLAY DE VICTORIA
  // ====================

  crearOverlayVictoria() {
    const overlay = document.createElement("div");
    overlay.id = "overlay-victoria";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.color = "#fff";
    overlay.style.display = "none";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.flexDirection = "column";
    overlay.style.fontSize = "2em";
    overlay.style.zIndex = "999";
    overlay.style.transition = "opacity 0.5s";

    overlay.innerHTML = `
      <div class="mensaje-victoria">
        🎉 ¡Nivel completado! 🎉<br>
        <span class="tiempo-final"></span><br>
        <span class="record-msg"></span>
      </div>
    `;
    this.pantallaJuego.appendChild(overlay);
  },

  mostrarOverlayVictoria() {
    const overlay = document.getElementById("overlay-victoria");
    const tiempoFinal = this.formatearTiempo(this.tiempoTranscurrido);
    overlay.querySelector(".tiempo-final").textContent = `Tiempo: ${tiempoFinal}`;
    overlay.querySelector(".record-msg").textContent = this.mensajeRecord || "";
    overlay.style.display = "flex";
    overlay.style.opacity = "1";

    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => (overlay.style.display = "none"), 800);
    }, 3000);
  },

  // ====================
  // RÉCORDS
  // ====================

  actualizarRecord() {
    const recordKey = `blocka_record_${this.nivelActual}`;
    const record = localStorage.getItem(recordKey);
    if (!record || this.tiempoTranscurrido < parseInt(record)) {
      localStorage.setItem(recordKey, this.tiempoTranscurrido);
      this.mensajeRecord = "🏆 ¡Nuevo récord!";
    } else {
      this.mensajeRecord = `Récord: ${this.formatearTiempo(record)}`;
    }
  },

  formatearTiempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min < 10 ? "0" : ""}${min}:${seg < 10 ? "0" : ""}${seg}`;
  },
};

// Iniciar juego
window.addEventListener("load", () => juego.inicializar());
