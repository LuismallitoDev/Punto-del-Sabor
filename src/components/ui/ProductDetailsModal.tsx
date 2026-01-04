import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag } from 'lucide-react';
import { Product } from './ProductModal'; 

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
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
                        className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
                    >
                        {/* Botón Cerrar */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-gold hover:text-black transition-all"
                        >
                            <X size={20} />
                        </button>

                        {/* Imagen Grande */}
                        <div className="w-full h-64 md:h-80 relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                        </div>

                        {/* Contenido */}
                        <div className="p-8 -mt-12 relative z-10">
                            {/* Etiqueta Categoría (si la tienes en tus datos, si no, puedes quitar esto) */}
                            {product.category && (
                                <div className="inline-flex items-center gap-1 bg-gold/20 border border-gold/30 rounded-full px-3 py-1 mb-4">
                                    <Tag size={12} className="text-gold" />
                                    <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                                        {product.category}
                                    </span>
                                </div>
                            )}

                            <h2 className="text-3xl font-serif text-white mb-2">{product.name}</h2>
                            <p className="text-2xl font-bold text-gold mb-6">${product.price.toLocaleString('es-CO')}</p>

                            <div className="w-full h-[1px] bg-white/10 mb-6" />

                            <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-3">Descripción del Producto</h3>
                            <p className="text-gray-300 leading-relaxed text-lg font-light">
                                {product.description}
                            </p>

                            {/* Nota adicional decorativa */}
                            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/5 text-center">
                                <p className="text-gray-500 text-sm italic">
                                    "Preparado al instante con ingredientes frescos."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}