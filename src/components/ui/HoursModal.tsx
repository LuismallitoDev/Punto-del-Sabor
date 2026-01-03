import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar } from 'lucide-react';

interface HoursModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HoursModal({ isOpen, onClose }: HoursModalProps) {
    const [isOpenNow, setIsOpenNow] = useState(false);

    // --- LÓGICA DE APERTURA ---
    // Horario: Lunes a Domingo de 4:00 PM (16:00) a 10:00 PM (22:00)
    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hour = now.getHours(); // 0 - 23

            // Abierto si la hora es mayor/igual a 16 (4PM) Y menor a 22 (10PM)
            // Es decir, de 16:00 a 21:59
            const isOpen = hour >= 16 && hour < 22;

            setIsOpenNow(isOpen);
        };

        checkTime();
        // Revisar cada minuto por si cambia mientras el usuario tiene la web abierta
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    {/* Contenedor del Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer click dentro
                        className="bg-[#111] border border-white/10 w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative"
                    >
                        {/* Cabecera */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <Clock className="text-gold" />
                                <h2 className="text-xl font-serif text-white tracking-wide">Horarios</h2>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cuerpo */}
                        <div className="p-8 flex flex-col items-center text-center space-y-8">

                            {/* INDICADOR DE ESTADO (SEMÁFORO) */}
                            <div className={`
                                flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 
                                transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]
                                ${isOpenNow
                                    ? "border-green-500/50 bg-green-500/10 shadow-green-500/20"
                                    : "border-red-500/50 bg-red-500/10 shadow-red-500/20"}
                            `}>
                                <div className={`w-4 h-4 rounded-full mb-2 ${isOpenNow ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                                <span className={`text-xl font-bold tracking-widest uppercase ${isOpenNow ? "text-green-500" : "text-red-500"}`}>
                                    {isOpenNow ? "Abierto" : "Cerrado"}
                                </span>
                                {!isOpenNow && (
                                    <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
                                        Abre a las 4:00 PM
                                    </span>
                                )}
                            </div>

                            {/* TABLA DE HORARIOS */}
                            <div className="w-full bg-white/5 rounded-lg p-6 border border-white/5 space-y-4">
                                <div className="flex items-center gap-2 text-gold mb-2 justify-center">
                                    <Calendar size={16} />
                                    <span className="text-xs uppercase tracking-widest font-bold">Horario Semanal</span>
                                </div>

                                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                    <span className="text-gray-300 font-medium">Lunes - Domingo</span>
                                    <div className="text-right">
                                        <span className="block text-white font-bold">4:00 PM - 10:00 PM</span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 pt-2 leading-relaxed">
                                    * Horarios sujetos a cambios en días festivos.
                                </p>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}