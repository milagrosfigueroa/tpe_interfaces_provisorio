const carousels = {};

document.querySelectorAll('[data-track]').forEach(track => {
  const carouselId = track.dataset.track;

  const btnAnterior = document.querySelector(`[data-carousel="${carouselId}"][data-direction="anterior"]`);
  const btnSiguiente = document.querySelector(`[data-carousel="${carouselId}"][data-direction="siguiente"]`);

  const cards = track.querySelectorAll('.game-card');
  const totalCards = cards.length;

  const anchoCard = 160;
  const gap = 8;
  const cardsVisibles = 2;
  const cardsPorScroll = 2;

  const distanciaAmover = (anchoCard + gap) * cardsPorScroll;

  let posActual = 0;
  let maxPos = -((anchoCard + gap) * (totalCards - cardsVisibles));

  carousels[carouselId] = {
    track,
    btnAnterior,
    btnSiguiente,
    posActual,
    maxPos,
    distanciaAmover
  };

  function actualizarBotones() {
    btnAnterior.disabled = carousels[carouselId].posActual === 0;
    btnSiguiente.disabled = carousels[carouselId].posActual <= carousels[carouselId].maxPos;
  }

  function moverCarrusel(direccion) {
    if (direccion === 'siguiente') {
      let nuevaPos = carousels[carouselId].posActual - carousels[carouselId].distanciaAmover;

      if (nuevaPos < carousels[carouselId].maxPos) {
        carousels[carouselId].posActual = carousels[carouselId].maxPos;
      } else {
        carousels[carouselId].posActual = nuevaPos;
      }
    } else {
      let nuevaPos = carousels[carouselId].posActual + carousels[carouselId].distanciaAmover;

      if (nuevaPos > 0) {
        carousels[carouselId].posActual = 0;
      } else {
        carousels[carouselId].posActual = nuevaPos;
      }
    }

    track.style.transform = `translateX(${carousels[carouselId].posActual}px)`;
    actualizarBotones();
  }

  btnSiguiente.addEventListener('click', () => moverCarrusel('siguiente'));
  btnAnterior.addEventListener('click', () => moverCarrusel('anterior'));

  actualizarBotones();
});

const titulosJuegos = document.querySelectorAll('.game-card-title');
const maxLength = 27;

titulosJuegos.forEach(title => {
    if (title.textContent.length > maxLength) {
        title.textContent = title.textContent.slice(0, maxLength) + '...';
    }
});