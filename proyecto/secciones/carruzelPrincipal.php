<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrusel Principal</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Orbitron:wght@400;500;600;700;800;900&family=Rosario:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="carruzelPrincipal.css">
</head>
<body>
    
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

    <script src="loading.js"></script>
    <script src="carruselPrincipal.js"></script>
</body>
</html>
