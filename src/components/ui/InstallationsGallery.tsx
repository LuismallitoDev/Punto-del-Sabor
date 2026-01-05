import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { useCarousel } from '../../utils/useCarousel'; 

import Foto1 from '../../assets/negocio/Negocio_1.jpeg';
import Foto2 from '../../assets/negocio/Negocio_2.jpeg';
import Foto3 from '../../assets/negocio/Negocio_3.jpeg';
import Foto4 from '../../assets/negocio/Negocio_4.jpeg';
import Foto5 from '../../assets/negocio/Negocio_5.jpeg';
import Foto6 from '../../assets/negocio/Negocio_6.jpeg';
import Foto7 from '../../assets/negocio/Negocio_7.jpeg';

const images = [Foto1, Foto2, Foto3, Foto4, Foto5, Foto6, Foto7];

interface InstallationsGalleryProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InstallationsGallery({ isOpen, onClose }: InstallationsGalleryProps) {
    // Usamos el hook (sin intervalo, solo manual)
    const { currentIndex, nextSlide, prevSlide } = useCarousel({ length: images.length });

    const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

    // Cerrar con teclado y navegar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, nextSlide, prevSlide]);

    // Resetear zoom al cambiar
    useEffect(() => {
        if (transformComponentRef.current) {
            transformComponentRef.current.resetTransform();
        }
    }, [currentIndex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md overflow-hidden"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300 z-[200] p-2 bg-black/20 rounded-full">
                        <X size={32} />
                    </button>

                    <button onClick={prevSlide} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold transition-colors z-[200] p-4 hover:scale-110 duration-300 bg-black/10 rounded-full">
                        <ChevronLeft size={40} />
                    </button>

                    <button onClick={nextSlide} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-gold transition-colors z-[200] p-4 hover:scale-110 duration-300 bg-black/10 rounded-full">
                        <ChevronRight size={40} />
                    </button>

                    <div className="w-full h-full flex items-center justify-center relative">
                        <TransformWrapper
                            initialScale={1} minScale={1} maxScale={4} centerOnInit={true}
                            ref={transformComponentRef} wheel={{ step: 0.2 }}
                        >
                            {() => (
                                <TransformComponent
                                    wrapperStyle={{ width: "100%", height: "100%" }}
                                    contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                                >
                                    <motion.img
                                        key={currentIndex}
                                        src={images[currentIndex]}
                                        alt={`Instalación ${currentIndex + 1}`}
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                                        className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                                        style={{ cursor: 'grab' }}
                                    />
                                </TransformComponent>
                            )}
                        </TransformWrapper>

                        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/30 text-xs uppercase tracking-widest pointer-events-none z-[160]">
                            <ZoomIn size={14} />
                            <span>Pinch o Doble Click para Zoom</span>
                        </div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 font-serif tracking-widest text-sm z-[200] bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}