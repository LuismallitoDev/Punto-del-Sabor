import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';
import { Loader2, TrendingUp, DollarSign, ShoppingBag, Calendar, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../utils/format';

export function DashboardStats() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        topProducts: [] as { name: string; value: number }[],
        salesByDay: [] as { day: string; ventas: number }[]
    });

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);

            // 1. Obtener fecha de inicio de mes
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            // 2. Pedir TODAS las órdenes del mes (sin límite)
            const { data: orders, error } = await supabase
                .from('orders')
                .select('*')
                .gte('created_at', firstDayOfMonth); // Filtro: desde el 1ro del mes

            if (error || !orders) {
                console.error(error);
                setLoading(false);
                return;
            }

            // --- PROCESAMIENTO DE DATOS ---

            // A) Total Vendido
            const totalSales = orders.reduce((acc, order) => acc + Number(order.total), 0);

            // B) Top Productos
            const productCount: Record<string, number> = {};
            orders.forEach(order => {
                const items = order.items as any[];
                items.forEach(item => {
                    productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
                });
            });

            // Convertir a array y ordenar
            const topProducts = Object.entries(productCount)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5); // Top 5

            // C) Ventas por Día
            const daysMap: Record<string, number> = {};
            orders.forEach(order => {
                const date = new Date(order.created_at).toLocaleDateString('es-CO', { weekday: 'short' });
                daysMap[date] = (daysMap[date] || 0) + 1;
            });

            // Ordenar días (Truco simple para demo, idealmente usar librerías de fecha)
            const salesByDay = Object.entries(daysMap).map(([day, ventas]) => ({ day, ventas }));

            setStats({
                totalSales,
                totalOrders: orders.length,
                topProducts,
                salesByDay
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-gold" /></div>;

    // Colores para el gráfico de torta
    const COLORS = ['#C59D5F', '#8c6b38', '#5e4620', '#3a2b13', '#1a1208'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* 1. TARJETAS DE RESUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#111] p-6 rounded-xl border border-white/10 flex items-center gap-4">
                    <div className="p-3 bg-gold/10 rounded-full text-gold"><DollarSign size={24} /></div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Ventas del Mes</p>
                        <h3 className="text-2xl font-bold text-white">${formatCurrency(stats.totalSales)}</h3>
                    </div>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border border-white/10 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-full text-blue-400"><ShoppingBag size={24} /></div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Pedidos Totales</p>
                        <h3 className="text-2xl font-bold text-white">{stats.totalOrders}</h3>
                    </div>
                </div>
                <div className="bg-[#111] p-6 rounded-xl border border-white/10 flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-full text-green-400"><TrendingUp size={24} /></div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Ticket Promedio</p>
                        <h3 className="text-2xl font-bold text-white">
                            ${formatCurrency(stats.totalOrders > 0 ? stats.totalSales / stats.totalOrders : 0)}
                        </h3>
                    </div>
                </div>
            </div>

            {/* 2. GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Gráfico de Barras: Top Productos */}
                <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Star size={18} className="text-gold" /> Productos Estrella
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topProducts} layout="vertical" margin={{ left: 20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="value" fill="#C59D5F" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de Área: Pedidos por Día */}
                <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar size={18} className="text-blue-400" /> Actividad Semanal
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.salesByDay}>
                                <defs>
                                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#C59D5F" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#C59D5F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="day" tick={{ fill: '#9ca3af' }} />
                                <YAxis tick={{ fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                    itemStyle={{ color: '#C59D5F' }}
                                />
                                <Area type="monotone" dataKey="ventas" stroke="#C59D5F" fillOpacity={1} fill="url(#colorVentas)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}