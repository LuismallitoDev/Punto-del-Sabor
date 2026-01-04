import { useState } from 'react';
import { Instagram, Facebook, MapPin, Clock, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa'; // <--- Importamos el icono de marca
import LogoTipo from "../../assets/Logotipo_Transparente.png";
import { WHATSAPP_NUMBER } from '../../config/constants';
import { LegalModal } from '../ui/LegalModal';
import { legalContent } from '../../data/legalInfo';

export function Footer() {
    const [legalModalOpen, setLegalModalOpen] = useState(false);
    const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);

    const openLegal = (type: 'privacy' | 'terms') => {
        setLegalType(type);
        setLegalModalOpen(true);
    };

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
    };

    return (
        <>
            <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">

                        {/* COLUMNA 1: MARCA */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                            <div className="w-32 opacity-90 mb-2">
                                <img src={LogoTipo} alt="El Punto del Sabor" className="w-full h-auto" />
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                La mejor comida rápida costeña. Empanadas, papas rellenas, buñuelos, patacones y más preparados con la tradición y el sabor de casa.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <a href="https://www.instagram.com/elpuntodelsabor.vup/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300">
                                    <Instagram size={18} />
                                </a>
                                <a href="https://www.facebook.com/mega.alitas.2025" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all duration-300">
                                    <Facebook size={18} />
                                </a>
                            </div>
                        </div>

                        {/* COLUMNA 2: CONTACTO */}
                        <div className="flex flex-col items-center text-center space-y-6">
                            <h3 className="text-gold font-serif tracking-widest uppercase text-sm font-bold">
                                Visítanos
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <MapPin className="text-gold/70 group-hover:text-gold transition-colors" size={24} />
                                    <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
                                        Carrera 33 #56-31<br />Valledupar, Colombia
                                    </p>
                                </div>
                                <div className="w-12 h-[1px] bg-white/10 mx-auto" />
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <Phone className="text-gold/70 group-hover:text-gold transition-colors" size={24} />
                                    <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
                                        +{WHATSAPP_NUMBER.slice(0, 2) + " " + WHATSAPP_NUMBER.slice(2, 5) + " " + WHATSAPP_NUMBER.slice(5, 8) + " " + WHATSAPP_NUMBER.slice(8, 12)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA 3: HORARIOS Y WHATSAPP */}
                        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-6">
                            <h3 className="text-gold font-serif tracking-widest uppercase text-sm font-bold">
                                Horarios de Atención
                            </h3>
                            <div className="space-y-3 text-sm text-gray-400">
                                <div className="flex flex-col md:items-end gap-1">
                                    <span className="text-white font-medium text-lg">Lunes a Domingo</span>
                                    <span className="text-gold">4:00 PM - 10:00 PM</span>
                                </div>
                            </div>

                            {/* Indicador Abierto */}
                            <div className="flex items-center gap-2 text-green-500 text-xs font-bold tracking-wider uppercase border border-green-500/20 bg-green-500/10 px-3 py-1 rounded-full animate-pulse">
                                <Clock size={12} />
                                Abierto Ahora
                            </div>

                            {/* --- BOTÓN WHATSAPP NUEVO --- */}
                            <button
                                onClick={handleWhatsAppClick}
                                className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-black hover:text-white px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 shadow-[0_0_15px_rgba(37,211,102,0.2)] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] mt-2"
                            >
                                <FaWhatsapp size={18} className="group-hover:scale-110 transition-transform duration-300" />
                                <span>¡Contactanos!</span>
                            </button>
                        </div>
                    </div>

                    {/* COPYRIGHT & LEGAL LINKS */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 uppercase tracking-wider">
                        <p>&copy; 2024 El Punto del Sabor. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            <button
                                onClick={() => openLegal('privacy')}
                                className="hover:text-gold transition-colors"
                            >
                                Privacidad
                            </button>
                            <button
                                onClick={() => openLegal('terms')}
                                className="hover:text-gold transition-colors"
                            >
                                Términos
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

            <LegalModal
                isOpen={legalModalOpen}
                onClose={() => setLegalModalOpen(false)}
                type={legalType}
                data={legalType ? legalContent[legalType] : null}
            />
        </>
    );
}