// agarro elementos del DOM
const track = document.getElementById('carouselTrack'); // agarro el track que tiene los cards dentro
const btnAnterior = document.getElementById('anterior'); // agarro boton anterior por su id
const btnSiguiente = document.getElementById('siguiente'); // agarro boton siguiente por su id

const cards = document.querySelectorAll('.game-card'); // agarro todos los elementos con clase .game-card y los guardo
const totalCards = cards.length; // cuento cuantas cards agarré

const anchoCard = 160; // ancho fijo 160px por card en mobile
const gap = 8; // separación entre cards
const cardsVisibles = 2; // cantidad de cards que se ven en mobile
const cardsPorScroll = 2; // cantidad de cards que se mueven al apretar un botón

const distanciaAmover = (anchoCard + gap) * cardsPorScroll; // la distancia a mover es: (ancho de card + espacio entre ellas) * cantidad de cards a mover

let posActual = 0; // guarda la posición actual del carrusel en px. Arranca en 0 porque está todo alineado a la izquierda
let maxPos = -((anchoCard + gap) * (totalCards - cardsVisibles)); 
// esto indica hasta dónde puede moverse el carrusel sin dejar espacio vacío.
// (totalCards - cardsVisibles) → cuántas quedan ocultas
// (anchoCard + gap) → ancho total por card
// al multiplicarlos → la cantidad máxima de px que puede moverse
// el valor es NEGATIVO porque mover a la izquierda requiere un translateX negativo
// EJEMPLO: si hay 8 cards y se ven 2 → (160+8)*(8-2)=1008 → maxPos = -1008px

function actualizarBotones() {
  btnAnterior.disabled = posActual === 0; // si estoy en el inicio (pos 0), deshabilito botón anterior
  btnSiguiente.disabled = posActual <= maxPos; // si llego al final o lo pasé, deshabilito botón siguiente
}

function moverCarrusel(direccion) { // mueve el carrusel según el botón que se presione
  if (direccion === 'siguiente') {
    let nuevaPos = posActual - distanciaAmover; // al ir a siguiente, resto px para desplazarme a la izquierda

    if (nuevaPos < maxPos) { 
      // si me paso más allá del máximo permitido, seteo la posición en maxPos (tope final)
      posActual = maxPos;
    } else { 
      // si no me paso, seteo la nueva posición calculada
      posActual = nuevaPos;
    }

  } else { // si aprieto anterior, voy a la derecha (sumo px)
    let nuevaPos = posActual + distanciaAmover;

    if (nuevaPos > 0) { 
      // si me paso del inicio (más de 0px), lo dejo en 0 (tope inicial)
      posActual = 0;
    } else {
      // si no me paso, seteo la nueva posición calculada
      posActual = nuevaPos;
    }
  }

  track.style.transform = `translateX(${posActual}px)`; // aplico el desplazamiento al track

  actualizarBotones(); // cada vez que me muevo, actualizo los botones
}

// escucho clicks en los botones y llamo a la función moverCarrusel con la dirección correcta
btnSiguiente.addEventListener('click', () => moverCarrusel('siguiente')); 
btnAnterior.addEventListener('click', () => moverCarrusel('anterior')); 

actualizarBotones(); // al cargar la página, seteo el estado correcto de los botones
