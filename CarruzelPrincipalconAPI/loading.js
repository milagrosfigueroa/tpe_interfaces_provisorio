// Script para controlar el loading screen de 5 segundos con porcentaje
document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loading-screen');
  const percentageElement = document.querySelector('.loading-percentage');
  
  let percentage = 0;
  const duration = 5000; // 5 segundos
  const interval = 50; // Actualizar cada 50ms
  const increment = (100 / (duration / interval));
  
  // Actualizar el porcentaje progresivamente
  const percentageInterval = setInterval(() => {
    percentage += increment;
    
    if (percentage >= 100) {
      percentage = 100;
      clearInterval(percentageInterval);
      
      // Ocultar el loading screen después de llegar a 100%
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 200);
    }
    
    percentageElement.textContent = Math.floor(percentage) + '%';
  }, interval);
});