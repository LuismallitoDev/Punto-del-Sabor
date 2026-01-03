import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Importar AnimatePresence para animaciones suaves al filtrar
import { HeroCarousel } from '../components/ui/HeroCarousel';
import { CategoryNav } from '../components/features/menu/CategoryNav';
import { FoodPlate } from '../components/features/menu/FoodPlate';
import { products } from '../data/products';

export function Home() {
    
    const [selectedCategory, setSelectedCategory] = useState('all');

    // 2. Lógica de filtrado
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <>
            <HeroCarousel />

            <section className="py-20 relative" id="menu-section">
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-8">
                        <span className="text-gold text-xs uppercase tracking-[0.2em] mb-3 block opacity-80">Explora</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Nuestro Menú</h2>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto opacity-50" />
                    </div>

                    {/* 3. Pasamos las props al CategoryNav */}
                    <CategoryNav
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>
            </section>

            <section className="py-12 relative overflow-hidden min-h-[500px]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/30 via-[#050505] to-[#050505] -z-10" />

                <div className="container mx-auto px-4">

                    {/* GRID DE PRODUCTOS FILTRADOS */}
                    <motion.div
                        layout // "layout" hace que los elementos se muevan suavemente al filtrar
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 md:gap-y-20"
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product) => (
                                <FoodPlate
                                    key={product.id}
                                    title={product.name}
                                    description={product.description}
                                    price={product.price}
                                    image={product.image}
                                    // Quitamos el delay fijo para que al filtrar no se sienta lento
                                    delay={0}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Mensaje si no hay productos (por si acaso) */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center text-gray-500 py-20">
                            No hay productos en esta categoría por el momento.
                        </div>
                    )}

                    <div className="mt-24 text-center">
                        <motion.button
                            onClick={() => setSelectedCategory('all')} // Botón ver todo resetea el filtro
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 border border-gold/50 text-gold hover:bg-gold hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-semibold"
                        >
                            Ver Menú Completo
                        </motion.button>
                    </div>
                </div>
            </section>
        </>
    );
}