import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Tipos de Toast
type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* CONTENEDOR DE TOASTS (Renderizado Global) */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

// Componente Individual del Toast
const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        info: <Info size={20} className="text-gold" />,
    };

    const borders = {
        success: 'border-green-500/30',
        error: 'border-red-500/30',
        info: 'border-gold/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            layout
            className={`pointer-events-auto flex items-center gap-3 bg-[#111] backdrop-blur-md border ${borders[toast.type]} p-4 rounded-lg shadow-2xl shadow-black/50`}
        >
            <div className="shrink-0">{icons[toast.type]}</div>
            <p className="text-sm font-medium text-white flex-grow">{toast.message}</p>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={16} />
            </button>
        </motion.div>
    );
};

// Hook personalizado
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast debe usarse dentro de ToastProvider');
    return context;
};