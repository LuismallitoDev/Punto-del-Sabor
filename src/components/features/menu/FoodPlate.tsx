import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Product, ProductModal } from '../../ui/ProductModal';
// 1. IMPORTAR EL NUEVO MODAL DE DETALLES
import { ProductDetailsModal } from '../../ui/ProductDetailsModal';

interface FoodPlateProps {
    product: Product;
    delay?: number;
}

export function FoodPlate({ product, delay = 0 }: FoodPlateProps) {
    // 2. DOS ESTADOS DIFERENTES
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    // Acción: Clic en la tarjeta -> Abre INFO
    const handleOpenInfo = () => {
        setIsInfoModalOpen(true);
    };

    // Acción: Clic en botón dorado -> Abre COMPRA
    const handleOpenBuy = (e: React.MouseEvent) => {
        e.stopPropagation(); // <--- ¡ESTO ES VITAL! Evita que se abra el de info también
        setIsBuyModalOpen(true);
    };

    const { name, description, price, image } = product;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col items-center group relative will-change-transform"
            >
                {/* Contenedor Principal con CLICK DE INFO */}
                <div
                    className="relative w-full max-w-[280px] aspect-square mb-6 cursor-pointer" // cursor-pointer is back!
                    onClick={handleOpenInfo}
                >

                    {/* El Plato Rotatorio */}
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full rounded-full bg-white shadow-plate overflow-hidden relative border-4 border-gray-100 flex items-center justify-center p-2"
                        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                    >
                        <div className="absolute inset-2 rounded-full border border-gray-200/50 pointer-events-none z-20" />
                        <div className="w-full h-full rounded-full overflow-hidden relative z-10 bg-gray-100">
                            <img src={image} alt={name} className="w-full h-full object-cover transform scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent mix-blend-overlay" />
                        </div>
                    </motion.div>

                    {/* --- BOTÓN DORADO (COMPRA) --- */}
                    <motion.button
                        onClick={handleOpenBuy} // Llama a la función con stopPropagation
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-0 right-4 w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg z-30 text-black cursor-pointer md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-y-2 md:translate-y-4 md:group-hover:translate-y-0"
                    >
                        <Plus size={24} strokeWidth={3} />
                    </motion.button>

                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/60 blur-xl -z-10 rounded-[100%] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-40" />
                </div>

                {/* Info Texto (También abre INFO) */}
                <div className="text-center space-y-2 px-4 cursor-pointer" onClick={handleOpenInfo}>
                    <h3 className="text-2xl font-serif text-gold tracking-wide leading-tight group-hover:text-white transition-colors">{name}</h3>
                    <div className="w-12 h-[1px] bg-gold/30 mx-auto my-2 transition-all duration-300 group-hover:w-20 group-hover:bg-gold" />
                    <p className="text-gray-400 text-sm leading-relaxed max-w-[250px] mx-auto group-hover:text-gray-300 transition-colors line-clamp-2">
                        {description}
                    </p>
                    <p className="text-gold font-medium mt-2 font-serif text-lg">
                        ${price.toLocaleString('es-CO')}
                    </p>
                </div>
            </motion.div>

            {/* 3. RENDERIZAR AMBOS MODALES */}

            {/* Modal de Compra (Cantidad) */}
            <ProductModal
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                product={product}
            />

            {/* Modal de Información (Detalles) */}
            <ProductDetailsModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                product={product}
            />
        </>
    );
}