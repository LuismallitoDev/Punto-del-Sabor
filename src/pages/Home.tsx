import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react'; 
import { Link } from 'react-scroll';

// Componentes UI
import { HeroCarousel } from '../components/ui/HeroCarousel';
import { CategoryNav } from '../components/features/menu/CategoryNav';
import { FoodPlate } from '../components/features/menu/FoodPlate';

// Conexión a Base de Datos y Tipos
import { supabase } from '../lib/supabase';
import { Product } from '../types';

// Interfaz para mapear los datos que vienen de la BD (snake_case)
interface SupabaseProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    is_popular: boolean;
    ingredients: string[];
    calories: number;
    active: boolean;
}

export function Home() {
    // Estado para guardar los productos (inicia vacío)
    const [products, setProducts] = useState<Product[]>([]);

    // Estado de CARGA (inicia verdadero para mostrar el spinner)
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState('all');

    // Efecto para descargar los datos al entrar
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Pedimos solo los productos activos
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('active', true);

                if (error) throw error;

                if (data) {
                    // Convertimos los datos de Supabase a nuestro formato
                    const formattedData: Product[] = (data as SupabaseProduct[]).map((item) => ({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        category: item.category,
                        image: item.image,
                        isPopular: item.is_popular,
                        ingredients: item.ingredients,
                        calories: item.calories
                    }));
                    setProducts(formattedData);
                }
            } catch (error) {
                console.error("Error cargando menú:", error);
            } finally {
                // Pase lo que pase, quitamos el cargando
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Lógica de filtrado
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

                    <CategoryNav
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />

                    {/* Flechas animadas (Móvil) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="flex flex-col items-center justify-center pb-10 -mt-4 md:hidden relative z-10"
                    >
                        <p className="text-gold/50 text-[10px] uppercase tracking-[0.2em] mb-2 animate-pulse">
                            Desliza hacia abajo
                        </p>
                        {[0, 1].map((index) => (
                            <motion.div
                                key={index}
                                animate={{ y: [0, 10, 20], opacity: [0, 1, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.3, ease: "easeInOut" }}
                                className="-mt-4 first:mt-0"
                            >
                                <ChevronDown size={32} className="text-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-12 relative overflow-hidden min-h-[500px]" id='menu'>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/30 via-[#050505] to-[#050505] -z-10" />

                <div className="container mx-auto px-4">

                    {/* AQUÍ ESTÁ EL IS LOADING QUE QUERÍAS */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="w-12 h-12 text-gold animate-spin" />
                            <p className="text-gold/70 text-sm tracking-widest uppercase animate-pulse">Cargando sabores...</p>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 md:gap-y-20"
                            >
                                <AnimatePresence mode='popLayout'>
                                    {filteredProducts.map((product) => (
                                        <FoodPlate
                                            key={product.id}
                                            product={product}
                                            delay={0}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {!loading && filteredProducts.length === 0 && (
                                <div className="text-center text-gray-500 py-20">
                                    No hay productos disponibles en esta categoría.
                                </div>
                            )}
                        </>
                    )}

                    <div className="mt-24 text-center">
                        <Link to='menu'>
                            <motion.button
                                onClick={() => setSelectedCategory('all')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 border border-gold/50 text-gold hover:bg-gold hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-semibold"
                            >
                                Ver Menú Completo
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}