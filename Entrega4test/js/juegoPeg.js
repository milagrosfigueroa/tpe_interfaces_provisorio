// ====================
// CONTROL DE VISTA
// ====================

const playButton = document.getElementById('playButton');
const bannerCardOverlay = document.getElementById('bannerCard');
const gameContent = document.getElementById('game-content');

// HUD (interfaz del juego)
const boardEl = document.getElementById("board");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const messageBox = document.getElementById("message");

// Función para iniciar el juego
function startGame() {
    if (bannerCardOverlay) bannerCardOverlay.style.display = 'none';
    const bannerImage = document.querySelector('.game-banner-card > .banner-image');
    if (bannerImage) bannerImage.style.display = 'none';

    if (gameContent) {
        gameContent.style.display = 'flex';
        gameContent.style.flexDirection = 'column';
        gameContent.style.alignItems = 'center';
        gameContent.style.justifyContent = 'center';
    }

    resetGame();
}

// Evento del botón "Jugar"
if (playButton) playButton.addEventListener('click', startGame);


// ====================
// LÓGICA DEL JUEGO PEG
// ====================

const rows = 7;
const cols = 7;
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

let board = [];
let score = 0;
let timer = 60;
let interval = null;
let paused = false;
let dragged = null;


// ====================
// INICIALIZAR TABLERO
// ====================

function initBoard() {
    if (!boardEl) return;

    board = [];
    boardEl.innerHTML = "";
    boardEl.style.display = 'grid';
    boardEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (pattern[r][c] === 0) {
                cell.classList.add("invalid");
            } else if (!(r === 3 && c === 3)) {
                const piece = document.createElement("div");
                const type = types[Math.floor(Math.random() * types.length)];
                piece.classList.add("piece");
                piece.dataset.type = type;
                piece.style.backgroundImage = `url(${images[type]})`;
                piece.draggable = true;
                cell.appendChild(piece);
            }

            boardEl.appendChild(cell);
            row.push(cell);
        }
        board.push(row);
    }

    enableDrag();
}


// ====================
// DRAG & DROP
// ====================

function enableDrag() {
    document.querySelectorAll(".piece").forEach(p => {
        p.addEventListener("dragstart", dragStart);
        p.addEventListener("dragend", dragEnd);
    });

    document.querySelectorAll(".cell").forEach(c => {
        c.addEventListener("dragover", dragOver);
        c.addEventListener("drop", drop);
    });
}

function dragStart(e) {
    dragged = e.target.closest(".piece");
    const cell = dragged.parentElement;
    const r = +cell.dataset.row;
    const c = +cell.dataset.col;
    showHints(r, c, dragged.dataset.type);
    setTimeout(() => { dragged.style.visibility = "hidden"; }, 0);
}

function dragEnd() {
    if (dragged) dragged.style.visibility = "visible";
    dragged = null;
    clearHints();
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const targetCell = e.target.closest(".cell");
    if (!dragged || !targetCell) return;

    const fromR = +dragged.parentElement.dataset.row;
    const fromC = +dragged.parentElement.dataset.col;
    const toR = +targetCell.dataset.row;
    const toC = +targetCell.dataset.col;

    if (isValidMove(fromR, fromC, toR, toC)) {
        const midR = (fromR + toR) / 2;
        const midC = (fromC + toC) / 2;
        const midCell = board[midR][midC];

        midCell.innerHTML = "";
        targetCell.appendChild(dragged);

        score += 10;
        if (scoreEl) scoreEl.textContent = `Puntaje: ${score}`;

        checkVictory();
        checkBlocked();
    }
    clearHints();
}


// ====================
// VALIDACIÓN DE MOVIMIENTOS
// ====================

function isValidMove(fromR, fromC, toR, toC) {
    const fromPiece = board[fromR][fromC].querySelector('.piece');
    if (!fromPiece) return false;

    let midR, midC;
    if (Math.abs(fromR - toR) === 2 && fromC === toC) {
        midR = (fromR + toR) / 2;
        midC = fromC;
    } else if (Math.abs(fromC - toC) === 2 && fromR === toR) {
        midR = fromR;
        midC = (fromC + toC) / 2;
    } else return false;

    const midCell = board[midR][midC];
    const targetCell = board[toR][toC];
    if (targetCell.children.length !== 0) return false;
    const jumpedPiece = midCell.querySelector('.piece');
    if (!jumpedPiece) return false;

    return true;
}


// ====================
// HINTS (FLECHAS ANIMADAS)
// ====================

