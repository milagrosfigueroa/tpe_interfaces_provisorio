<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameHub</title>
    <link rel="stylesheet" href="../css/barras.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Micro+5&display=swap" rel="stylesheet">
</head>
<body>
    <section id="seccion-header">
        <header>
            <div class="logo">
            <img src="../images/iconos_barra_header/icono_GameHub.png" alt="GameHub">
            <h1>GameHub</h1>
            </div>

            <!-- Buscador -->
            <div class="buscador-wrapper">
            <div class="buscador">
                <input type="text" placeholder="¿A qué jugamos hoy?">
                <button type="submit" class="boton-lupa">
                <img src="../images/iconos_barra_header/lupa.png">
                </button>
            </div>
            </div>

            <div class="acciones">
            <!-- Carrito -->
            <button class="icon-btn">
                <img src="../images/iconos_barra_header/carrito-de-compras.png">
            </button>

            <!-- Perfil -->
            <div class="menu-container">
                <button class="icon-btn toggle-menu" data-target="menu-perfil">
                <img src="../images/iconos_barra_header/usuario.png">
                </button>
                <div id="menu-perfil" class="menu">
                <img src="../images/iconos_barra_header/avatar.png" alt="avatar" class="avatar">
                <h3>NICKNAME</h3>
                <p>Configuraciones de la cuenta</p>
                <ul>
                    <li class="active">Editar Nickname</li>
                    <li class="active">Editar Avatar</li>
                    <li class="active">Correo electrónico</li>
                    <li class="active">Contraseña</li>
                    <li class="active">Idioma</li>
                </ul>
            </div>
        </div>

            <!-- Hamburguesa -->
            <div class="hamb-wrapper">
                <div class="menu-container">
                <button class="icon-btn toggle-menu" data-target="menu-redes"><img src="../images/iconos_barra_header/menu.png" alt="menu-hamb" class="hamb"></button>
                <div id="menu-redes" class="menu">
                    <ul>
                        <li><a href="html/logIn.html">Log Out</a><img src="images/iconos_menu_hamb/log-out.png"></li>
                        <li><a href="#">Facebook</a><img src="images/iconos_menu_hamb/facebook.png"></li>
                        <li><a href="#">Instagram</a><img src="images/iconos_menu_hamb/instagram.png"></li>
                        <li><a href="#">Youtube</a><img src="images/iconos_menu_hamb/youtube.png"></li>
                        <li><a href="#">Twitter</a><img src="images/iconos_menu_hamb/twitter.png"></li>
                    </ul>
                </div>
                </div>
            </div>
            </div>
        </header>
    </section>
    <script type="text/javascript" src="../js/barras.js"></script>
</body>
</html>