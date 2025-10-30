// ===============================
// CONFIGURACIÓN
// ===============================
const types = ["fire", "water"];
const images = {
    fire: "img/img_juego_peg/pieza_fuego.png",
    water: "img/img_juego_peg/pieza_agua.png",
};

const pattern = [
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0],
    [1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0]
];


// ===============================
// CLASS: PIEZA
// ===============================
class Piece {
    constructor(type) {
        this.type = type;
        this.element = document.createElement("div");
        this.element.classList.add("piece");
        this.element.dataset.type = type;
        this.element.style.backgroundImage = `url(${images[type]})`;
        this.element.draggable = true;

        // Drag events
        this.element.addEventListener("dragstart", (e) => game.board.onDragStart(e, this));
        this.element.addEventListener("dragend", () => game.board.onDragEnd());
    }
}


// ===============================
// CLASS: TABLERO
// ===============================
class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.element = document.getElementById("board");
        this.board = [];
        this.dragged = null;
    }

    init() {
        this.board = [];
        this.element.innerHTML = "";
        this.element.style.display = 'grid';
        this.element.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        this.element.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;

        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (pattern[r][c] === 0) {
                    cell.classList.add("invalid");
                } else if (!(r === 3 && c === 3)) {
                    const piece = new Piece(types[Math.floor(Math.random() * types.length)]);
                    cell.appendChild(piece.element);
                }

                cell.addEventListener("dragover", (e) => e.preventDefault());
                cell.addEventListener("drop", (e) => this.onDrop(e));

                this.element.appendChild(cell);
                row.push(cell);
            }
            this.board.push(row);
        }
        this.scaleBoard();
    }

    // Drag & Drop
    onDragStart(e, piece) {
        this.dragged = piece.element;
        const cell = this.dragged.parentElement;
        const r = +cell.dataset.row;
        const c = +cell.dataset.col;
        this.showHints(r, c);
        setTimeout(() => (this.dragged.style.visibility = "hidden"), 0);
    }

    onDragEnd() {
        if (this.dragged) this.dragged.style.visibility = "visible";
        this.dragged = null;
        this.clearHints();
    }

    onDrop(e) {
        e.preventDefault();
        const targetCell = e.target.closest(".cell");
        if (!this.dragged || !targetCell) return;

        const fromR = +this.dragged.parentElement.dataset.row;
        const fromC = +this.dragged.parentElement.dataset.col;
        const toR = +targetCell.dataset.row;
        const toC = +targetCell.dataset.col;

        if (this.isValidMove(fromR, fromC, toR, toC)) {
            const midR = (fromR + toR) / 2;
            const midC = (fromC + toC) / 2;
            this.board[midR][midC].innerHTML = "";
            targetCell.appendChild(this.dragged);

            game.addScore(10);
            game.board.clearHints();
            game.checkVictory();
            game.checkBlocked();
        }
    }

    isValidMove(fromR, fromC, toR, toC) {
        const fromPiece = this.board[fromR][fromC].querySelector(".piece");
        if (!fromPiece) return false;

        let midR, midC;
        if (Math.abs(fromR - toR) === 2 && fromC === toC) {
            midR = (fromR + toR) / 2;
            midC = fromC;
        } else if (Math.abs(fromC - toC) === 2 && fromR === toR) {
            midR = fromR;
            midC = (fromC + toC) / 2;
        } else return false;

        const midCell = this.board[midR][midC];
        const targetCell = this.board[toR][toC];
        if (targetCell.children.length !== 0 || !midCell.querySelector(".piece")) return false;

        return true;
    }

    showHints(r, c) {
        this.clearHints();
        const moves = [
            { r: r - 2, c, midR: r - 1, midC: c, rot: "-90deg" },
            { r: r + 2, c, midR: r + 1, midC: c, rot: "90deg" },
            { r, c: c - 2, midR: r, midC: c - 1, rot: "180deg" },
            { r, c: c + 2, midR: r, midC: c + 1, rot: "0deg" }
        ];

        const rect = this.element.getBoundingClientRect();

        moves.forEach(m => {
            if (
                m.r >= 0 && m.c >= 0 &&
                m.r < this.rows && m.c < this.cols &&
                !this.board[m.r][m.c].classList.contains("invalid") &&
                this.board[m.r][m.c].children.length === 0 &&
                this.board[m.midR][m.midC].children.length > 0
            ) {
                const targetRect = this.board[m.r][m.c].getBoundingClientRect();
                const hint = document.createElement("div");
                hint.classList.add("hint");
                hint.style.top = `${targetRect.top - rect.top + 20}px`;
                hint.style.left = `${targetRect.left - rect.left + 20}px`;
                hint.style.transform = `rotate(${m.rot})`;
                this.element.appendChild(hint);
            }
        });
    }

    clearHints() {
        this.element.querySelectorAll(".hint").forEach(h => h.remove());
    }

    scaleBoard() {
        this.element.style.transform = "scale(1)";
        const rect = this.element.getBoundingClientRect();
        const containerRect = document.getElementById("game-content").getBoundingClientRect();
        const scale = Math.min(
            containerRect.width / rect.width,
            containerRect.height / rect.height,
            1
        );
        this.element.style.transform = `scale(${scale})`;
    }
}


