document.addEventListener('DOMContentLoaded', () => {
    const addToMyGamesBtn = document.getElementById('addToMyGamesBtn');

    if (addToMyGamesBtn) {
        // Inicializar con el icono correcto (solo por si el servidor ya lo marcó como agregado)
        // const isAddedOnLoad = addToMyGamesBtn.classList.contains('added');
        // if (isAddedOnLoad) {
        //     addToMyGamesBtn.querySelector('i').className = 'fas fa-check';
        // }

        function toggleAddedState() {
            const isAdded = addToMyGamesBtn.classList.contains('added');
            const iconElement = addToMyGamesBtn.querySelector('i'); // Busca el icono dentro del botón

            if (isAdded) {
                // Estado "Agregado" -> "Agregar a mis juegos" (REMOVER)
                addToMyGamesBtn.classList.remove('added');
                
                addToMyGamesBtn.innerHTML = 'Agregar a mis juegos ';
                // Crear y añadir el nuevo icono de corazón
                const newIcon = document.createElement('i');
                newIcon.className = 'fas fa-heart';
                addToMyGamesBtn.appendChild(newIcon);

            } else {
                // Estado "Agregar a mis juegos" -> "Agregado" (AÑADIR)
                addToMyGamesBtn.classList.add('added');
                
                addToMyGamesBtn.innerHTML = 'Agregado ';
                // Crear y añadir el nuevo icono de check
                const newIcon = document.createElement('i');
                newIcon.className = 'fas fa-check';
                addToMyGamesBtn.appendChild(newIcon);
            }
            
        
        }

        addToMyGamesBtn.addEventListener('click', toggleAddedState);
    }
});


