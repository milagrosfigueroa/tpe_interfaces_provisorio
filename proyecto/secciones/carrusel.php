<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrusel de Juegos</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="./carrusel.css" rel="stylesheet">
</head>
<body>

    <section class="carousel-container">
    <h2 class="carousel-title">Mis Juegos</h2>

    <div class="carousel-wrapper">
        <button class="carousel-btn carousel-btn-left" id="anterior">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        </button>

        <div class="carousel-track-container">
        <div class="carousel-track" id="carouselTrack">

            <div class="game-card">
            <div class="game-card-image">
                <img src="img/dragonBall.jpg" alt="Racing Limits">
            </div>
            <h3 class="game-card-title">Racing Limits</h3>
            </div>

            <div class="game-card">
            <div class="price-tag">$</div>
            <div class="game-card-image">
                <img src="img/crash.jpg" alt="Cooking Mama">
            </div>
            <h3 class="game-card-title">Cooking Mama</h3>
            </div>

            <div class="game-card">
            <div class="price-tag">$</div>
            <div class="game-card-image">
                <img src="img/dragonBall.jpg" alt="Soccer Game">
            </div>
            <h3 class="game-card-title">Soccer Game</h3>
            </div>

            <div class="game-card">
            <div class="game-card-image">
                <img src="img/dragonBall.jpg" alt="Subway Surfers">
            </div>
            <h3 class="game-card-title">Subway Surfers</h3>
            </div>

            <div class="game-card">
            <div class="price-tag">$</div>
            <div class="game-card-image">
                <img src="img/Labubu.jpg" alt="Super Mario">
            </div>
            <h3 class="game-card-title">Super Mario</h3>
            </div>

            <div class="game-card">
            <div class="game-card-image">
                <img src="img/dragonBall.jpg" alt="Dragon Ball">
            </div>
            <h3 class="game-card-title">Dragon Ball</h3>
            </div>

            <div class="game-card">
            <div class="game-card-image">
                <img src="img/redBall.jpg" alt="Need for Speed">
            </div>
            <h3 class="game-card-title">Need for Speed</h3>
            </div>

            <div class="game-card">
            <div class="price-tag">$</div>
            <div class="game-card-image">
                <img src="img/dragonBall.jpg" alt="Minecraft">
            </div>
            <h3 class="game-card-title">Minecraft</h3>
            </div>

            <div class="game-card">
            <div class="price-tag">$</div>
            <div class="game-card-image">
                <img src="img/redBall.jpg" alt="FIFA 24">
            </div>
            <h3 class="game-card-title">FIFA 24</h3>
            </div>

            <div class="game-card">
            <div class="game-card-image">
                <img src="img/dragonBall.jpg" alt="Fortnite">
            </div>
            <h3 class="game-card-title">Fortnite</h3>
            </div>

            <div class="game-card">
            <div class="game-card-image">
                <img src="img/dragonBall.jpg" alt="Call of Duty">
            </div>
            <h3 class="game-card-title">Call of Duty</h3>
            </div>

        </div>
        </div>

        <button class="carousel-btn carousel-btn-right" id="siguiente">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        </button>
    </div>
    </section>
    <script src="../js/carrusel.js"></script>
</body>
</html>
