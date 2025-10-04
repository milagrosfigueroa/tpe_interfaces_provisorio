// 1. Configuración de la API y selectores
const API_URL = 'https://vj.interfaces.jima.com.ar/api/v2'; 
const carouselContainer = document.querySelector('.carousel-container');
const loadingScreen = document.getElementById('loading-screen');

// ... (Tu lógica de funciones de carrusel: previousSlide, nextSlide, initializeCarouselLogic debe ir aquí) ...

async function loadCarouselData() {
    if (!carouselContainer) {
        console.error("El elemento .carousel-container no fue encontrado.");
        return; 
    }
    
    try {
        console.log("Iniciando carga de datos de la API V2...");
        
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error HTTP al cargar la API: ${response.status}`);
        }
        
        const games = await response.json();
        
        carouselContainer.innerHTML = ''; // Limpiar contenido

        games.forEach((game, index) => {
            const isActive = index === 0 ? 'active' : ''; 
            
            // Llamas a la función aquí 
            const truncatedDescription = truncateText(game.description, 180); // Límite de 180 caracteres
            
            const slideHtml = `
                <div class="carousel-content ${isActive}" tabindex="0" role="group" aria-label="Slide ${index + 1} de ${games.length}">
                    <div class="image-section">
                        <img src="${game.background_image_low_res}" alt="${game.name}" class="game-image">
                    </div>
                    <div class="text-section">
                        <h1 class="title">${game.name}</h1>
                        <p class="description">
                            ${truncatedDescription} 
                        </p>
                        <button class="play-button">Jugar</button>
                    </div>
                </div>
            `;
            carouselContainer.insertAdjacentHTML('beforeend', slideHtml);
        });

        console.log(`Carga exitosa. Se agregaron ${games.length} slides.`);

        // 4. Inicializar la lógica del carrusel (crucial)
        initializeCarouselLogic(games.length); 

    } catch (error) {
        // ... (Manejo de errores) ...
    } finally {
        // ... (Ocultar loader) ...
    }
}

document.addEventListener('DOMContentLoaded', loadCarouselData);

// ⭐️ DEFINICIÓN DE LA FUNCIÓN AUXILIAR AL FINAL ⭐️
function truncateText(text, maxLength) {
    if (text && text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

let currentSlide = 0;
let totalSlides = 0;

function initializeCarouselLogic(count) {
    totalSlides = count;
    currentSlide = 0; // Siempre empezamos por la primera slide
    // Si tienes indicadores de punto, también se actualizarían aquí.
}

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-content');
    if (index >= totalSlides) {
        currentSlide = 0; // Vuelve al inicio
    } else if (index < 0) {
        currentSlide = totalSlides - 1; // Vuelve al final
    } else {
        currentSlide = index;
    }

    // Oculta todas las slides y muestra la actual
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'slide-out-left', 'slide-out-right');
        if (i === currentSlide) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    // Si ya tienes un sistema de clases de animación más complejo, úsalo aquí.
    showSlide(currentSlide + 1); 
}

function previousSlide() {
    showSlide(currentSlide - 1);
}

