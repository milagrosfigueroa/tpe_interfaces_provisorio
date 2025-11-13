document.addEventListener('DOMContentLoaded', () => {
    // Obtener los contenedores principales (pantallas)
    const paginaInicio = document.getElementById('paginaInicio');
    const paginaJuego = document.getElementById('paginaJuego');
    const pantallaInstrucciones = document.querySelector('.flappy-pantalla-instrucciones');
    
    // Obtener los botones de la pantalla de inicio
    const botonIniciar = document.getElementById('botonIniciar');
    const btnInstrucciones = document.getElementById('btn-instrucciones');
    
    // Obtener el botón de 'VOLVER'
    const btnVolver = document.querySelector('.flappy-btn-volver');

    // Inicialización: Mostrar solo la pantalla de inicio
    if (paginaInicio) {
        paginaInicio.style.display = 'flex';
    }
    if (paginaJuego) {
        paginaJuego.style.display = 'none';
    }
    if (pantallaInstrucciones) {
        pantallaInstrucciones.style.display = 'none';
    }

    // --- Lógica del botón JUGAR ---
    if (botonIniciar) {
        botonIniciar.addEventListener('click', () => {
            // Ocultar pantalla de inicio
            if (paginaInicio) {
                paginaInicio.style.display = 'none';
            }
            // Mostrar pantalla de juego
            if (paginaJuego) {
                paginaJuego.style.display = 'block'; 
            }
        });
    }

    // --- Lógica del botón INSTRUCCIONES ---
    if (btnInstrucciones) {
        btnInstrucciones.addEventListener('click', () => {
            // Ocultar pantalla de inicio
            if (paginaInicio) {
                paginaInicio.style.display = 'none';
            }
            // Mostrar pantalla de instrucciones (usando 'flex' como en el CSS)
            if (pantallaInstrucciones) {
                pantallaInstrucciones.style.display = 'flex';
            }
        });
    }

    // --- Lógica del botón VOLVER (desde instrucciones) ---
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            // Ocultar pantalla de instrucciones
            if (pantallaInstrucciones) {
                pantallaInstrucciones.style.display = 'none';
            }
            // Mostrar pantalla de inicio
            if (paginaInicio) {
                paginaInicio.style.display = 'flex';
            }
        });
    }
});


