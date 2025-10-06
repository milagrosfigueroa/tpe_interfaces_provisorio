<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Peg Solitaire - Mi Sitio de Juegos</title>
    
    <link rel="stylesheet" href="css/barras.css">    
    <link rel="stylesheet" href="css/juego.css">     
    <link rel="stylesheet" href="css/footer.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Micro+5&display=swap" rel="stylesheet">
</head>
<body>

<?php include 'secciones/header.php'; ?> 
<?php include 'secciones/nav_bar.php'; ?>

<main class="game-page">

    <section class="game-breadcrumb-header">
        <div class="breadcrumb">
            Nuevos / <span>Peg Solitaire</span>
        </div>
        <button class="share-btn">
            <i class="fas fa-share-alt"></i>
        </button>
    </section>

    <section class="game-banner-container">
        <div class="game-banner-card">
            <img src="images/pegSolitarie.png" alt="Peg Solitaire: Fuego vs Agua" class="banner-image">
            
            <div class="banner-overlay">
                <button class="btn-primary-play" id="playButton">Jugar</button>
            </div>
            
            <div class="card-footer">
                <h2>Peg Solitaire: Fuego vs Agua</h2>
                <button class="btn-add-game" id="addToMyGamesBtn">
                    Agregar a mis juegos <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    </section>
    
    <section class="game-info-details">
        <div class="info-section how-to-play">
            <h3>Cómo jugar:</h3>
            <p>Fuego vs Agua, el tablero enfrenta a ambos elementos y el objetivo es conservar la mayor cantidad posible de fichas propias.</p> <br>
            <h4>Reglas Básicas:</h4>
            <ul>
                <li>Una ficha puede saltar en línea recta sobre otra, siempre hacia un espacio vacío.</li>
                <li>La ficha que fue saltada se retira del tablero.</li>
                <li>La partida finaliza cuando ya no quedan movimientos posibles.</li>
            </ul> <br>
            <h4>Victoria:</h4> 
            <ul>
                <li>Gana el elemento que conserve más fichas en juego.</li>
                <li>Si queda una única ficha en el centro del tablero, se considera una victoria perfecta.</li>
            </ul>
        </div>
        <div class="info-section controls">
            <h3>Controles:</h3>
            <ul>
                <li>Clic izquierdo sobre una ficha: seleccionarla.</li>
                <li>Clic izquierdo sobre un espacio vacío válido: mover o saltar la ficha.</li>
            </ul>
            <div class="controls">
                <img src="images/mouseBtnIzq.PNG" alt="Icono de Control de Mouse" class="control-image">
                 <img src="images/seleccione.png" alt="Icono de Seleccionar" class="control-image hand-icon">
            </div>
        </div>
    </section>

  <section class="comments-section">
    <h2>Comentarios</h2>
    <div class="comment-input-area">
        <img src="images/avatar.png" alt="Avatar" class="user-avatar">
        <textarea placeholder="Agrega un comentario..." class="comment-textarea"></textarea>
    </div>
    <button class="btn-comment-submit">Comentar</button>
    
    <div class="comment-item">
        <img src="images/avatar.png" alt="Avatar" class="user-avatar">
        
        <div class="comment-content">
            
            <div class="comment-header">
                <span class="comment-username">Noobslayer99</span>
                <span class="comment-date">12/01/2023</span>
            </div>
            
            <p class="comment-text">Es un juego muy divertido, las animaciones son muy buenas!</p>
            
            <div class="comment-actions">
                <i class="fas fa-thumbs-up"></i>
                <i class="fas fa-thumbs-down"></i>
                <i class="fas fa-comment"></i>
            </div>
        </div>
    </div>

    <div class="comment-item">
        <img src="images/avatar.png" alt="Avatar" class="user-avatar">
        
        <div class="comment-content">
            
            <div class="comment-header">
                <span class="comment-username">Noobslayer99</span>
                <span class="comment-date">12/01/2023</span>
            </div>
            
            <p class="comment-text">Es un juego muy divertido, las animaciones son muy buenas!</p>
            
            <div class="comment-actions">
                <i class="fas fa-thumbs-up"></i>
                <i class="fas fa-thumbs-down"></i>
                <i class="fas fa-comment"></i>
            </div>
        </div>
    </div>

    <div class="comment-item">
        <img src="images/avatar.png" alt="Avatar" class="user-avatar">
        
        <div class="comment-content">
            
            <div class="comment-header">
                <span class="comment-username">Noobslayer99</span>
                <span class="comment-date">12/01/2023</span>
            </div>
            
            <p class="comment-text">Es un juego muy divertido, las animaciones son muy buenas!</p>
            
            <div class="comment-actions">
                <i class="fas fa-thumbs-up"></i>
                <i class="fas fa-thumbs-down"></i>
                <i class="fas fa-comment"></i>
            </div>
        </div>
    </div>

    <div class="comment-item">
        <img src="images/avatar.png" alt="Avatar" class="user-avatar">
        
        <div class="comment-content">
            
            <div class="comment-header">
                <span class="comment-username">Noobslayer99</span>
                <span class="comment-date">12/01/2023</span>
            </div>
            
            <p class="comment-text">Es un juego muy divertido, las animaciones son muy buenas!</p>
            
            <div class="comment-actions">
                <i class="fas fa-thumbs-up"></i>
                <i class="fas fa-thumbs-down"></i>
                <i class="fas fa-comment"></i>
            </div>
        </div>
    </div>
    
    </section>

    <section class="related-games-section">
        <h2>También te puede interesar...</h2>
        <div class="games-grid">
            <div class="game-card">
                <img src="images/clasicos/busca_minas.jpg" alt="Buscaminas" class="game-image">
                <div class="game-title-overlay">
                    Buscaminas
                </div>
            </div>
            <div class="game-card">
                <img src="assets/img/ludo-online.jpg" alt="Ludo Online" class="game-image">
                <div class="game-title-overlay">
                    Ludo Online
                </div>
            </div>
            <div class="game-card">
                <img src="assets/img/ludo-online.jpg" alt="Ludo Online" class="game-image">
                <div class="game-title-overlay">
                    Ludo Online
                </div>
            </div>
            <div class="game-card">
                <img src="assets/img/ludo-online.jpg" alt="Ludo Online" class="game-image">
                <div class="game-title-overlay">
                    Ludo Online
                </div>
            </div>
        </div>
         <div class="games-grid">
            <div class="game-card">
                <img src="assets/img/ludo-online.jpg" alt="Ludo Online" class="game-image">
                <div class="game-title-overlay">
                    Ludo Online
                </div>
            </div>
            <div class="game-card">
                <img src="assets/img/ludo-online.jpg" alt="Ludo Online" class="game-image">
                <div class="game-title-overlay">
                    Ludo Online
                </div>
            </div>
            <div class="game-card">
                <img src="assets/img/ludo-online.jpg" alt="Ludo Online" class="game-image">
                <div class="game-title-overlay">
                    Ludo Online
                </div>
            </div>
            <div class="game-card">
                <img src="assets/img/ludo-online.jpg" alt="Ludo Online" class="game-image">
                <div class="game-title-overlay">
                    Ludo Online
                </div>
        </div>
    </section>

</main>

<?php include 'secciones/footer.php'; ?>

<script src="js/agregarJuego.js"></script>

</body>
</html>