function showHints(r, c, type) {
    clearHints();
    const moves = [
        { r: r - 2, c, midR: r - 1, midC: c, transform: "rotate(-90deg)" },
        { r: r + 2, c, midR: r + 1, midC: c, transform: "rotate(90deg)" },
        { r, c: c - 2, midR: r, midC: c - 1, transform: "rotate(180deg)" },
        { r, c: c + 2, midR: r, midC: c + 1, transform: "rotate(0deg)" }
    ];

    if (!boardEl) return;
    const boardRect = boardEl.getBoundingClientRect();

    moves.forEach(m => {
        if (
            m.r >= 0 && m.c >= 0 &&
            m.r < rows && m.c < cols &&
            !board[m.r][m.c].classList.contains("invalid") &&
            board[m.r][m.c].children.length === 0 &&
            board[m.midR][m.midC].children.length > 0
        ) {
            const targetCell = board[m.r][m.c];
            const targetRect = targetCell.getBoundingClientRect();
            const hint = document.createElement("div");
            hint.classList.add("hint", type);
            const top = targetRect.top - boardRect.top + (targetCell.offsetHeight / 4);
            const left = targetRect.left - boardRect.left + (targetCell.offsetWidth / 4);
            hint.style.top = `${top}px`;
            hint.style.left = `${left}px`;
            hint.style.transform = m.transform;
            boardEl.appendChild(hint);
        }
    });
}

function clearHints() {
    document.querySelectorAll(".hint").forEach(h => h.remove());
}


// ====================
// CONTROL DE ESTADO
// ====================

function checkVictory() {
    const piecesLeft = document.querySelectorAll("#board .piece").length;
    if (piecesLeft === 1) {
        clearInterval(interval);
        showMessage(`🏆 ¡Victoria!<br>Puntaje final: ${score}`);
    }
}

function checkBlocked() {
    const pieces = document.querySelectorAll("#board .piece");
    let hasMove = false;

    for (const piece of pieces) {
        const cell = piece.parentElement;
        const r = +cell.dataset.row;
        const c = +cell.dataset.col;
        const moves = [
            { r: r - 2, c, midR: r - 1, midC: c },
            { r: r + 2, c, midR: r + 1, midC: c },
            { r, c: c - 2, midR: r, midC: c - 1 },
            { r, c: c + 2, midR: r, midC: c + 1 }
        ];
        for (const m of moves) {
            if (
                m.r >= 0 && m.c >= 0 &&
                m.r < rows && m.c < cols &&
                !board[m.r][m.c].classList.contains("invalid") &&
                board[m.r][m.c].children.length === 0 &&
                board[m.midR][m.midC].children.length > 0
            ) {
                hasMove = true;
                break;
            }
        }
        if (hasMove) break;
    }

    if (!hasMove) {
        clearInterval(interval);
        showMessage(`🚫 Sin movimientos posibles<br>Puntaje final: ${score}`);
    }
}


// ====================
// TIMER Y MENSAJES
// ====================

function startTimer() {
    if (!timerEl) return;
    clearInterval(interval);
    interval = setInterval(() => {
        if (!paused) {
            timer--;
            timerEl.textContent = `Tiempo: ${timer}s`;
            if (timer <= 0) {
                clearInterval(interval);
                showMessage(`⏰ ¡Tiempo terminado!<br>Puntaje final: ${score}`);
            }
        }
    }, 1000);
}

function showMessage(text) {
    if (!messageBox) return;
    messageBox.innerHTML = `<div>${text}</div><button onclick="window.resetGame()">Jugar de nuevo</button>`;
    messageBox.classList.add("visible");
}


// ====================
// REINICIO DEL JUEGO
// ====================

window.resetGame = resetGame;

function resetGame() {
    if (messageBox) messageBox.classList.remove("visible");
    clearInterval(interval);
    timer = 60;
    score = 0;
    paused = false;
    if (pauseBtn) pauseBtn.textContent = "Pausar";
    if (timerEl) timerEl.textContent = "Tiempo: 60s";
    if (scoreEl) scoreEl.textContent = "Puntaje: 0";
    initBoard();
    startTimer();
}


// ====================
// BOTONES HUD
// ====================

if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
        paused = !paused;
        pauseBtn.textContent = paused ? "Reanudar" : "Pausar";
    });
}

if (resetBtn) {
    resetBtn.addEventListener("click", resetGame);
}


// ====================
// ESCALADO AUTOMÁTICO (AJUSTA TAMAÑOS)
// ====================

function scaleBoard() {
    if (!boardEl || !gameContent) return;
    boardEl.style.transform = "scale(1)";
    const boardRect = boardEl.getBoundingClientRect();
    const containerRect = gameContent.getBoundingClientRect();
    const scale = Math.min(
        containerRect.width / boardRect.width,
        containerRect.height / boardRect.height,
        1
    );
    boardEl.style.transform = `scale(${scale})`;
}

window.addEventListener('load', scaleBoard);
window.addEventListener('resize', scaleBoard);

const originalInitBoard = initBoard;
initBoard = function() {
    originalInitBoard();
    requestAnimationFrame(scaleBoard);
};
