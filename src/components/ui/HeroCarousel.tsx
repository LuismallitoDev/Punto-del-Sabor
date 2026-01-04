import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-scroll';

// --- IMPORTA TUS 3 IMÁGENES AQUÍ ---
// Asegúrate de que la ruta y los nombres coincidan con los que guardaste en src/assets/hero/
import HeroImage1 from '../../assets/negocio/Negocio_7.jpeg';
import HeroImage2 from '../../assets/negocio/Negocio_1.jpeg';
import HeroImage3 from '../../assets/negocio/Negocio_3.jpeg';

// Datos de los slides usando las imágenes importadas
const slides = [
    {
        id: 1,
        image: HeroImage1, // Usamos la variable importada
        title: "Sabor Costeño Auténtico",
        subtitle: "La tradición en cada bocado"
    },
    {
        id: 2,
        image: HeroImage2,
        title: "Fritos Hechos al Instante",
        subtitle: "Crocantes, frescos y deliciosos"
    },
    {
        id: 3,
        image: HeroImage3,
        title: "Papas y Patacones Rellenos",
        subtitle: "El tamaño perfecto para tu hambre"
    }
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    // Cambio automático cada 5 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            <AnimatePresence mode='wait'>
                {slides.map((slide, index) => (
                    index === current && (
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0"
                        >
                            {/* IMAGEN DE FONDO */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[10000ms] ease-linear"
                                style={{ backgroundImage: `url(${slide.image})` }} // Usamos la imagen aquí
                            />

                            {/* OVERLAY OSCURO (Para que se lea el texto) */}
                            <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

                            {/* CONTENIDO DE TEXTO */}
                            <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
                                <motion.span
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="text-gold text-sm md:text-base uppercase tracking-[0.3em] font-semibold mb-4"
                                >
                                    Bienvenido a El Punto del Sabor
                                </motion.span>

                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.8 }}
                                    className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 font-bold tracking-wide"
                                >
                                    {slide.title}
                                </motion.h1>

                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.8 }}
                                    className="text-gray-200 text-lg md:text-xl font-light max-w-xl mb-10"
                                >
                                    {slide.subtitle}
                                </motion.p>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.1, duration: 0.8 }}
                                >
                                    <Link
                                        to="menu"
                                        smooth={true}
                                        duration={800}
                                        offset={-100}
                                        className="px-10 py-4 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-all duration-300 cursor-pointer"
                                    >
                                        Ver Menú
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            {/* Botones de Navegación */}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-gold transition-colors z-20 p-2 md:p-4">
                <ChevronLeft size={32} />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-gold transition-colors z-20 p-2 md:p-4">
                <ChevronRight size={32} />
            </button>

            {/* Indicadores (Puntitos abajo) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === current ? 'w-8 bg-gold' : 'w-2 bg-white/50 hover:bg-white'}`}
                    />
                ))}
            </div>
        </section>
    );
}