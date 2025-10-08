const logoutLink = document.getElementById('logout-link');

logoutLink.addEventListener('click', function(e) {
    
e.preventDefault(); 

window.location.href = 'logIn.html';

});

document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('card-peg-solitarie');
    
    if (card) {
        card.addEventListener('click', function() {
            window.location.href = 'juegoPeg.html'; 
        });        
        card.style.cursor = 'pointer'; 
    }
});

const inicioSesion = document.getElementById('inicioSesion');
inicioSesion.addEventListener('submit', function(e) {
  e.preventDefault(); 
  window.location.href = 'home.html';
});
