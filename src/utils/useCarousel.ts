import { useState, useEffect, useCallback } from 'react';

interface UseCarouselProps {
    length: number;      // Cantidad total de items
    interval?: number;   // Tiempo en ms para auto-play (0 para desactivar)
}

export const useCarousel = ({ length, interval = 0 }: UseCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, [length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
    }, [length]);

    // Lógica de Auto-play
    useEffect(() => {
        if (interval > 0) {
            const timer = setInterval(nextSlide, interval);
            return () => clearInterval(timer);
        }
    }, [interval, nextSlide]);

    return { currentIndex, setCurrentIndex, nextSlide, prevSlide };
};