// ===============================
// CLASS: JUEGO
// ===============================
class Game {
    constructor() {
        this.score = 0;
        this.timer = 60;
        this.paused = false;
        this.interval = null;

        this.board = new Board(7, 7);

        this.playBtn = document.getElementById("playButton");
        this.gameContent = document.getElementById("game-content");
        this.bannerOverlay = document.getElementById("bannerCard");
        this.bannerImg = document.querySelector('.game-banner-card > .banner-image');
        this.timerEl = document.getElementById("timer");
        this.scoreEl = document.getElementById("score");
        this.pauseBtn = document.getElementById("pauseBtn");
        this.resetBtn = document.getElementById("resetBtn");
        this.exitBtn = document.getElementById("exitBtn");
        this.modalSalir = document.getElementById("modal-salir");
        this.btnConfirmarSalir = document.getElementById("btn-confirmar-salir");
        this.btnCancelarSalir = document.getElementById("btn-cancelar-salir");
        this.messageBox = document.getElementById("message");

        this.initEvents();
    }

    initEvents() {
        this.playBtn.addEventListener("click", () => this.start());
        this.pauseBtn.addEventListener("click", () => this.togglePause());
        this.resetBtn.addEventListener("click", () => this.reset());
        this.exitBtn.addEventListener("click", () => this.showExitModal());
        this.btnCancelarSalir.addEventListener("click", () => this.hideExitModal());
        this.btnConfirmarSalir.addEventListener("click", () => this.exitGame());

        window.addEventListener("load", () => this.board.scaleBoard());
        window.addEventListener("resize", () => this.board.scaleBoard());
    }

    start() {
        this.bannerOverlay.style.display = "none";
        this.bannerImg.style.display = "none";
        this.gameContent.style.display = "flex";
        this.reset();
    }

    reset() {
        this.messageBox.classList.remove("visible");
        this.timer = 60;
        this.score = 0;
        this.paused = false;
        this.pauseBtn.textContent = "Pausar";
        this.timerEl.textContent = "Tiempo: 60s";
        this.scoreEl.textContent = "Puntaje: 0";

        this.board.init();
        this.startTimer();
    }

    startTimer() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (!this.paused) {
                this.timer--;
                this.timerEl.textContent = `Tiempo: ${this.timer}s`;
                if (this.timer <= 0) {
                    clearInterval(this.interval);
                    this.showMessage(`⏰ ¡Tiempo terminado!<br>Puntaje: ${this.score}`);
                }
            }
        }, 1000);
    }

    togglePause() {
        this.paused = !this.paused;
        this.pauseBtn.textContent = this.paused ? "Reanudar" : "Pausar";
    }

    addScore(value) {
        this.score += value;
        this.scoreEl.textContent = `Puntaje: ${this.score}`;
    }

    checkVictory() {
        const pieces = document.querySelectorAll("#board .piece").length;
        if (pieces === 1) {
            clearInterval(this.interval);
            this.showMessage(`🏆 ¡Victoria!<br>Puntaje: ${this.score}`);
        }
    }

    checkBlocked() {
        const pieces = document.querySelectorAll("#board .piece");
        for (const piece of pieces) {
            const r = +piece.parentElement.dataset.row;
            const c = +piece.parentElement.dataset.col;
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
                    !this.board.board[m.r][m.c].classList.contains("invalid") &&
                    this.board.board[m.r][m.c].children.length === 0 &&
                    this.board.board[m.midR][m.midC].children.length > 0
                ) return;
            }
        }

        clearInterval(this.interval);
        this.showMessage(`🚫 Sin movimientos<br>Puntaje: ${this.score}`);
    }

    showMessage(text) {
        this.messageBox.innerHTML = `<div>${text}</div><button onclick="game.reset()">Jugar de nuevo</button>`;
        this.messageBox.classList.add("visible");
    }

    showExitModal() { this.modalSalir.style.display = "flex"; }
    hideExitModal() { this.modalSalir.style.display = "none"; }

    exitGame() {
        this.hideExitModal();
        this.gameContent.style.display = "none";
        this.bannerOverlay.style.display = "flex";
        this.bannerImg.style.display = "block";
        this.reset();
    }
}


// ===============================
// INICIAR JUEGO
// ===============================
const game = new Game();
