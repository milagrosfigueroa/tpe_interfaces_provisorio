document.addEventListener("DOMContentLoaded", () => {

  const carousels = {};
  
  // ... (La función getCardMetrics() queda exactamente igual) ...
  function getCardMetrics(track) {
    const container = track.closest('.carousel-track-container');
    const cards = track.querySelectorAll(".game-card");

    if (cards.length === 0) {
      return { anchoCard: 0, gap: 0, cardsVisibles: 1, cardsPorScroll: 1, totalCards: 0 };
    }

    const anchoCard = cards[0].getBoundingClientRect().width;
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const containerWidth = container.clientWidth;
    const cardsVisibles = Math.floor((containerWidth + gap) / (anchoCard + gap));
    const cardsPorScroll = cardsVisibles > 0 ? cardsVisibles : 1;

    return {
      anchoCard,
      gap,
      cardsVisibles,
      cardsPorScroll,
      totalCards: cards.length
    };
  }

  // ===============================================
  // INICIALIZACIÓN DE CAROUSELS
  // ===============================================
  document.querySelectorAll("[data-track]").forEach((track) => {
    const carouselId = track.dataset.track;

    const btnAnterior = document.querySelector(`[data-carousel="${carouselId}"][data-direction="anterior"]`);
    const btnSiguiente = document.querySelector(`[data-carousel="${carouselId}"][data-direction="siguiente"]`);
    const trackContainer = track.closest('.carousel-track-container');

    carousels[carouselId] = {
      track,
      btnAnterior,
      btnSiguiente,
      posActual: 0,
      maxPos: 0,
      distanciaAmover: 0,
    };

    function actualizarBotones() {
      if (!btnAnterior || !btnSiguiente) return;
      btnAnterior.disabled = carousels[carouselId].posActual >= 0;
      btnSiguiente.disabled = carousels[carouselId].posActual <= carousels[carouselId].maxPos;
    }

    // Recalcula métricas y ajusta la posición (Función clave corregida)
    function updateCarouselPositions() {
      const trackDisplay = window.getComputedStyle(track).display;

      // 🚨 VERIFICACIÓN CRÍTICA: Si no es flex (es grid o block), reseteamos.
      if (trackDisplay !== 'flex') {
          carousels[carouselId].posActual = 0;
          carousels[carouselId].maxPos = 0;
          track.style.transform = `translateX(0px)`;
          actualizarBotones();
          return; // Salimos de la función
      }

      // El resto de la lógica solo se ejecuta si el display es 'flex' (modo carrusel)
      const metrics = getCardMetrics(track);

      carousels[carouselId].distanciaAmover = (metrics.anchoCard + metrics.gap) * metrics.cardsPorScroll;

      const scrollableCards = metrics.totalCards - metrics.cardsVisibles;
      let newMaxPos = 0;
      if (scrollableCards > 0) {
        newMaxPos = -((metrics.anchoCard + metrics.gap) * scrollableCards);
      }
      carousels[carouselId].maxPos = newMaxPos;

      // 🌟 LÓGICA DE AJUSTE DE POSICIÓN
      if (carousels[carouselId].posActual < carousels[carouselId].maxPos) {
        // Ajuste al nuevo límite máximo si el viewport se hizo más pequeño
        carousels[carouselId].posActual = carousels[carouselId].maxPos;
      } else if (carousels[carouselId].posActual > 0) {
        // Ajuste al límite de inicio (0)
        carousels[carouselId].posActual = 0;
      }

      // Aplicar el transform
      track.style.transform = `translateX(${carousels[carouselId].posActual}px)`;
      actualizarBotones();
    }

    function moverCarrusel(direccion) {
      updateCarouselPositions(); // Siempre actualizamos antes de mover

      if (window.getComputedStyle(track).display !== 'flex') {
          // Si por alguna razón intentamos mover en modo grid, simplemente salimos.
          return; 
      }
      
      let nuevaPos;

      if (direccion === "siguiente") {
        nuevaPos = carousels[carouselId].posActual - carousels[carouselId].distanciaAmover;
        carousels[carouselId].posActual = Math.max(nuevaPos, carousels[carouselId].maxPos);

      } else { // Direccion: anterior
        nuevaPos = carousels[carouselId].posActual + carousels[carouselId].distanciaAmover;
        carousels[carouselId].posActual = Math.min(nuevaPos, 0);
      }

      track.style.transform = `translateX(${carousels[carouselId].posActual}px)`;
      actualizarBotones();
    }

    // ------------------------------------------------------------------
    // EVENTOS
    // ------------------------------------------------------------------
    if (btnSiguiente) btnSiguiente.addEventListener("click", () => moverCarrusel("siguiente"));
    if (btnAnterior) btnAnterior.addEventListener("click", () => moverCarrusel("anterior"));

    // Usar ResizeObserver
    if (trackContainer) {
      const resizeObserver = new ResizeObserver(() => {
        // Llama a la función de actualización siempre que el tamaño cambie
        updateCarouselPositions();
      });
      resizeObserver.observe(trackContainer);
    }

    // Llamar una vez al inicio
    updateCarouselPositions();
  });

  // ... (La lógica de truncar títulos queda exactamente igual) ...
  const titulosJuegos = document.querySelectorAll(".game-card-title");
  const maxLength = 27;

  titulosJuegos.forEach((title) => {
    if (title.textContent.length > maxLength) {
      title.textContent = title.textContent.slice(0, maxLength) + "...";
    }
  });
});
