"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Mario Bros",
      description: "El juego de mario bros cuenta con muchas codsas entre otras cosas y espern dufdívbdfuvhfvbdef",
      image: "/mario-bros-game-with-mario--peach--luigi-and-other.jpg",
      buttonText: "Jugar",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3d5a80] to-[#4a6fa5] p-4">
      <div className="relative w-full max-w-7xl">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#2c4563]/80 hover:bg-[#2c4563] text-white p-6 rounded-2xl transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-12 h-12" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#2c4563]/80 hover:bg-[#2c4563] text-white p-6 rounded-2xl transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-12 h-12" />
        </button>

        {/* Carousel Content */}
        <div className="mx-16 bg-[#4a6fa5]/60 backdrop-blur-sm overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-center">
            {/* Image Section */}
            <div className="w-full md:w-1/2 p-4">
              <img
                src={slides[currentSlide].image || "/placeholder.svg"}
                alt={slides[currentSlide].title}
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-sans">{slides[currentSlide].title}</h1>

              <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
                {slides[currentSlide].description}
              </p>

              <div>
                <Button
                  size="lg"
                  className="bg-[#e63980] hover:bg-[#d12e6f] text-white text-xl px-12 py-6 rounded-2xl font-semibold shadow-lg transition-colors"
                >
                  {slides[currentSlide].buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
