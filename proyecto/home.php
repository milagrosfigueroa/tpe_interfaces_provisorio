<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameHub</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="css/barras.css">    
    <link rel="stylesheet" href="css/misJuegos.css">     
    <link rel="stylesheet" href="css/footer.css">
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/bloqueCarruseles.css">
    <link rel="stylesheet" href="css/carruselPrincipal.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Montserrat&family=Micro+5&family=Roboto&display=swap" rel="stylesheet">
</head>
<body>
    <?php
        // Barras de navegación
        require 'secciones/header.php';
        require 'secciones/nav_bar.php';
    ?>

    <!-- Contenedor principal para el contenido -->
    <main class="main-content-home">
        <?php 
            require 'secciones/carruselPrincipal.php'; 
            require 'secciones/misJuegos.php'; 
            require 'secciones/bloqueCarruseles.php'; 
        ?>
    </main>

    <!-- Footer dentro del body -->
    <footer>    
        <?php
            require 'secciones/footer.php';
        ?>
    </footer>

    <script src="js/loading.js"></script>
    <script src="js/barras.js"></script>
    <script src="js/bloqueCarruseles.js"></script>
    <script src="js/carruselPrincipal.js"></script>
</body>

</html>
