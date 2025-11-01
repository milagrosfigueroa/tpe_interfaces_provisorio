// ===============================
// CONFIGURACIÓN
// ===============================
const PEG_TYPES = ["fire", "water"];
const PEG_IMAGES = {
    fire: "img/img_juego_peg/pieza_fuego.png",
    water: "img/img_juego_peg/pieza_agua.png"
};

const PEG_PATTERN = [
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0],
    [1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0]
];


// ===============================
// OBJETO PRINCIPAL DEL JUEGO
// ===============================
const juego = {
    score: 0,
    tiempo: 60,
    pausado: false,
    intervalo: null,

    // Elementos UI
    el: {
        tablero: document.getElementById("board"),
        contenedor: document.getElementById("game-content"),
        overlay: document.getElementById("bannerCard"),
        bannerImg: document.querySelector(".game-banner-card > .banner-image"),
        timer: document.getElementById("timer"),
        score: document.getElementById("score"),
        btnPlay: document.getElementById("playButton"),
        btnPause: document.getElementById("pauseBtn"),
        btnReset: document.getElementById("resetBtn"),
        btnExit: document.getElementById("exitBtn"),
        modalSalir: document.getElementById("modal-salir"),
        btnSalirSi: document.getElementById("btn-confirmar-salir"),
        btnSalirNo: document.getElementById("btn-cancelar-salir"),
        mensaje: document.getElementById("message")
    },

    // ===============================
    // TABLERO / LÓGICA DE JUEGO
    // ===============================
    tablero: {
        rows: 7,
        cols: 7,
        casillas: [],
        piezaArrastrada: null,

        init() {
            this.casillas = [];
            juego.el.tablero.innerHTML = "";
            juego.el.tablero.style.display = "grid";
            juego.el.tablero.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
            juego.el.tablero.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;

            for (let r = 0; r < this.rows; r++) {
                const fila = [];

                for (let c = 0; c < this.cols; c++) {
                    const celda = document.createElement("div");
                    celda.classList.add("cell");
                    celda.dataset.row = r;
                    celda.dataset.col = c;

                    // Celda inválida
                    if (PEG_PATTERN[r][c] === 0) {
                        celda.classList.add("invalid");
                    } 
                    // Colocar pieza excepto centro
                    else if (!(r === 3 && c === 3)) {
                        const tipo = PEG_TYPES[Math.floor(Math.random() * PEG_TYPES.length)];
                        const pieza = this.crearPieza(tipo);
                        celda.appendChild(pieza);
                    }

                    // Drag events
                    celda.addEventListener("dragover", e => e.preventDefault());
                    celda.addEventListener("drop", e => this.drop(e));

                    juego.el.tablero.appendChild(celda);
                    fila.push(celda);
                }
                this.casillas.push(fila);
            }

            this.escalar();
        },

        crearPieza(tipo) {
            const el = document.createElement("div");
            el.classList.add("piece");
            el.dataset.type = tipo;
            el.style.backgroundImage = `url(${PEG_IMAGES[tipo]})`;
            el.draggable = true;

            el.addEventListener("dragstart", e => this.startDrag(e, el));
            el.addEventListener("dragend", () => this.endDrag());

            return el;
        },

        startDrag(e, pieza) {
            this.piezaArrastrada = pieza;
            const celda = pieza.parentElement;
            this.mostrarHints(+celda.dataset.row, +celda.dataset.col);
            setTimeout(() => pieza.style.visibility = "hidden", 0);
        },

        endDrag() {
            if (this.piezaArrastrada) this.piezaArrastrada.style.visibility = "visible";
            this.piezaArrastrada = null;
            this.limpiarHints();
        },

        drop(e) {
            e.preventDefault();
            const destino = e.target.closest(".cell");
            if (!this.piezaArrastrada || !destino) return;

            const { row: fr, col: fc } = this.piezaArrastrada.parentElement.dataset;
            const { row: tr, col: tc } = destino.dataset;

            const fromR = +fr, fromC = +fc, toR = +tr, toC = +tc;

            if (this.movimientoValido(fromR, fromC, toR, toC)) {
                const midR = (fromR + toR) / 2;
                const midC = (fromC + toC) / 2;

                this.casillas[midR][midC].innerHTML = "";
                destino.appendChild(this.piezaArrastrada);

                juego.sumarPuntos(10);
                this.limpiarHints();
                juego.verificarVictoria();
                juego.verificarBloqueo();
            }
        },

        movimientoValido(fr, fc, tr, tc) {
            const midR = (fr + tr) / 2;
            const midC = (fc + tc) / 2;

            // salta 2 celdas en cruz
            const saltoCorrecto = (
                (Math.abs(fr - tr) === 2 && fc === tc) ||
                (Math.abs(fc - tc) === 2 && fr === tr)
            );

            if (!saltoCorrecto) return false;
            if (!this.casillas[midR][midC].querySelector(".piece")) return false;
            if (this.casillas[tr][tc].children.length !== 0) return false;

            return true;
        },

        mostrarHints(r, c) {
            this.limpiarHints();

            const moves = [
                { r: r - 2, c, midR: r - 1, midC: c, rot: "-90deg" },
                { r: r + 2, c, midR: r + 1, midC: c, rot: "90deg" },
                { r, c: c - 2, midR: r, midC: c - 1, rot: "180deg" },
                { r, c: c + 2, midR: r, midC: c + 1, rot: "0deg" }
            ];

            const rect = juego.el.tablero.getBoundingClientRect();

            moves.forEach(m => {
                if (
                    m.r >= 0 && m.c >= 0 &&
                    m.r < this.rows && m.c < this.cols &&
                    !this.casillas[m.r][m.c].classList.contains("invalid") &&
                    this.casillas[m.r][m.c].children.length === 0 &&
                    this.casillas[m.midR][m.midC].children.length > 0
                ) {
                    const t = this.casillas[m.r][m.c].getBoundingClientRect();
                    const hint = document.createElement("div");
                    hint.classList.add("hint");
                    hint.style.top = `${t.top - rect.top + 20}px`;
                    hint.style.left = `${t.left - rect.left + 20}px`;
                    hint.style.transform = `rotate(${m.rot})`;
                    juego.el.tablero.appendChild(hint);
                }
            });
        },

        limpiarHints() {
            juego.el.tablero.querySelectorAll(".hint").forEach(h => h.remove());
        },

        escalar() {
            juego.el.tablero.style.transform = "scale(1)";
            const rect = juego.el.tablero.getBoundingClientRect();
            const cont = juego.el.contenedor.getBoundingClientRect();

            const scale = Math.min(cont.width / rect.width, cont.height / rect.height, 1);
            juego.el.tablero.style.transform = `scale(${scale})`;
        }
    },

    // ===============================
    // CONTROL DE ESTADO / UI
    // ===============================
    iniciar() {
        this.el.overlay.style.display = "none";
        this.el.bannerImg.style.display = "none";
        this.el.contenedor.style.display = "flex";
        this.reset();
    },

    reset() {
        this.score = 0;
        this.tiempo = 60;
        this.pausado = false;

        this.el.mensaje.classList.remove("visible");
        this.el.timer.textContent = "Tiempo: 60s";
        this.el.score.textContent = "Puntaje: 0";
        this.el.btnPause.textContent = "Pausar";

        this.tablero.init();
        this.iniciarTimer();
    },

    iniciarTimer() {
        clearInterval(this.intervalo);
        this.intervalo = setInterval(() => {
            if (!this.pausado) {
                this.tiempo--;
                this.el.timer.textContent = `Tiempo: ${this.tiempo}s`;

                if (this.tiempo <= 0) {
                    clearInterval(this.intervalo);
                    this.mostrarMensaje(`⏰ ¡Tiempo terminado!<br>Puntaje: ${this.score}`);
                }
            }
        }, 1000);
    },

    pausar() {
        this.pausado = !this.pausado;
        this.el.btnPause.textContent = this.pausado ? "Reanudar" : "Pausar";
    },

    sumarPuntos(v) {
        this.score += v;
        this.el.score.textContent = `Puntaje: ${this.score}`;
    },

    verificarVictoria() {
        if (document.querySelectorAll("#board .piece").length === 1) {
            clearInterval(this.intervalo);
            this.mostrarMensaje(`🏆 ¡Victoria!<br>Puntaje: ${this.score}`);
        }
    },

    verificarBloqueo() {
        const piezas = document.querySelectorAll("#board .piece");

        for (const p of piezas) {
            const r = +p.parentElement.dataset.row;
            const c = +p.parentElement.dataset.col;

            const moves = [
                { r: r - 2, c, midR: r - 1, midC: c },
                { r: r + 2, c, midR: r + 1, midC: c },
                { r, c: c - 2, midR: r, midC: c - 1 },
                { r, c: c + 2, midR: r, midC: c + 1 }
            ];

            for (const m of moves) {
                if (
                    m.r >= 0 && m.c >= 0 &&
                    m.r < 7 && m.c < 7 &&
                    !this.tablero.casillas[m.r][m.c].classList.contains("invalid") &&
                    this.tablero.casillas[m.r][m.c].children.length === 0 &&
                    this.tablero.casillas[m.midR][m.midC].children.length > 0
                ) return;
            }
        }

        clearInterval(this.intervalo);
        this.mostrarMensaje(`🚫 Sin movimientos<br>Puntaje: ${this.score}`);
    },

    mostrarMensaje(txt) {
        this.el.mensaje.innerHTML = `<div>${txt}</div><button onclick="juego.reset()">Jugar de nuevo</button>`;
        this.el.mensaje.classList.add("visible");
    },

    // ===============================
    // EVENTOS
    // ===============================
    initEventos() {
        this.el.btnPlay.addEventListener("click", () => this.iniciar());
        this.el.btnPause.addEventListener("click", () => this.pausar());
        this.el.btnReset.addEventListener("click", () => this.reset());
        this.el.btnExit.addEventListener("click", () => this.el.modalSalir.style.display = "flex");
        this.el.btnSalirNo.addEventListener("click", () => this.el.modalSalir.style.display = "none");
        this.el.btnSalirSi.addEventListener("click", () => this.salir());

        window.addEventListener("load", () => this.tablero.escalar());
        window.addEventListener("resize", () => this.tablero.escalar());
    },

    salir() {
        this.el.modalSalir.style.display = "none";
        this.el.contenedor.style.display = "none";
        this.el.overlay.style.display = "flex";
        this.el.bannerImg.style.display = "block";
        this.reset();
    }
};


// ===============================
// INICIO
// ===============================
window.onload = () => juego.initEventos();
