// 1. Configuración de la API y selectores
const API_URL = "https://vj.interfaces.jima.com.ar/api/v2"
const carouselContainer = document.querySelector(".carousel-container")
const loadingScreen = document.getElementById("loading-screen")

// Variables globales para el carrusel
let currentSlide = 0
let totalSlides = 0

// Función para truncar texto
function truncateText(text, maxLength) {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + "..."
  }
  return text
}

// Función para inicializar la lógica del carrusel
function initializeCarouselLogic(count) {
  totalSlides = count
  currentSlide = 0
}

// Función para mostrar un slide específico
function showSlide(index) {
  const slides = document.querySelectorAll(".carousel-content")
  if (index >= totalSlides) {
    currentSlide = 0
  } else if (index < 0) {
    currentSlide = totalSlides - 1
  } else {
    currentSlide = index
  }

  slides.forEach((slide, i) => {
    slide.classList.remove("active", "slide-out-left", "slide-out-right")
    if (i === currentSlide) {
      slide.classList.add("active")
    }
  })
}

// Función para ir al siguiente slide
function nextSlide() {
  showSlide(currentSlide + 1)
}

// Función para ir al slide anterior
function previousSlide() {
  showSlide(currentSlide - 1)
}

// Función principal para cargar datos del carrusel
async function loadCarouselData() {
  if (!carouselContainer) {
    console.error("El elemento .carousel-container no fue encontrado.")
    return
  }

  try {
    console.log("Iniciando carga de datos de la API V2...")

    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`Error HTTP al cargar la API: ${response.status}`)
    }

    const games = await response.json()

    carouselContainer.innerHTML = ""

    games.forEach((game, index) => {
      const isActive = index === 0 ? "active" : ""
      const truncatedDescription = truncateText(game.description, 180)

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
            `
      carouselContainer.insertAdjacentHTML("beforeend", slideHtml)
    })

    console.log(`Carga exitosa. Se agregaron ${games.length} slides.`)

    initializeCarouselLogic(games.length)
  } catch (error) {
    console.error("Error al cargar los datos del carrusel:", error)
    carouselContainer.innerHTML =
      '<p style="color: white; text-align: center;">Error al cargar los juegos destacados.</p>'
  }
}

// Iniciar la carga cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", loadCarouselData)
