<!DOCTYPE html>
<html lang="es">
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
        <a href="home.php">
          <img src="images/iconos_barra_header/icono_GameHub.png" alt="GameHub">
        </a>
        <h1>GameHub</h1>
      </div>

        <!-- Buscador -->
        <div class="buscador-wrapper">
            <div class="buscador">
                <input type="text" placeholder="¿A qué jugamos hoy?">
                <img src="images/iconos_barra_header/lupa.png" alt="Buscar" class="lupa-icono">
            </div>
        </div>

      <!-- Acciones (carrito, perfil, menú) -->
      <div class="acciones">
        <!-- Carrito -->
        <button class="icon-btn">
          <img src="images/iconos_barra_header/carrito-de-compras.png" alt="Carrito">
        </button>

        <!-- Perfil -->
        <div class="menu-container">
          <button class="icon-btn toggle-menu" data-target="menu-perfil">
            <img src="images/iconos_barra_header/usuario.png" alt="Perfil">
          </button>
          <div id="menu-perfil" class="menu">
            <img src="images/iconos_barra_header/avatar.png" alt="avatar" class="avatar">
            <h3>NICKNAME</h3>
            <p>Configuraciones de la cuenta</p>
            <ul>
              <li>Editar Nickname</li>
              <li>Editar Avatar</li>
              <li>Correo electrónico</li>
              <li>Contraseña</li>
              <li>Idioma</li>
            </ul>
          </div>
        </div>

        <!-- Menú hamburguesa -->
        <div class="hamb-wrapper">
          <div class="menu-container">
            <button class="icon-btn toggle-menu" data-target="menu-redes">
              <img src="images/iconos_barra_header/menu.png" alt="Menú">
            </button>
            <div id="menu-redes" class="menu">
              <ul>
                <li><a href="logIn.php">Log Out</a><img src="images/iconos_menu_hamb/log-out.png" alt="Salir"></li>
                <li><a href="#">Facebook</a><img src="images/iconos_menu_hamb/facebook.png" alt="Facebook"></li>
                <li><a href="#">Instagram</a><img src="images/iconos_menu_hamb/instagram.png" alt="Instagram"></li>
                <li><a href="#">Youtube</a><img src="images/iconos_menu_hamb/youtube.png" alt="Youtube"></li>
                <li><a href="#">Twitter</a><img src="images/iconos_menu_hamb/twitter.png" alt="Twitter"></li>
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
