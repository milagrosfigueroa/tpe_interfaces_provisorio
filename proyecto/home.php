<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameHub - Plataforma de Juegos</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Outfit:wght@400;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Rosario:wght@400;700&family=Roboto:wght@400;600&family=Micro+5&display=swap" rel="stylesheet">
    <link href="css/home.css" rel="stylesheet">
    <link href="css/barras.css" rel="stylesheet">
    <link href="css/footer.css" rel="stylesheet">
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
                <img src="images/imgMisjuegos/logoSentado.png" alt="Logo Juegos" class="logo">
                <div class="texto">
                    <p>Aquí encontrarás tus juegos favoritos y las últimas partidas</p>
                </div>
            </div>

            <div class="juegos-container">
                <div class="game-card-mis-juegos">
                    <div class="game-card-image-mis-juegos">
                        <img src="images/imgMisjuegos/dragonBall.jpg" alt="Dragon ball">
                    </div>
                    <h2 class="game-card-title-mis-juegos">Dragon ball</h2>
                </div>

                <div class="game-card-mis-juegos">
                    <div class="game-card-image-mis-juegos">
                        <img src="images/imgMisjuegos/uno.jpg" alt="Uno">
                    </div>
                    <h2 class="game-card-title-mis-juegos">Uno Online</h2>
                </div>

                <div class="game-card-mis-juegos">
                    <div class="game-card-image-mis-juegos">
                        <img src="images/imgMisjuegos/badicecream.jpg" alt="Bad Ice Cream">
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
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/multijugador/Bomb it 7.png" alt=""></div><h3 class="game-card-title">Bomb It 7</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/multijugador/bad ice cream 7.jpg" alt=""></div><h3 class="game-card-title">Bad Ice Cream 3</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/multijugador/Gun Mayhem 2.jpg" alt=""></div><h3 class="game-card-title">Gun Mayhem 2</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/multijugador/Worms Armageddon.jpg" alt=""></div><h3 class="game-card-title">Worms Armageddom</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/multijugador/Uno.jpg" alt=""></div><h3 class="game-card-title">Uno Online</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/multijugador/Ludo.png" alt=""></div><h3 class="game-card-title">Ludo Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/multijugador/roblox.jpeg" alt=""></div><h3 class="game-card-title">Roblox</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/multijugador/Chess Online.jpg" alt=""></div><h3 class="game-card-title">Chess Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/multijugador/stealABrainrot.avif" alt=""></div><h3 class="game-card-title">Steal a Brainrot</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/multijugador/8 Ball Pool.jpg" alt=""></div><h3 class="game-card-title">8 Ball Pool</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/multijugador/scrabble.jpg" alt=""></div><h3 class="game-card-title">Scrable Online</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/multijugador/Domino.jpg" alt=""></div><h3 class="game-card-title">Domino Online</h3></div>
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
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/FireBoy and Watergirl.jpg" alt=""></div><h3 class="game-card-title">Fireboy & Watergirl 1</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/Money Movers.jpg" alt=""></div><h3 class="game-card-title">Money Movers</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/G-Switch 3.png" alt=""></div><h3 class="game-card-title">G-Switch 3</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/Basket random.jpg" alt=""></div><h3 class="game-card-title">Basket Random</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/Night city racing.jpg" alt=""></div><h3 class="game-card-title">Night City Racing</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/Soccer legends 2021.jpg" alt=""></div><h3 class="game-card-title">Soccer Legends 2021</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/Rolling balls sea race.jpg" alt=""></div><h3 class="game-card-title">Rolling Balls Sea Race</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/Chicken Scream.jpg" alt=""></div><h3 class="game-card-title">Chicken Scream</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/Tank Wars.jpg" alt=""></div><h3 class="game-card-title">Tank Wars</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/Fish Stab Getting Big.png" alt=""></div><h3 class="game-card-title">Fish Stab Getting Big</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/3enRaya.jpg" alt=""></div><h3 class="game-card-title">Tres En Raya</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/2jugadores/tagRun.jpg" alt=""></div><h3 class="game-card-title">Tag Run</h3></div>
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
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deporte/fifa_online_4.jpg" alt="fifa online 4"></div><h3 class="game-card-title">Fifa Online 4</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deporte/eFootball_edition_Leo_Messi_2025.jpg" alt="eFootball Leo Messi"></div><h3 class="game-card-title">eFootball edition Leo Messi 2025</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deporte/head_soccer.jpg" alt="head soccer"></div><h3 class="game-card-title">Fifa Online 3</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deporte/Knockout_City.jpg" alt="knockout city"></div><h3 class="game-card-title">Knockout City</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deporte/OlliOlli_World.jpg" alt="OlliOlli world"></div><h3 class="game-card-title">OlliOlli World</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deporte/UFC_5.jpg" alt="UFC 5"></div><h3 class="game-card-title">UFC 5</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deporte/Blood_Bowl_3.jpg" alt="Blood bowl 3"></div><h3 class="game-card-title">Blood Bowl 3</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deporte/NBA_2k24.jpg" alt="NBA 2k24"></div><h3 class="game-card-title">NBA 2k24</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deporte/NHL_25.jpg" alt="NHL 25"></div><h3 class="game-card-title">NHL 25</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deporte/Golf_With_Your_Friends.jpg" alt="golf with your friends"></div><h3 class="game-card-title">Golf With Your Friends</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deporte/MLB_The_Show_25.jpg" alt="MLB the show"></div><h3 class="game-card-title">TBC</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deporte/EA_Sports_FC_25.jpg" alt="EA sports fc 25"></div><h3 class="game-card-title">TBC</h3></div>
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
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/accion/Zombie horde Build & Survive.jpg" alt=""></div><h3 class="game-card-title">Zombie Horde</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/accion/Autogun heroes.png" alt=""></div><h3 class="game-card-title">Autogun Heroes</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/accion/Crash Bandicoot.jpg" alt=""></div><h3 class="game-card-title">Crash Bandicoot</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/accion/red ball.jpg" alt=""></div><h3 class="game-card-title">Red Ball</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/accion/Squid Game.jpg" alt=""></div><h3 class="game-card-title">Squid game</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/accion/Geometry Dash.jpg" alt=""></div><h3 class="game-card-title">Geometry Dash</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/accion/Go Slimey Go.jpg" alt=""></div><h3 class="game-card-title">Go Slimey Go</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/accion/sonic the hedhehog (1).jpg" alt=""></div><h3 class="game-card-title">Sonic The hedhehog</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/accion/Dragon Ball Advanced Adventure.jpg" alt=""></div><h3 class="game-card-title">Dragon Ball Advanced Adventure</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/accion/Labubu Playground.jpg" alt=""></div><h3 class="game-card-title">Labubu Playground</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/accion/99nightsintheforest.webp" alt=""></div><h3 class="game-card-title">99 Nights In The Forest</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/accion/boxteria2.jpeg" alt=""></div><h3 class="game-card-title">Boxteria 2</h3></div>
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
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/clasicos/arkanoid.jpg" alt="arkanoid"></div><h3 class="game-card-title">Arknoid</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/clasicos/bubble_shooter.jpg" alt="bubble shooter"></div><h3 class="game-card-title">Bubble Shotter</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/clasicos/contra.jpg" alt="contra"></div><h3 class="game-card-title">Contra</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/clasicos/busca_minas.jpg" alt="busca minas"></div><h3 class="game-card-title">Busca Minas</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/clasicos/pac_man.jpg" alt="pac man"></div><h3 class="game-card-title">Pac Man</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/clasicos/Tetris.jpg" alt="tetris"></div><h3 class="game-card-title">Tetris</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/clasicos/space_invaders.jpg" alt="space invaders"></div><h3 class="game-card-title">Space Invaders</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/clasicos/sonic_the_hedhehog.jpg" alt="sonic the hedhehog"></div><h3 class="game-card-title">Sonic The Hedhehog</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/clasicos/snake.jpg" alt="snake"></div><h3 class="game-card-title">Snake</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/clasicos/street_fighter_II.jpg" alt="street fighter II"></div><h3 class="game-card-title">Street Fighter II</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/clasicos/solitario_klondike.jpg" alt="solitario klondike"></div><h3 class="game-card-title">Solitario Klondike</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/clasicos/mahjong.jpg" alt="mahjong"></div><h3 class="game-card-title">Mahjong</h3></div>
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
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa1UNOOnline.jpg" alt="uno online"></div><h3 class="game-card-title">UNO Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa2Monopoly.webp" alt="monopoly"></div><h3 class="game-card-title">Monopoly</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa3LudoOnline.jpg" alt="ludo online"></div><h3 class="game-card-title">Ludo Online</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa4Domino.png" alt="domino"></div><h3 class="game-card-title">Domino</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa5ClassicChess.webp" alt="classic chess"></div><h3 class="game-card-title">Classic Chess</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa6ChinchonOnline.jpeg" alt="chinchon online"></div><h3 class="game-card-title">Chinchon Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa7PokerTexas.webp" alt="poker texas"></div><h3 class="game-card-title">Poker Texas </h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa8DamasChinas.png" alt="damas chinas"></div><h3 class="game-card-title">Damas Chinas</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa9BlackJackOnline.jpg" alt="black jack online"></div><h3 class="game-card-title">Black Jack Online</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa10BuracoOnline.jpg" alt="buraco online"></div><h3 class="game-card-title">Buraco Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa11ParchisOnline.jpeg" alt="parchis online"></div><h3 class="game-card-title">Parchis Online</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/deMesa/mesa12DreamPetHotel.jpg" alt="dream pet hotel"></div><h3 class="game-card-title">Dream Pet Hotel</h3></div>
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
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/terror/terror1Granny.jpg" alt=""></div><h3 class="game-card-title">Granny</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/terror/terror2FiveNightsAtFreddy.jpeg" alt=""></div><h3 class="game-card-title">Five Nights at Freddy</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/terror/terror3UltimateCustom.webp" alt=""></div><h3 class="game-card-title">Ultimate Custom</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/terror/terror4PoppyPlayTime.jpg" alt=""></div><h3 class="game-card-title">Poppy PlayTime</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/terror/terror5ElBebeDeArmario.jpg" alt=""></div><h3 class="game-card-title">El Bebe de Armario</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/terror/terror6DearCannibal.jpg" alt=""></div><h3 class="game-card-title">Deer Cannibal</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/terror/terror7Zardy'sMaze.jpeg" alt=""></div><h3 class="game-card-title">Zardy’s Maze</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/terror/terror8LateLaundry.png" alt=""></div><h3 class="game-card-title">Late Laundry</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/terror/terror9SideEffects.png" alt=""></div><h3 class="game-card-title">Side Effects</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/terror/terror10Jolly2.webp" alt=""></div><h3 class="game-card-title">Jolly 2</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/terror/terror11Kiosk.jpg" alt=""></div><h3 class="game-card-title">Kiosc</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/terror/terror12Exit8.webp" alt=""></div><h3 class="game-card-title">Exit 8</h3></div>
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
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras1RacingLimits.png" alt=""></div><h3 class="game-card-title">Racing Limits</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras2FormulaSpeed.PNG" alt=""></div><h3 class="game-card-title">Formula Speed</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras3TopGear.jpg" alt=""></div><h3 class="game-card-title">Top Gear</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras4Cards3D.jpg" alt=""></div><h3 class="game-card-title">Cars 3D</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras5TrafficJam3D.jpeg" alt=""></div><h3 class="game-card-title">Traffic Jam 3D</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras6MegaStuntsGTA5.png" alt=""></div><h3 class="game-card-title">Mega Stunts GTA 5</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras7CliffRacer.jpg" alt=""></div><h3 class="game-card-title">Cliff Rocer</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras8EVOF4" alt=""></div><h3 class="game-card-title">EVO F4</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras9MarioKart.jpg" alt=""></div><h3 class="game-card-title">Mario Kart</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras10NazcarRumble.jpg" alt=""></div><h3 class="game-card-title">Nazcar Rumble</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras11MrRacer.jpg" alt=""></div><h3 class="game-card-title">Mr Racer</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/carreras/carreras12CrazyDescentRace.jpeg" alt=""></div><h3 class="game-card-title">Crazy Descent Race</h3></div>
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
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/cocina/Bakery_story_2.jpg" alt="bakery story 2"></div><h3 class="game-card-title">Bakery Story 2</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/cocina/Cooking_dash.jpg" alt="cooking dash"></div><h3 class="game-card-title">Cooking Dash</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/cocina/Papa´s_pizzeria.jpg" alt="Papa´s pizzeria"></div><h3 class="game-card-title">Papa´s Pizzeria</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/cocina/My_cafe_restaurant_game.jpg" alt="My cafe restaurant game"></div><h3 class="game-card-title">My Cafe: restaurant game</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/cocina/Cooking_Mama.jpg" alt="cooking mama"></div><h3 class="game-card-title">Cooking Mama</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/cocina/Kitchen_scramble.jpg" alt="Kitchen Scramble"></div><h3 class="game-card-title">Kitchen Scramble</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/cocina/Good_pizza_great_pizza.jpg" alt="good pizza, great pizza"></div><h3 class="game-card-title">Good Pizza, Great Pizza</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/cocina/Ratatouille_the_game.jpg" alt="Ratatouille the game"></div><h3 class="game-card-title">Ratatouille: the game</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/cocina/World_chef.jpg" alt="world chef"></div><h3 class="game-card-title">World Chef</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/cocina/Cooking_Fever.jpg" alt="cooking fever"></div><h3 class="game-card-title">Cooking Fever</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/cocina/OverCooked!_2.jpg" alt="OverCooked! 2"></div><h3 class="game-card-title">OverCooked! 2</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/cocina/Cooking_Battle_2.jpg" alt="Cooking Battle 2"></div><h3 class="game-card-title">Cooking Battle 2</h3></div>
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
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/belleza/Avakin_Life.jpg" alt="Avakin life"></div><h3 class="game-card-title">Avakin Life</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/belleza/barbie_fashion_closet.jpg" alt="barbie fashion closet"></div><h3 class="game-card-title">Barbie Fashion Closet</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/belleza/CocoPPa_Dolls.jpg" alt="CocoPPa Dolls"></div><h3 class="game-card-title">CocoPPa Dolls</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/belleza/covet_fashion.jpg" alt="covet fashion"></div><h3 class="game-card-title">Covet Fashion</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/belleza/Dress_Up_Games.jpg" alt="dress up games"></div><h3 class="game-card-title">Dress Up Games</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/belleza/fashion_fever.jpg" alt="fashion fever"></div><h3 class="game-card-title">Fashion Fever</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/belleza/Frozen_Makeup.jpg" alt="frozen makeup"></div><h3 class="game-card-title">Frozen Makeup</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/belleza/glamour_life.jpg" alt="glamour life"></div><h3 class="game-card-title">Glamour Life</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/belleza/Hair_Challenge.jpg" alt="hair challenge"></div><h3 class="game-card-title">Hair Challenge</h3></div>
                        <div class="game-card"><div class="price-tag">$</div><div class="game-card-image"><img src="images/imgCarruseles/belleza/lady_popular.jpg" alt="lady popular"></div><h3 class="game-card-title">Lady Popular</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/belleza/Love_Nikki-Dress_UP_Queen.jpg" alt="love nikki dress up queen"></div><h3 class="game-card-title">Love Nikki-Dress: UP Queen</h3></div>
                        <div class="game-card"><div class="game-card-image"><img src="images/imgCarruseles/belleza/Makeup_Artist_Makeover_Games.jpg" alt="makeup artist makeover games"></div><h3 class="game-card-title">Makeup Artist Makeover Games</h3></div>
                    </div>
                </div>
                <button class="carousel-btn carousel-btn-right" data-carousel="carousel10" data-direction="siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </section>

    </section>

     
    <?php require 'secciones/footer.php'; ?> 


    
    <script src="./js/loading.js"></script>
    <script src="./js/carruselPrincipal.js"></script>
    <script src="./js/bloqueCarruseles.js"></script>
    <script src="./js/barras.js"></script>
</body>
</html>
