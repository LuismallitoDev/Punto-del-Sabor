import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ChevronRight, ShoppingBag, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { sendOrderToWhatsapp } from '../../utils/whatsapp';
import { useToast } from '../../context/ToastContext';
import { useBlockScroll } from '../../utils/useBlockScroll';
import { formatCurrency } from '../../utils/format';
import { supabase } from '../../lib/supabase'; // <--- 1. Importante: Conexión a BD

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    const { cart, removeFromCart, totalPrice } = useCart(); 
    const { addToast } = useToast();

    // Estados del formulario
    const [name, setName] = useState('');      
    const [phone, setPhone] = useState('');     
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Lógica del Dropdown
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const paymentOptions = ["Efectivo", "Nequi", "DaviPlata", "Bancolombia"];
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsPaymentOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useBlockScroll(isOpen);

    const handleConfirm = async () => {
        // 1. Validaciones
        if (!name.trim()) {
            addToast("Por favor ingresa tu nombre", "error");
            return;
        }
        if (!phone.trim()) {
            addToast("Por favor ingresa tu teléfono", "error");
            return;
        }
        if (!address.trim()) {
            addToast("Por favor ingresa tu dirección de entrega", "error");
            return;
        }

        setIsSubmitting(true);

        // 2. GUARDAR EN SUPABASE (Shadow Order) 👻
        try {
            const orderItems = cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }));

            // Intentamos guardar, pero no bloqueamos si falla
            const { error } = await supabase.from('orders').insert({
                customer_name: name,
                customer_phone: phone,
                delivery_type: 'domicilio',
                address: address,
                payment_method: paymentMethod.toLowerCase(),
                items: orderItems,
                total: totalPrice,
                status: 'pendiente'
            });

            if (error) {
                console.error("Error guardando backup del pedido:", error);
                // No mostramos error al usuario para no interrumpir la venta
            }

        } catch (err) {
            console.error("Error silencioso al guardar orden:", err);
        }

        // 3. FLUJO ORIGINAL A WHATSAPP
        // Pasamos el nombre también a la función de WhatsApp para que el mensaje sea más personal
        // (Asegúrate de actualizar tu función sendOrderToWhatsapp para recibir 'name' si quieres, o déjalo en notas)
        const additionalNotes = `Cliente: ${name} (${phone})\nNotas: ${notes}`;

        sendOrderToWhatsapp(cart, { address, paymentMethod, notes: additionalNotes });

        addToast("¡Pedido procesado! Redirigiendo a WhatsApp...", "success");
        setIsSubmitting(false);
        onClose();

        // Opcional: Limpiar el carrito después de enviar
        // clearCart(); 
    };

    const sidebarVariants = {
        hidden: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
        visible: { x: "0%", transition: { type: "spring", stiffness: 300, damping: 30 } }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(197, 157, 95, 0.4); border-radius: 10px; }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(197, 157, 95, 0.8); }
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

                        {/* 2. LISTA DE PRODUCTOS */}
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
                                                    {item.quantity} x ${formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gold font-bold">
                                                    ${formatCurrency(item.price * item.quantity)}
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
                                            ${formatCurrency(totalPrice)}
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

                                    {/* NUEVOS CAMPOS: NOMBRE Y TELEFONO */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 uppercase">Nombre</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Tu nombre"
                                                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold focus:outline-none transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-400 uppercase">Teléfono</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Ej: 3001234567"
                                                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold focus:outline-none transition-colors placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>

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

                                    {/* DROPDOWN PERSONALIZADO */}
                                    <div className="space-y-2" ref={dropdownRef}>
                                        <label className="text-xs text-gray-400 uppercase">Método de Pago</label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                                                className={`w-full bg-white/5 border rounded p-3 text-white flex justify-between items-center transition-all duration-300
                                                    ${isPaymentOpen ? 'border-gold bg-white/10' : 'border-white/10 hover:border-gold/50'}
                                                `}
                                            >
                                                <span>{paymentMethod}</span>
                                                {isPaymentOpen ? <ChevronUp size={18} className="text-gold" /> : <ChevronDown size={18} className="text-gray-400" />}
                                            </button>

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
                                        disabled={isSubmitting}
                                        className="w-full bg-gold text-black font-bold py-4 uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} /> Procesando...
                                            </>
                                        ) : (
                                            <>
                                                Confirmar Pedido <ChevronRight size={18} />
                                            </>
                                        )}
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
                                Todos los pedidos deben ser validados por nuestro equipo. Domicilios fuera de Don Carmelo a partir de 5mil pesos.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}