import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, User, Calendar, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency } from '../../utils/format';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
    if (!order) return null;

    // Formatear fecha completa: "5 Ene 2024, 02:30 PM"
    const formattedDate = new Date(order.created_at).toLocaleString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()} // Evitar cerrar al clickear dentro
                        className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <div>
                                <h2 className="text-xl font-serif text-gold flex items-center gap-2">
                                    <ShoppingBag size={20} /> Pedido #{order.id.slice(0, 8)}
                                </h2>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <Calendar size={12} /> {formattedDate}
                                </p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X />
                            </button>
                        </div>

                        {/* CONTENIDO SCROLLEABLE */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                            {/* 1. Datos del Cliente y Entrega */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Cliente */}
                                <div className="space-y-3 bg-white/5 p-4 rounded-lg border border-white/5">
                                    <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Cliente</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gold/10 p-2 rounded-full text-gold"><User size={18} /></div>
                                        <div>
                                            <p className="font-bold text-white">{order.customer_name}</p>
                                            <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                                <Phone size={12} /> {order.customer_phone || 'Sin teléfono'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Entrega */}
                                <div className="space-y-3 bg-white/5 p-4 rounded-lg border border-white/5">
                                    <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Entrega</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-500/10 p-2 rounded-full text-blue-400">
                                            {order.delivery_type === 'domicilio' ? <Truck size={18} /> : <ShoppingBag size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white capitalize">{order.delivery_type}</p>
                                            {order.delivery_type === 'domicilio' && (
                                                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1 break-all">
                                                    <MapPin size={12} /> {order.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Lista de Productos */}
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Detalle de Productos</h3>
                                <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-black/20 text-gray-500 uppercase text-[10px]">
                                            <tr>
                                                <th className="p-3">Producto</th>
                                                <th className="p-3 text-center">Cant.</th>
                                                <th className="p-3 text-right">Precio</th>
                                                <th className="p-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {(order.items as any[]).map((item, idx) => (
                                                <tr key={idx} className="hover:bg-white/5">
                                                    <td className="p-3 font-medium text-white">{item.name}</td>
                                                    <td className="p-3 text-center text-gray-400">x{item.quantity}</td>
                                                    <td className="p-3 text-right text-gray-400">${formatCurrency(item.price)}</td>
                                                    <td className="p-3 text-right text-gold font-bold">${formatCurrency(item.price * item.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 3. Totales y Pago */}
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-t border-white/10 pt-6">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Método de Pago</p>
                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border text-sm capitalize
                                        ${order.payment_method === 'nequi' ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' :
                                            order.payment_method === 'bancolombia' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                                                'border-green-500/50 text-green-400 bg-green-500/10'}
                                    `}>
                                        <CreditCard size={14} /> {order.payment_method}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400 mb-1">Total a Pagar</p>
                                    <p className="text-3xl font-serif text-gold font-bold">${formatCurrency(order.total)}</p>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER ACTIONS */}
                        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium transition-colors uppercase text-xs tracking-widest"
                            >
                                Cerrar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}