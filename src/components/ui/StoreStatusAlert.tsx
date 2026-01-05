import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Lock, CalendarDays } from 'lucide-react';
import { useStoreSettings } from '../../hooks/useStoreSettings';

export function StoreStatusAlert() {
    const { settings } = useStoreSettings();
    const [isScheduledActive, setIsScheduledActive] = useState(false);

    // ESCUCHA EL TIEMPO EN VIVO ⏱️
    useEffect(() => {
        if (!settings?.holiday_start || !settings?.holiday_end) {
            setIsScheduledActive(false);
            return;
        }

        const checkTime = () => {
            const now = new Date().getTime(); // Hora actual en milisegundos
            const start = new Date(settings.holiday_start ?? '').getTime();
            const end = new Date(settings.holiday_end ?? '').getTime();

            // Debug en consola para verificar (borrar luego)
            // console.log("Ahora:", new Date(now), "Inicio:", new Date(start), "Fin:", new Date(end));

            // Activamos si AHORA está entre INICIO y FIN
            const isActive = now >= start && now <= end;
            setIsScheduledActive(isActive);
        };

        // 1. Revisar inmediatamente
        checkTime();

        // 2. Revisar cada 5 segundos automáticamente
        const interval = setInterval(checkTime, 5000);

        return () => clearInterval(interval);
    }, [settings]); // Se reinicia si cambian los ajustes

    if (!settings) return null;

    // La tienda está en modo "Descanso" si el switch manual está ON 
    // O si el cronómetro dice que estamos en horario programado.
    const isHolidayActive = settings.holiday_mode || isScheduledActive;

    return (
        <AnimatePresence>

            {/* 1. NIVEL PRIORIDAD: CIERRE DE EMERGENCIA (ROJO) */}
            {settings.force_close && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                >
                    <div className="bg-[#1a1a1a] border border-red-500/30 p-8 rounded-2xl max-w-md shadow-2xl shadow-red-900/20">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-serif text-white mb-4">Cerrado Temporalmente</h2>
                        <p className="text-gray-400">Estamos solucionando unos inconvenientes técnicos.</p>
                    </div>
                </motion.div>
            )}

            {/* 2. NIVEL MEDIO: MODO DESCANSO / PROGRAMADO (AZUL) */}
            {!settings.force_close && isHolidayActive && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-[#111] border border-blue-500/30 p-10 rounded-2xl max-w-md shadow-2xl shadow-blue-900/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

                        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
                            <CalendarDays size={40} />
                        </div>

                        <h2 className="text-3xl font-serif text-white mb-4">Aviso Importante</h2>

                        <p className="text-gray-300 text-lg mb-8 leading-relaxed font-medium">
                            "{settings.holiday_message}"
                        </p>

                        <div className="inline-block px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs text-gray-500 uppercase tracking-widest">
                            Punto del Sabor
                        </div>

                        {/* Mostrar hasta cuándo si es programado */}
                        {isScheduledActive && settings.holiday_end && (
                            <p className="mt-4 text-xs text-blue-400/60 font-mono">
                                Volvemos el: {new Date(settings.holiday_end).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
                    </motion.div>
                </motion.div>
            )}

            {/* 3. NIVEL BAJO: ALTA DEMANDA */}
            {!settings.force_close && !isHolidayActive && settings.high_demand && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="bg-orange-600 text-white font-bold text-center px-4 py-3 text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 sticky top-0 z-[60] shadow-lg shadow-orange-900/20"
                >
                    <Clock size={16} className="animate-pulse" />
                    <span>¡Alta Demanda! Tiempo de espera aprox: {settings.delay_minutes} min.</span>
                </motion.div>
            )}

        </AnimatePresence>
    );
}