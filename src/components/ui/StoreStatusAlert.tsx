import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Lock } from 'lucide-react';
import { useStoreSettings } from '../../utils/useStoreSettings';

export function StoreStatusAlert() {
    const { settings } = useStoreSettings();

    if (!settings) return null;

    return (
        <>
            <AnimatePresence>
                {/* NIVEL 1: ALTA DEMANDA (Banner Superior) */}
                {settings.high_demand && !settings.force_close && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-orange-500/90 backdrop-blur-sm text-black font-bold text-center px-4 py-2 text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 sticky top-0 z-[60]"
                    >
                        <Clock size={16} className="animate-pulse" />
                        <span>¡Alta Demanda! Los pedidos pueden tardar aprox. {settings.delay_minutes} min.</span>
                    </motion.div>
                )}

                {/* NIVEL 2: CIERRE DE EMERGENCIA (Overlay Bloqueante) */}
                {settings.force_close && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="bg-[#1a1a1a] border border-red-500/30 p-8 rounded-2xl max-w-md shadow-2xl shadow-red-900/20"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <Lock size={32} />
                            </div>
                            <h2 className="text-2xl font-serif text-white mb-4">Cerrado Temporalmente</h2>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Estamos experimentando dificultades técnicas o alta demanda en cocina.
                                <br />Por calidad, hemos pausado los pedidos momentáneamente.
                            </p>
                            <div className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-full animate-pulse">
                                <AlertTriangle size={14} />
                                No estamos recibiendo pedidos
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}