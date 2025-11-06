document.addEventListener('DOMContentLoaded', () => {
    const botonIniciar = document.getElementById('botonIniciar');
    const paginaInicio = document.getElementById('paginaInicio');
    const paginaJuego = document.getElementById('paginaJuego');

    paginaInicio.style.display = 'flex';
    paginaJuego.style.display = 'none';

    botonIniciar.addEventListener('click', () => {
        paginaInicio.style.display = 'none';

        paginaJuego.style.display = 'block';
    });
});
