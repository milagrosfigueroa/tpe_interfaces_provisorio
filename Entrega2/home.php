<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameHub - Plataforma de Juegos</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Outfit:wght@400;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Rosario:wght@400;700&family=Roboto:wght@400;600&family=Micro+5&display=swap" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">


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

 
    <div class="content">
        <?php require './secciones/carruselPrincipal.php'; ?>
        <?php require './secciones/misJuegos.php'; ?>
        <?php require './secciones/bloqueCarruseles.php'; ?>
    </div>

    <?php require 'secciones/footer.php'; ?> 


    <script src="./js/bloqueCarruseles.js"></script>

    <script src="./js/barras.js"></script>
    <script src="./js/loading.js"></script>
    <script src="./js/redireccionamiento.js"></script>


   
</body>
</html>
