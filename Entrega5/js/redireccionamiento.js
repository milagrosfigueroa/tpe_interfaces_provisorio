// =======================================================================
// LÓGICA DE REDIRECCIÓN Y EVENTOS DE CLIC DEL HOME,  LOGIN Y JUEGO PEG
// =======================================================================

    // a. CLICK EN LOGOUT (Usa el ID 'logout-link')
    const logoutLink = document.getElementById('logout-link');

    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault(); // Evita que el enlace # se active
            window.location.href = 'logIn.html'; // Redirige al login
        });
    }

    // b. CLIC EN LA TARJETA DEL JUEGO 'PEG SOLITAIRE' (Usa el ID 'card-peg')
    const cardPegSolitaire = document.getElementById('card-peg');
    
    if (cardPegSolitaire) {
        cardPegSolitaire.addEventListener('click', function() {
            window.location.href = 'juegoPeg.html'; // Redirige al juego
        });        
        cardPegSolitaire.style.cursor = 'pointer'; 
    }

    // c. CLIC EN LA TARJETA DEL JUEGO 'BLOCKA' (Usa el ID 'card-blocka')

        const cardBlocka = document.getElementById('card-blocka');
    
    if (cardBlocka) {
        cardBlocka.addEventListener('click', function() {
            window.location.href = 'blocka.html'; // Redirige al juego
        });        
        cardBlocka.style.cursor = 'pointer'; 
    }

        // D. CLIC EN LA TARJETA DEL JUEGO 'FLAPPY' (Usa el ID 'card-flappy')

    const cardFlappy = document.getElementById('card-flappy');
    
    if (cardFlappy) {
        cardFlappy.addEventListener('click', function() {
            window.location.href = 'flappy.html'; // Redirige al juego
        });        
        cardFlappy.style.cursor = 'pointer'; 
    }


    
    // E. CLIC EN EL LOGO GAMEHUB (Usa el ID 'logo-inicio')
    const logoInicio = document.getElementById('logo-inicio');

    // Verifica que el elemento exista antes de agregar el listener
    if (logoInicio) {
        // Agrega el evento 'click'
        logoInicio.addEventListener('click', function() {
            // Redirige al usuario a la página index.html
            window.location.href = 'home.html';
        });
    }

    // F. CLIC EN EL HOME SIDEBAR (Usa el ID 'enlace-home-sidebar')
    const enlaceHomeSidebar = document.getElementById('enlace-home-sidebar');

    if (enlaceHomeSidebar) {
        // Agrega el evento 'click'
        enlaceHomeSidebar.addEventListener('click', function(e) {
            // Previene el comportamiento por defecto del enlace (#)
            e.preventDefault(); 
            
            // Redirige al usuario a la página principal
            window.location.href = 'home.html';
        });
    }
