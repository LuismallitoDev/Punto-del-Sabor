import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ChevronRight, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'; // Importamos ChevronUp
import { useCart } from '../../context/CartContext';
import { sendOrderToWhatsapp } from '../../utils/whatsapp';
import { useToast } from '../../context/ToastContext';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    const { cart, removeFromCart, totalPrice } = useCart();
    const { addToast } = useToast(); // <--- Usar hook
    // Estados del formulario
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    // --- LÓGICA DEL DROPDOWN PERSONALIZADO ---
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [isPaymentOpen, setIsPaymentOpen] = useState(false); // Para saber si el menú está abierto
    const paymentOptions = ["Efectivo", "Nequi", "DaviPlata", "Bancolombia"];
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar el dropdown si clicamos fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsPaymentOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // ------------------------------------------

    // Bloquear scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    const handleConfirm = () => {
        if (!address.trim()) {
            // REEMPLAZO DEL ALERT
            addToast("Por favor ingresa tu dirección de entrega", "error");

            // Opcional: Enfocar el input
            document.querySelector('input')?.focus();
            return;
        }

        sendOrderToWhatsapp(cart, { address, paymentMethod, notes });

        // Mensaje de éxito antes de irse (aunque WhatsApp abre en otra pestaña)
        addToast("¡Pedido procesado! Redirigiendo a WhatsApp...", "success");
        onClose();
    };

    const sidebarVariants = {
        hidden: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
        visible: { x: "0%", transition: { type: "spring", stiffness: 300, damping: 30 } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ESTILOS CSS INYECTADOS PARA EL SCROLLBAR */}
                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: rgba(255, 255, 255, 0.05);
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgba(197, 157, 95, 0.4); /* Color Oro sutil */
                            border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: rgba(197, 157, 95, 0.8); /* Oro más fuerte al hover */
                        }
                    `}</style>

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        variants={sidebarVariants}
                        initial="hidden" animate="visible" exit="hidden"
                        className="fixed top-0 right-0 h-[100dvh] w-full md:w-[450px] bg-[#0a0a0a] z-[110] border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* 1. CABECERA */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-gold" />
                                <h2 className="text-xl font-serif text-white tracking-wide">Tu Pedido</h2>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* 2. LISTA DE PRODUCTOS (Con Scrollbar Custom) */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="text-center text-gray-500 py-10">
                                    <p>Tu bolsa está vacía.</p>
                                    <button onClick={onClose} className="mt-4 text-gold hover:underline text-sm">
                                        Ir al menú
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                            <div>
                                                <p className="text-white font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {item.quantity} x ${item.price.toLocaleString('es-CO')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gold font-bold">
                                                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                                                </span>
                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                                        <span className="text-gray-400 uppercase tracking-widest text-xs">Total Estimado</span>
                                        <span className="text-2xl font-serif text-gold font-bold">
                                            ${totalPrice.toLocaleString('es-CO')}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* 3. FORMULARIO */}
                            {cart.length > 0 && (
                                <div className="space-y-6 mt-8 border-t border-white/10 pt-8">
                                    <h3 className="text-gold text-sm uppercase tracking-widest font-bold mb-4">
                                        Datos de Entrega
                                    </h3>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 uppercase">Dirección completa</label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Ej: Calle 12 # 34-56, Barrio..."
                                            className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold focus:outline-none transition-colors placeholder:text-gray-600"
                                        />
                                    </div>

                                    {/* --- DROPDOWN PERSONALIZADO --- */}
                                    <div className="space-y-2" ref={dropdownRef}>
                                        <label className="text-xs text-gray-400 uppercase">Método de Pago</label>
                                        <div className="relative">
                                            {/* Botón Trigger */}
                                            <button
                                                onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                                                className={`w-full bg-white/5 border rounded p-3 text-white flex justify-between items-center transition-all duration-300
                                                    ${isPaymentOpen ? 'border-gold bg-white/10' : 'border-white/10 hover:border-gold/50'}
                                                `}
                                            >
                                                <span>{paymentMethod}</span>
                                                {/* Flechas dinámicas */}
                                                {isPaymentOpen ? (
                                                    <ChevronUp size={18} className="text-gold" />
                                                ) : (
                                                    <ChevronDown size={18} className="text-gray-400" />
                                                )}
                                            </button>

                                            {/* Lista Desplegable */}
                                            <AnimatePresence>
                                                {isPaymentOpen && (
                                                    <motion.ul
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded shadow-xl z-50 overflow-hidden"
                                                    >
                                                        {paymentOptions.map((option) => (
                                                            <li key={option}>
                                                                <button
                                                                    onClick={() => {
                                                                        setPaymentMethod(option);
                                                                        setIsPaymentOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gold hover:text-black transition-colors
                                                                        ${paymentMethod === option ? 'text-gold bg-white/5' : 'text-gray-300'}
                                                                    `}
                                                                >
                                                                    {option}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    {/* ----------------------------- */}

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 uppercase">Observaciones</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Ej: Sin salsas..."
                                            rows={2}
                                            className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold focus:outline-none resize-none placeholder:text-gray-600 custom-scrollbar"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. FOOTER */}
                        <div className="p-6 border-t border-white/10 bg-black/40">
                            {cart.length > 0 ? (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleConfirm}
                                        className="w-full bg-gold text-black font-bold py-4 uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        Confirmar Pedido <ChevronRight size={18} />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full border border-white/20 text-white font-medium py-3 uppercase tracking-widest text-xs hover:border-gold hover:text-gold transition-colors"
                                    >
                                        Seguir Reservando
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="w-full bg-white/10 text-white font-medium py-3 uppercase tracking-widest hover:bg-gold hover:text-black transition-colors"
                                >
                                    Volver al menú
                                </button>
                            )}
                            <p className="text-[10px] text-gray-500 text-center mt-4 leading-relaxed">
                                * Al hacer clic en "Confirmar", serás redirigido a WhatsApp.
                                Todos los pedidos deben ser validados por nuestro equipo.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}