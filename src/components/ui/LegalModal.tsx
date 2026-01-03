import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'privacy' | 'terms' | null;
    data: { title: string; content: string } | null;
}

export function LegalModal({ isOpen, onClose, type, data }: LegalModalProps) {
    if (!data) return null;

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
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#111] border border-white/10 w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Cabecera */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                {type === 'privacy' ? <ShieldCheck className="text-gold" /> : <FileText className="text-gold" />}
                                <h2 className="text-xl font-serif text-white tracking-wide">{data.title}</h2>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Contenido con Scroll */}
                        <div className="p-8 overflow-y-auto text-gray-300 text-sm leading-relaxed custom-scrollbar">
                            <div
                                dangerouslySetInnerHTML={{ __html: data.content }}
                                className="space-y-4"
                            />
                        </div>

                        {/* Footer del Modal */}
                        <div className="p-6 border-t border-white/10 bg-black/20 text-center">
                            <button
                                onClick={onClose}
                                className="px-8 py-2 border border-white/20 rounded-full text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}