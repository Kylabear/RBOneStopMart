import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const PromotionalCarousel = ({ slides = [], autoPlay = true, interval = 5000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || slides.length <= 1) return;

        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
    }, [currentSlide, autoPlay, interval, slides.length]);

    if (!slides || slides.length === 0) {
        return (
            <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <div className="text-center text-black">
                    <h2 className="text-4xl font-bold mb-4">Welcome to R&B One Stop Mart</h2>
                    <p className="text-xl mb-8">Your one-stop destination for all your needs</p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Shop Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Full-Width Background Carousel */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                        }`}
                    >
                        {/* Full-Width Background Image */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />
                        
                        {/* Semi-Transparent Dark Overlay with Smooth Transitions */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-1000" />
                        
                        {/* Centered Top Logo */}
                        {slide.logo && (
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
                                <img 
                                    src={slide.logo} 
                                    alt="R&B One Stop Mart Logo" 
                                    className="h-16 sm:h-20 md:h-24 lg:h-32 w-auto drop-shadow-lg"
                                />
                            </div>
                        )}

                        {/* Background Container from Logo to Shop Now */}
                        <div className="absolute inset-x-0 top-0 bottom-0 z-5">
                            <div className="w-full h-full bg-black bg-opacity-30"></div>
                        </div>

                        {/* Centered White Text Block */}
                        <div className="relative z-10 h-full flex items-center justify-center">
                            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center">
                                    {/* Bold Headline */}
                                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black mb-6 leading-tight tracking-tight">
                                        {slide.title}
                                    </h1>
                                    
                                    {/* Short Descriptive Paragraph */}
                                    <p className="text-xl md:text-2xl lg:text-3xl text-black mb-8 max-w-4xl mx-auto leading-relaxed font-light">
                                        {slide.subtitle}
                                    </p>
                                    
                                    {/* Offer/Highlight Text */}
                                    {slide.offer && (
                                        <p className="text-lg md:text-xl text-yellow-300 font-semibold mb-12 tracking-wide">
                                            {slide.offer}
                                        </p>
                                    )}
                                    
                                    {/* Call-to-Action Button */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={slide.onClick}
                                            className="group inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-6 bg-white text-gray-900 font-bold text-lg sm:text-xl md:text-xl rounded-2xl hover:bg-gray-100 transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-3xl"
                                        >
                                            {slide.buttonText || 'Shop Now'}
                                            <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-black p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-black p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentSlide 
                                    ? 'bg-white scale-125' 
                                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PromotionalCarousel;
