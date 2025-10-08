const logoutLink = document.getElementById('logout-link');

logoutLink.addEventListener('click', function(e) {

e.preventDefault(); 

window.location.href = 'login.php';

});

document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('card-peg-solitarie');
    
    if (card) {
        card.addEventListener('click', function() {
            window.location.href = 'juegoPeg.php'; 
        });        
        card.style.cursor = 'pointer'; 
    }
});
