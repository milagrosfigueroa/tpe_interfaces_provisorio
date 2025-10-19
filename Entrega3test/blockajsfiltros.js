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



const PANTALLAS = ["menu-principal", "instrucciones", "selector-nivel", "pantalla-juego", "pantalla-victoria"];



// ===================================

// FUNCIONES PURAS PARA LOS FILTROS 🎨

// (Uso de Funciones de Orden Superior y Funciones Puras)

// ===================================



const BRIGHTNESS_FACTOR = 1.3; // Factor para 30% de brillo



/**

* Filtro: Escala de Grises (Función Pura)

* @returns {number[]} [r_nuevo, g_nuevo, b_nuevo]

*/

const filtroEscalaGrises = (r, g, b) => {

// Cálculo simple de promedio

const promedio = (r + g + b) / 3;

return [promedio, promedio, promedio];

};



/**

* Filtro: Brillo (30%) (Función Pura)

* @returns {number[]} [r_nuevo, g_nuevo, b_nuevo]

*/

const filtroBrillo = (r, g, b) => {

// Math.min(255, ...) evita que el color exceda el valor máximo (clamping)

return [

Math.min(255, r * BRIGHTNESS_FACTOR),

Math.min(255, g * BRIGHTNESS_FACTOR),

Math.min(255, b * BRIGHTNESS_FACTOR),

];

};



/**

* Filtro: Negativo (Función Pura)

* @returns {number[]} [r_nuevo, g_nuevo, b_nuevo]

*/

const filtroNegativo = (r, g, b) => {

return [

255 - r,

255 - g,

255 - b,

];

};



/**

* Mapeo de los nombres de filtro a sus funciones.

* Esto es la base para aplicar la lógica de Orden Superior.

*/

const FILTROS_MAP = {

escalaGrises: filtroEscalaGrises,

brillo: filtroBrillo,

negativo: filtroNegativo,

};





// ====================

// OBJETO JUEGO (ARREGLADO)

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



// UTILERÍAS DE NAVEGACIÓN Y CONFIGURACIÓN

ocultarTodasPantallas() {

PANTALLAS.forEach(id => document.getElementById(id).classList.add("oculto"));

},



mostrarPantalla(id) {

this.ocultarTodasPantallas();

document.getElementById(id).classList.remove("oculto");

},



// INICIALIZACIÓN

inicializar() {

this.renderizarSelectorNivel();

this.mostrarPantalla("menu-principal");

this.detenerTemporizador();


// Asignar eventos de navegación (usando los IDs del HTML)

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

},



// SELECTOR DE NIVELES

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

// Asignación de click para iniciar nivel

tarjeta.onclick = (e) => this.iniciarNivel(parseInt(e.currentTarget.getAttribute("data-nivel")));

grilla.appendChild(tarjeta);

});

},



// INICIAR NIVEL

iniciarNivel(idNivel) {

this.nivelActual = idNivel;

this.estaPausado = false;

this.ayuditaUsada = false;



document.getElementById("boton-ayudita").disabled = false;

document.getElementById("boton-ayudita").classList.remove("deshabilitado");


// 🛑 AJUSTE: Aseguramos que el botón no tenga la clase 'activo' al iniciar

const botonPausar = document.getElementById("boton-pausar-juego");

botonPausar.textContent = "Pausar";

botonPausar.classList.remove("activo");



const indice = Math.floor(Math.random() * BANCO_IMAGENES.length);

this.imagenActual = BANCO_IMAGENES[indice];



document.getElementById("titulo-nivel").textContent = "Nivel " + idNivel;

this.cargarImagenYConfigurar();

},



cargarImagenYConfigurar() {

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



// CONFIGURAR PIEZAS

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



// APLICACIÓN DEL FILTRO DURANTE LA CARGA

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

// Re-asignación de eventos para el nuevo nivel

divPieza.onclick = (e) => this.rotarPieza(this.piezas[i], -90, e); // Click Izq: -90

divPieza.oncontextmenu = (e) => this.rotarPieza(this.piezas[i], 90, e); // Click Der: +90

divPieza.classList.remove("pieza-fija");



grilla.appendChild(divPieza);

}

},



// APLICAR FILTROS (Refactorizado con Funciones de Orden Superior)

aplicarFiltro(canvas) {

const ctx = canvas.getContext("2d");

const datosImagen = ctx.getImageData(0, 0, canvas.width, canvas.height);

const datos = datosImagen.data;


// 1. Encontrar la configuración del nivel actual

const nivelConfig = NIVELES.find(n => n.id === this.nivelActual);

if (!nivelConfig) return;



// 2. Obtener la función de filtro del mapa

const funcionFiltro = FILTROS_MAP[nivelConfig.filtro];

if (!funcionFiltro) return;



// 3. Aplicar el filtro iterando sobre los datos (de 4 en 4)

for (let i = 0; i < datos.length; i += 4) {

let r = datos[i];

let g = datos[i + 1];

let b = datos[i + 2];



// Llamada a la función pura seleccionada, delegando la lógica de color

const [r_nuevo, g_nuevo, b_nuevo] = funcionFiltro(r, g, b);



datos[i] = r_nuevo;

datos[i + 1] = g_nuevo;

datos[i + 2] = b_nuevo;

// datos[i + 3] (alpha) se mantiene igual

}



ctx.putImageData(datosImagen, 0, 0);

},



// ROTAR PIEZA

rotarPieza(pieza, grados, evento) {

evento.preventDefault();

// Detener la rotación si está pausado o fija, o si los clics han sido deshabilitados (por victoria)

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



this.tiempoInicio -= 5000; // Penalización

this.ayuditaUsada = true;



const botonAyudita = document.getElementById("boton-ayudita");

botonAyudita.disabled = true;

botonAyudita.classList.add("deshabilitado");



this.verificarVictoria();

},



// VERIFICAR VICTORIA

verificarVictoria() {

const resuelto = this.piezas.every(p => p.rotacion === 0);

if (resuelto) {

this.detenerTemporizador();

this.quitarFiltros();



this.piezas.forEach(pieza => {

pieza.elemento.onclick = (e) => e.preventDefault();

pieza.elemento.oncontextmenu = (e) => e.preventDefault();

});



// 🔹 Mostrar animación de "COMPLETADO"

const mensaje = document.getElementById("mensaje-completado");

mensaje.classList.remove("oculto");

setTimeout(() => mensaje.classList.add("mostrar"), 80);



// 🔹 Ocultar animación justo antes de pasar a la pantalla de victoria

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


// Redibujar la parte de la imagen original sin filtro

ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

ctx.drawImage(img, columna * anchoPieza, fila * altoPieza, anchoPieza, altoPieza, 0, 0, anchoPieza, altoPieza);

});

};


img.src = this.imagenActual;

},



// VICTORIA

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



// TEMPORIZADOR Y TIEMPO

iniciarTemporizador() {

this.tiempoInicio = Date.now();

this.tiempoTranscurrido = 0;

this.actualizarTemporizador();



this.detenerTemporizador(); // Limpiar por si acaso

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



// 🛑 FUNCIÓN MODIFICADA: GESTIÓN DE LA CLASE 'ACTIVO'

pausarJuego() {

this.estaPausado = !this.estaPausado;

const boton = document.getElementById("boton-pausar-juego");


if (this.estaPausado) {

boton.textContent = "Reanudar";

boton.classList.add("activo"); // Añade la clase para el estilo y hover verde

} else {

boton.textContent = "Pausar";

boton.classList.remove("activo"); // Quita la clase para el estilo y hover rosa

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


