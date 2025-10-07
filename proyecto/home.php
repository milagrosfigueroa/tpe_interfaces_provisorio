<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameHub - Plataforma de Juegos</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Outfit:wght@400;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Rosario:wght@400;700&family=Roboto:wght@400;600&display=swap" rel="stylesheet">
    <link href="css/home.css" rel="stylesheet">
    <link href="css/barras.css" rel="stylesheet">
</head>
<body>

    <?php require './secciones/header.php'; ?>
    <?php require './secciones/nav_bar.php'; ?>
    
    <div id="loading-screen">
        <div class="loader-content">
            <div class="spinner-loader"></div>
            Cargando...
            <span class="loading-percentage">0%</span>
        </div>
    </div>

     
    <section id="seccion-destacados" class="carousel-module">
        <div class="main-container">
            <h2 class="section-title">Destacados</h2>

            <div class="carousel-and-nav-desktop">
                <button class="nav-button nav-button-left" aria-label="Anterior" onclick="previousSlide()">
                    <svg width="24" height="60" viewBox="0 0 24 60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 10 6 30 18 50"></polyline>
                    </svg>
                </button>

                <div class="carousel-wrapper">
                    <div class="carousel-container">
                         
                    </div>
                </div>

                <button class="nav-button nav-button-right" aria-label="Siguiente" onclick="nextSlide()">
                    <svg width="24" height="60" viewBox="0 0 24 60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 10 18 30 6 50"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    </section>

     
    <section class="mis-juegos">
        <h2 class="titulo">Mis Juegos</h2>

        <div class="contenido">
            <div class="info-izquierda">
                <img src="https://i.imgur.com/placeholder.png" alt="Logo Juegos" class="logo">
                <div class="texto">
                    <p>Aquí encontrarás tus juegos favoritos y las últimas partidas</p>
                </div>
            </div>

            <div class="juegos-container">
                <div class="game-card-mis-juegos">
                    <div class="game-card-image-mis-juegos">
                        <img src="https://i.imgur.com/L7wG3Pl.jpg" alt="Dragon ball">
                    </div>
                    <h2 class="game-card-title-mis-juegos">Dragon ball</h2>
                </div>

                <div class="game-card-mis-juegos">
                    <div class="game-card-image-mis-juegos">
                        <img src="https://i.imgur.com/S7yN4Fe.jpg" alt="Uno">
                    </div>
                    <h2 class="game-card-title-mis-juegos">Uno Online</h2>
                </div>

                <div class="game-card-mis-juegos">
                    <div class="game-card-image-mis-juegos">
                        <img src="https://i.imgur.com/HfH48gk.jpg" alt="Bad Ice Cream">
                    </div>
                    <h2 class="game-card-title-mis-juegos">Bad Ice cream 7</h2>
                </div>
            </div>
        </div>
    </section>

     
    <section class="main-container-carruseles">

        
        <section class="carousel-container">
            <h2 class="carousel-title">Multijugador</h2>
            <div class="carousel-wrapper-small">

                <button class="carousel-btn carousel-btn-left" data-carousel="carousel1" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                    
                    <div class="carousel-track" data-track="carousel1">
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Bomb It 7</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">Bad Ice Cream 3</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">Gun Mayhem 2</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Worms Armagedom</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/hu3PHcv.jpg" alt=""></div><h3 class="game-card-title">Uno Online</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">Ludo Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/pnmMJhG.jpg" alt=""></div><h3 class="game-card-title">Roblox</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">Chess Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">Steal a Brainrot</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">8 Ball Pool</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">Scrable Online</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Domino Online</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel1" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

        
        <section class="carousel-container">
            <h2 class="carousel-title">2 Jugadores</h2>
            <div class="carousel-wrapper-small">
                <button class="carousel-btn carousel-btn-left" data-carousel="carousel2" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                    <div class="carousel-track" data-track="carousel2">
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Fireboy & Watergirl 1</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">Money Movers</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">G-Switch 3</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Basket Random</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/hu3PHcv.jpg" alt=""></div><h3 class="game-card-title">Night City Racing</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">Soccer Legends 2021</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/pnmMJhG.jpg" alt=""></div><h3 class="game-card-title">Rolling Balls Sea Race</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">Chicken Scream</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">Tank Wars</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">Fish Stab Getting Big</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">Tres En Raya</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Tag Run</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel2" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

         
        <section class="carousel-container">
            <h2 class="carousel-title">Deportes</h2>
            <div class="carousel-wrapper-small">
                <button class="carousel-btn carousel-btn-left" data-carousel="carousel3" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                    <div class="carousel-track" data-track="carousel3">
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Fifa Online 4</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">eFootball 2025</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">Fifa Online 3</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/hu3PHcv.jpg" alt=""></div><h3 class="game-card-title">Knockout City</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">OlliOlli World</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">UFC 5</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Blood Bowl 3</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">NBA 2k24</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">NHL 25</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">Golf With Friends</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel3" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

        
        <section class="carousel-container">
            <h2 class="carousel-title">Acción</h2>
            <div class="carousel-wrapper-small">
                <button class="carousel-btn carousel-btn-left" data-carousel="carousel4" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                    <div class="carousel-track" data-track="carousel4">
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Zombie Horde</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">Autogun Heroes</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">Crash Bandicoot</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Red Ball</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/hu3PHcv.jpg" alt=""></div><h3 class="game-card-title">Squid game</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">Geometry Dash</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/pnmMJhG.jpg" alt=""></div><h3 class="game-card-title">Go Slimey Go</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">Sonic</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">Dragon Ball</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">Labubu</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">99 Nights</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Boxteria 2</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel4" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

         
        <section class="carousel-container">
            <h2 class="carousel-title">Clásicos</h2>
            <div class="carousel-wrapper-small">
                <button class="carousel-btn carousel-btn-left" data-carousel="carousel5" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                    <div class="carousel-track" data-track="carousel5">
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Arknoid</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">Bubble Shotter</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">Contra</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/pnmMJhG.jpg" alt=""></div><h3 class="game-card-title">Busca Minas</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">Pac Man</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Tetris</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">Space Invaders</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">Sonic</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Snake</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">Street Fighter II</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel5" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

         
        <section class="carousel-container">
            <h2 class="carousel-title">De Mesa</h2>
            <div class="carousel-wrapper-small">
                <button class="carousel-btn carousel-btn-left" data-carousel="carousel6" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                   <div class="carousel-track" data-track="carousel6">
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">UNO Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/pnmMJhG.jpg" alt=""></div><h3 class="game-card-title">Monopoly</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">Ludo Online</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Domino</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">Classic Chess</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">Chinchon Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/hu3PHcv.jpg" alt=""></div><h3 class="game-card-title">Poker Texas</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">Damas Chinas</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">Black Jack Online</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">Buraco Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel6" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

         
        <section class="carousel-container">
            <h2 class="carousel-title">Terror</h2>
            <div class="carousel-wrapper-small">
                <button class="carousel-btn carousel-btn-left" data-carousel="carousel7" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                  <div class="carousel-track" data-track="carousel7">
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Granny</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">Five Nights at Freddy</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">Ultimate Custom</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Poppy PlayTime</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/hu3PHcv.jpg" alt=""></div><h3 class="game-card-title">El Bebe de Armario</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">Deer Cannibal</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/pnmMJhG.jpg" alt=""></div><h3 class="game-card-title">Zardy's Maze</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">Late Laundry</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">Side Effects</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">Jolly 2</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">Kiosc</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Exit 8</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel7" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

         
        <section class="carousel-container">
            <h2 class="carousel-title">Carreras</h2>
            <div class="carousel-wrapper-small">
                <button class="carousel-btn carousel-btn-left" data-carousel="carousel8" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                    <div class="carousel-track" data-track="carousel8">
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Racing Limits</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">Formula Speed</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">Top Gear</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Cars 3D</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/hu3PHcv.jpg" alt=""></div><h3 class="game-card-title">Traffic Jam 3D</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">Mega Stunts GTA 5</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/pnmMJhG.jpg" alt=""></div><h3 class="game-card-title">Cliff Rocer</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">EVO F4</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">Mario Kart</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">Nazcar Rumble</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">Mr Racer</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Crazy Descent Race</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel8" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

         
        <section class="carousel-container">
            <h2 class="carousel-title">Cocina</h2>
            <div class="carousel-wrapper-small">
                <button class="carousel-btn carousel-btn-left" data-carousel="carousel9" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                    <div class="carousel-track" data-track="carousel9">
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">Bakery Story 2</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">Cooking Dash</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/hu3PHcv.jpg" alt=""></div><h3 class="game-card-title">Papa´s Pizzeria</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">My Cafe</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">Cooking Mama</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/pnmMJhG.jpg" alt=""></div><h3 class="game-card-title">Kitchen Scramble</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Good Pizza</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Ratatouille</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">World Chef</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">Cooking Fever</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel9" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

         
        <section class="carousel-container">
            <h2 class="carousel-title">Belleza</h2>
            <div class="carousel-wrapper-small">
                <button class="carousel-btn carousel-btn-left" data-carousel="carousel10" data-direction="anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div class="carousel-track-container">
                    <div class="carousel-track" data-track="carousel10">
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/aEFeuCi.jpg" alt=""></div><h3 class="game-card-title">Beauty Salon</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/HfH48gk.jpg" alt=""></div><h3 class="game-card-title">Hair Salon</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/hu3PHcv.jpg" alt=""></div><h3 class="game-card-title">Makeup Artist</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/ZkX8T6L.jpg" alt=""></div><h3 class="game-card-title">Spa Day</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/5sRh1cG.jpg" alt=""></div><h3 class="game-card-title">Nail Studio</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/pnmMJhG.jpg" alt=""></div><h3 class="game-card-title">Fashion Show</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">Style Studio</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/QPz64Fb.jpg" alt=""></div><h3 class="game-card-title">Dress Up</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/lNVFVi3.jpg" alt=""></div><h3 class="game-card-title">Glamour Girl</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="https://i.imgur.com/S7yN4Fe.jpg" alt=""></div><h3 class="game-card-title">Beauty Queen</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/kDWcKUd.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="https://i.imgur.com/L7wG3Pl.jpg" alt=""></div><h3 class="game-card-title">TBC</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel10" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

    </section>

     
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-column">
                <h3>Destacados</h3>
                <ul class="ul-footer">
                    <li>Top de la semana</li>
                    <li>Lanzamiento</li>
                    <li>Aleatorio del día</li>
                    <li>Recomendados para vos</li>
                    <li>En tendencia</li>
                    <li>Mis juegos</li>
                    <li>Modo desafío</li>
                    <li>Imperdibles</li>
                </ul>
            </div>

            <div class="footer-column">
                <h3>Soporte</h3>
                <ul class="ul-footer">
                    <li>Preguntas frecuentes</li>
                    <li>Guías y tutoriales</li>
                    <li>Reportar un problema</li>
                </ul>

                <h3 class="margin-top">Acerca de</h3>
                <ul class="ul-footer">
                    <li>Quienes somos</li>
                    <li>Nuestro equipo</li>
                    <li>Blog o novedades</li>
                </ul>
            </div>

            <div class="footer-column">
                <h3>Información legal</h3>
                <ul class="ul-footer">
                    <li>Términos y privacidad</li>
                    <li>Condiciones de uso</li>
                    <li>Política de cookies</li>
                    <li>Declaración de confianza</li>
                </ul>

                <h3>Contacto</h3>
                <ul class="ul-footer">
                    <li>gamehubinfo@gmail.com</li>
                    <li>Tel: +542494308645</li>
                </ul>
            </div>

            <div class="footer-column">
                <h3>Suscríbete a nuestro newsletter ¡Y entérate todas las novedades!</h3>
                <a href="#" class="subscribe-link">suscribirme
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 11L11 1M11 1H1M11 1V11" stroke="white" stroke-width="2"/>
                    </svg>
                </a>

                <h3 class="margin-top">Síguenos en</h3>
                <div class="social-icons">
                    <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                    <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                    <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                    <a href="#"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
                </div>

                <div class="logos">
                    <span class="logo-text">GameHub</span>
                    <div class="logo-icon">
                        <svg width="86" height="57" viewBox="0 0 86 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="43" cy="28.5" r="20" fill="#FA328A"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    
    <script src="./js/loading.js"></script>
    <script src="./js/carruselPrincipal.js"></script>
    <script src="./js/bloqueCarruseles.js"></script>
    <script src="./js/barras.js"></script>
</body>
</html>
