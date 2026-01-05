// src/components/admin/tabs/OrdersTab.tsx
import { useState } from 'react';
import { Eye, MapPin } from 'lucide-react';
import { Order } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { formatCurrency } from '../../../utils/format';
import { useToast } from '../../../context/ToastContext';
import { OrderDetailsModal } from '../OrderDetailsModal';

interface OrdersTabProps {
    orders: Order[];
    refreshData: () => void;
}

export function OrdersTab({ orders, refreshData }: OrdersTabProps) {
    const { addToast } = useToast();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleStatusChange = async (id: string, newStatus: string) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
        if (error) addToast("Error al actualizar", "error");
        else {
            addToast("Estado actualizado", "success");
            refreshData();
        }
    };

    const formatDate = (date: string) => new Date(date).toLocaleString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <>
            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-white">
                        <thead className="bg-white/5 text-xs uppercase text-gray-400 border-b border-white/10">
                            <tr>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-right">Detalles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map(order => (
                                <tr key={order.id} className={`hover:bg-white/5 transition-colors ${order.status === 'cancelado' ? 'opacity-50' : ''}`}>
                                    <td className="p-4 text-xs text-gray-400 font-mono whitespace-nowrap">{formatDate(order.created_at)}</td>
                                    <td className="p-4">
                                        <p className="font-bold">{order.customer_name}</p>
                                        {order.delivery_type === 'domicilio' && <div className="flex items-center gap-1 text-xs text-blue-400 mt-1"><MapPin size={10} /><span className="truncate w-32">{order.address}</span></div>}
                                    </td>
                                    <td className="p-4 font-bold text-gold">${formatCurrency(order.total)}</td>
                                    <td className="p-4">
                                        <div className="relative inline-block w-40">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`w-full appearance-none bg-[#1a1a1a] border text-xs font-bold uppercase py-2 px-3 rounded focus:outline-none cursor-pointer ${order.status === 'completado' ? 'border-green-500 text-green-400' : order.status === 'cancelado' ? 'border-red-500 text-red-400' : 'border-yellow-500 text-yellow-400'}`}
                                            >
                                                <option value="pendiente">🟡 Pendiente</option>
                                                <option value="completado">🟢 Venta Real</option>
                                                <option value="cancelado">🔴 Pérdida</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => setSelectedOrder(order)} className="bg-gold/10 text-gold p-2 rounded hover:bg-gold hover:text-black"><Eye size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <OrderDetailsModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} />
        </>
    );
}