<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameHub - Plataforma de Juegos</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Outfit:wght@400;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Rosario:wght@400;700&family=Roboto:wght@400;600&family=Micro+5&display=swap" rel="stylesheet">
    <link href="css/home11.css" rel="stylesheet">
    <link href="./css/barras1.css" rel="stylesheet">
    <link href="./css/footer.css" rel="stylesheet">
    
    <link href="./css/carruselPrincipal.css" rel="stylesheet">
    <link href="./css/misJuegos.css" rel="stylesheet">
    <link href="./css/bloqueCarruseles.css" rel="stylesheet">
 


</head>
<body>

    <?php require './secciones/header1.php'; ?>
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
        <?php require 'secciones/footer.php'; ?> 
    </div>

   


    <script src="./js/bloqueCarruseles.js"></script>

    <script src="./js/barras.js"></script>
    <script src="./js/loading.js"></script>

   
</body>
</html>
