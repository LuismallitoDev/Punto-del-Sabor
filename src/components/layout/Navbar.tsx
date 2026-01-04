import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Phone, MapPin, Clock, Images } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import LogoTipo from "../../assets/Logotipo_Transparente.png";
import { useCart } from '../../context/CartContext';
import { CartSidebar } from './CartSidebar';
import { InstallationsGallery } from '../ui/InstallationsGallery';
import { HoursModal } from '../ui/HoursModal';
import { WHATSAPP_NUMBER } from '../../config/constants';
import { useBlockScroll } from '../../utils/useBlockScroll';
export function Navbar() {
    // Estado para el menú izquierdo (Hamburguesa)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Estado para el carrito derecho (Sidebar)
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Estado para la galeria de el link instalaciones
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    //Estado para el modal de horario
    const [isHoursOpen, setIsHoursOpen] = useState(false);

    //Estado y hook del carrito
    const { totalItems } = useCart();

    useBlockScroll(isMenuOpen);
    useBlockScroll(isCartOpen);
    useBlockScroll(isGalleryOpen);
    useBlockScroll(isHoursOpen);



    const navLinks = [
        { name: 'Llamar', icon: Phone, action: () => window.open(`tel:+${WHATSAPP_NUMBER}`, '_self') },
        { name: 'WhatsApp', icon: FaWhatsapp, action: () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank') },
        { name: 'Ubicación', icon: MapPin, action: () => window.open('https://www.google.com/maps/search/?api=1&query=El+Punto+del+Sabor+Valledupar', '_blank') },
        {
            name: 'Horarios',
            icon: Clock,
            action: () => {
                setIsMenuOpen(false);
                setIsHoursOpen(true);
            }
        },
        {
            name: 'Instalaciones',
            icon: Images,
            action: () => {
                setIsMenuOpen(false);
                setIsGalleryOpen(true);
            }
        }
    ];

    // Variantes de animación
    const sidebarVariants = { hidden: { x: "-100%" }, visible: { x: "0%" } };
    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const itemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

    return (
        <>
            {/* 1. BARRA DE NAVEGACIÓN */}
            <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm p-4 md:p-6">
                <div className="container mx-auto px-4 flex justify-between items-center relative z-50">

                    {/* Botón Menú Izquierdo */}
                    <button onClick={() => setIsMenuOpen(true)} className="text-white p-2 focus:outline-none active:scale-95 transition-transform">
                        <Menu className="w-8 h-8 text-gold" />
                    </button>

                    {/* Logo Centro */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 md:w-40">
                        <img src={LogoTipo} alt="El Punto del Sabor" className="w-full h-auto object-contain drop-shadow-lg" />
                    </div>

                    {/* Botón Carrito Derecho */}
                    <button
                        onClick={() => setIsCartOpen(true)} // AHORA ABRE EL SIDEBAR
                        className="text-white p-2 relative active:scale-95 transition-transform group"
                    >
                        <ShoppingBag className="w-7 h-7 text-gold group-hover:text-white transition-colors" />
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse border border-black">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            {/* 2. COMPONENTE CART SIDEBAR (Cortina Derecha) */}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <InstallationsGallery isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
            <HoursModal isOpen={isHoursOpen} onClose={() => setIsHoursOpen(false)} />
            {/* 3. MENÚ LATERAL IZQUIERDO (Tu código existente) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial="hidden" animate="visible" exit="hidden"
                            variants={backdropVariants}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                        />
                        <motion.div
                            initial="hidden" animate="visible" exit="hidden"
                            variants={sidebarVariants}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-[100dvh] w-[85%] max-w-[300px] bg-[#0a0a0a] z-[100] border-r border-white/10 shadow-2xl flex flex-col"
                        >
                            <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
                            <div className="flex justify-between items-center p-6 border-b border-white/10 relative z-10">
                                <span className="text-gold font-serif tracking-widest uppercase text-sm font-bold">Acciones</span>
                                <button onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-gold transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex-grow py-6 relative z-10 overflow-y-auto">
                                <div className="flex flex-col">
                                    {navLinks.map((item, index) => (
                                        <motion.button
                                            key={item.name}
                                            variants={itemVariants}
                                            initial="hidden" animate="visible"
                                            transition={{ delay: index * 0.05 }}
                                            onClick={item.action}
                                            className="group flex items-center w-full px-6 py-4 text-white hover:bg-white/5 transition-colors border-l-4 border-transparent hover:border-gold text-left"
                                        >
                                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors mr-4" />
                                            <span className="text-base font-sans tracking-wide font-light group-hover:text-white transition-colors flex-grow">
                                                {item.name}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/10 relative z-10 bg-black/20">
                                <div className="flex flex-col gap-4">
                                    <img src={LogoTipo} alt="Logo Footer" className="w-20 opacity-50 grayscale mb-2" />
                                    <div className="flex gap-6 text-xs text-white/50 tracking-widest uppercase">
                                        <a href="https://www.instagram.com/elpuntodelsabor.vup/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Instagram</a>
                                        <a href="https://www.facebook.com/mega.alitas.2025" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Facebook</a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}