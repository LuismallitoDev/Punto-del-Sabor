import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

// Contextos y Tipos
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../types';

// Hooks y Utilidades Refactorizadas
import { useBlockScroll } from '../../hooks/useBlockScroll';
import { formatCurrency } from '../../utils/format';
import { createWhatsAppLink, getWholesaleMessage } from '../../utils/whatsapp';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { addToast } = useToast();

    // Bloquear scroll al abrir
    useBlockScroll(isOpen);

    // Resetear cantidad al abrir
    useEffect(() => {
        if (isOpen) setQuantity(1);
    }, [isOpen]);

    if (!product) return null;

    const handleIncrement = () => {
        if (quantity < 30) setQuantity(prev => prev + 1);
        else addToast("Para pedidos mayores a 30 unidades, contáctanos por WhatsApp.", "info");
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
        addToast(`Añadiste ${quantity}x ${product.name} al pedido`, "success");
        onClose();
    };

    // Lógica refactorizada de WhatsApp
    const handleWhatsAppClick = () => {
        const message = getWholesaleMessage(product.name);
        const link = createWhatsAppLink(message);
        window.open(link, '_blank');
    }

    const totalPrice = product.price * quantity;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#111] border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]"
                    >
                        {/* COLUMNA IZQUIERDA: IMAGEN */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-white/5">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 md:hidden bg-black/50 p-2 rounded-full text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* COLUMNA DERECHA: DETALLES Y CONTROLES */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col relative overflow-y-auto custom-scrollbar">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 hidden md:block text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Info del Producto */}
                            <div className="mb-auto">
                                <h2 className="text-2xl md:text-3xl font-serif text-gold mb-2">{product.name}</h2>
                                {/* Uso de formatCurrency */}
                                <p className="text-xl font-bold text-white mb-4">${formatCurrency(product.price)}</p>
                                <div className="w-12 h-0.5 bg-gold/30 mb-4"></div>
                                <p className="text-gray-300 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Controles de Cantidad y Botones */}
                            <div className="mt-8 space-y-6">

                                {/* Selector de Cantidad */}
                                <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
                                    <span className="text-sm uppercase tracking-widest text-gray-400 font-bold">Cantidad</span>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleDecrement}
                                            disabled={quantity <= 1}
                                            className={`p-2 rounded-full border ${quantity <= 1 ? 'border-gray-600 text-gray-600 cursor-not-allowed' : 'border-gold text-gold hover:bg-gold hover:text-black'} transition-all`}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="text-2xl font-bold text-white w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={handleIncrement}
                                            disabled={quantity >= 30}
                                            className={`p-2 rounded-full border ${quantity >= 30 ? 'border-gray-600 text-gray-600 cursor-not-allowed' : 'border-gold text-gold hover:bg-gold hover:text-black'} transition-all`}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Botón Agregar al Carrito */}
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-gold text-black font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-gold/20 active:scale-95"
                                >
                                    <ShoppingBag size={20} />
                                    {/* Uso de formatCurrency */}
                                    <span>Agregar ∙ ${formatCurrency(totalPrice)}</span>
                                </button>

                                {/* Disclaimer WhatsApp (Venta Mayorista) */}
                                {quantity >= 30 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <button onClick={handleWhatsAppClick} className="w-full flex flex-col items-center gap-2 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg hover:bg-[#25D366]/20 transition-colors group cursor-pointer text-left">
                                            <div className="flex items-center gap-2 text-[#25D366] font-bold uppercase text-xs tracking-widest">
                                                <FaWhatsapp size={16} /> Venta Mayorista
                                            </div>
                                            <p className="text-gray-300 text-sm leading-tight">
                                                ¿Necesitas más de 30 unidades? <span className="text-[#25D366] underline group-hover:text-white transition-colors">Contáctanos directamente por WhatsApp</span> para gestionar tu pedido especial.
                                            </p>
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}