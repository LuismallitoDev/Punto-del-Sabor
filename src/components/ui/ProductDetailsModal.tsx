import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, ChefHat, Wheat, Flame } from 'lucide-react';
import { useBlockScroll } from '../../hooks/useBlockScroll';
import { Product } from '../../types';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
    useBlockScroll(isOpen);

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]"
                    >
                        {/* Botón Cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-gold hover:text-black transition-all"
                        >
                            <X size={20} />
                        </button>

                        {/* Imagen Grande */}
                        <div className="w-full h-64 md:h-80 relative shrink-0">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-90" />
                        </div>

                        {/* Contenido */}
                        <div className="p-8 -mt-6 relative z-10 overflow-y-auto custom-scrollbar flex-grow">

                            {/* CABECERA CON BADGES Y PRECIO */}
                            <div className="flex justify-between items-start mb-4">

                                {/* 2. CONTENEDOR DE ETIQUETAS (Categoría + Popular) */}
                                <div className="flex flex-wrap gap-2">

                                    {/* Etiqueta Categoría */}
                                    {product.category && (
                                        <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/20 rounded-full px-3 py-1">
                                            <Tag size={12} className="text-gold" />
                                            <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                                                {product.category}
                                            </span>
                                        </div>
                                    )}

                                    {/* 3. ETIQUETA POPULAR (NUEVO) */}
                                    {product.isPopular && (
                                        <div className="inline-flex items-center gap-1.5 bg-gold text-black border border-gold rounded-full px-3 py-1 shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                                            <Flame size={12} fill="black" className="animate-pulse" />
                                            <span className="text-[10px] uppercase tracking-widest font-bold">
                                                Popular
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Precio */}
                                <div className="text-right ml-2">
                                    <p className="text-2xl font-bold text-gold">${product.price.toLocaleString('es-CO')}</p>
                                    {typeof product.calories === 'number' && (
                                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
                                            <Flame size={12} className="text-orange-500" />
                                            <span>~{product.calories} kcal</span>
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Título */}
                            <h2 className="text-3xl font-serif text-white mb-6 leading-tight">{product.name}</h2>

                            {/* Ingredientes */}
                            {product.ingredients && product.ingredients.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-3 text-gray-400">
                                        <ChefHat size={16} className="text-gold" />
                                        <span className="text-xs uppercase tracking-widest font-bold">Ingredientes Principales</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {product.ingredients.map((ing, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-medium hover:border-gold/50 hover:text-gold transition-colors cursor-default"
                                            >
                                                {ing}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="w-full h-[1px] bg-white/10 mb-6" />

                            {/* Descripción */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2 text-gray-400">
                                    <Wheat size={16} className="text-gold" />
                                    <span className="text-xs uppercase tracking-widest font-bold">Detalle</span>
                                </div>
                                <p className="text-gray-300 leading-relaxed text-lg font-light">
                                    {product.description}
                                </p>
                            </div>

                            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/5 text-center">
                                <p className="text-gray-500 text-sm italic font-serif">
                                    "Las imágenes son de carácter <strong>ilustrativo y referencial.</strong> "
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}