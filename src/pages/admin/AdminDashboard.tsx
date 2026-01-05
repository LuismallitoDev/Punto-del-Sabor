import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    LogOut, Plus, Search, Edit, Trash2, Star, Eye, EyeOff,
    Settings as SettingsIcon, Package, Layers, Loader2, ClipboardList, MapPin,
    CheckCircle2, XCircle, Clock, Power, LayoutDashboard, QrCode // Iconos actualizados
} from 'lucide-react';
import { motion } from 'framer-motion';

import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useStoreSettings } from '../../utils/useStoreSettings';
import { formatCurrency } from '../../utils/format';
import { Product, Category, Order } from '../../types';

// Modales
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { CategoryFormModal } from '../../components/admin/CategoryFormModal';
import { OrderDetailsModal } from '../../components/admin/OrderDetailsModal';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { QRGeneratorModal } from '../../components/admin/QRGeneratorModal';

import Logo from '../../assets/Logotipo_Transparente.png';

export function AdminDashboard() {
    const { signOut } = useAuth();
    const { addToast } = useToast();
    const { settings: storeSettings, updateSettings } = useStoreSettings();
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    // Pestañas
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories'>('products');

    // Datos
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modales
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // --- CARGA DE DATOS ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Productos
            const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (prodData) {
                const mappedProducts: Product[] = prodData.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    category: item.category,
                    image: item.image,
                    isPopular: item.is_popular,
                    ingredients: item.ingredients,
                    calories: item.calories,
                    active: item.active
                }));
                setProducts(mappedProducts);
            }

            // 2. Categorías
            const { data: catData } = await supabase.from('categories').select('*').order('name');
            if (catData) setCategories(catData);

            // 3. Ordenes
            const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50);
            if (orderData) setOrders(orderData);

        } catch (error) {
            console.error("Error cargando datos:", error);
            addToast("Error al cargar el panel", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- LOGICA ORDENES (NUEVO) ---
    const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
        // Actualización Optimista (Visual inmediata)
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            addToast("Error al actualizar estado", "error");
            fetchData(); // Revertir si falla
        } else {
            const statusMsg = newStatus === 'completado' ? 'Venta registrada 💰' : newStatus === 'cancelado' ? 'Pedido cancelado ❌' : 'Pedido pendiente ⏳';
            addToast(statusMsg, newStatus === 'completado' ? 'success' : 'info');
        }
    };

    // --- LOGICA PRODUCTOS ---
    const togglePopular = async (product: Product) => {
        const newValue = !product.isPopular;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isPopular: newValue } : p));
        await supabase.from('products').update({ is_popular: newValue }).eq('id', product.id);
    };

    const toggleActive = async (product: Product) => {
        const newValue = !product.active;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: newValue } : p));
        await supabase.from('products').update({ active: newValue }).eq('id', product.id);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm("¿Eliminar producto?")) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) { addToast("Producto eliminado", "success"); fetchData(); }
    };

    // --- LOGICA CATEGORÍAS ---
    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm("¿Eliminar categoría?")) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (!error) { addToast("Categoría eliminada", "success"); fetchData(); }
    };

    // Auxiliar Fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-CO', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Filtrado
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">

            {/* HEADER */}
            <header className="border-b border-white/10 bg-[#111] sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src={Logo} alt="Logo" className="w-12 opacity-90" />
                        <h1 className="text-xl font-bold text-gold tracking-wide hidden md:block">Panel de Control</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsQRModalOpen(true)}
                            className="p-2 text-gold hover:bg-gold/10 rounded-full transition-colors"
                            title="Generar QRs de Mesas"
                        >
                            <QrCode size={20} />
                        </button>
                        <Link to="/admin/settings" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"><SettingsIcon size={20} /></Link>
                        <button onClick={signOut} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 ml-2 border-l border-white/10 pl-4"><LogOut size={16} /> <span className="hidden md:inline">Salir</span></button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">

                {/* KILL SWITCH PANEL */}
                {storeSettings && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${storeSettings.force_close ? 'bg-red-500/10 border-red-500 shadow-lg shadow-red-900/20' : 'bg-[#111] border-white/10'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${storeSettings.force_close ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-500'}`}><Power size={24} /></div>
                                <div><h3 className={`font-bold ${storeSettings.force_close ? 'text-red-400' : 'text-white'}`}>Cierre de Emergencia</h3><p className="text-xs text-gray-500">Bloquea la tienda inmediatamente.</p></div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={storeSettings.force_close} onChange={(e) => updateSettings({ force_close: e.target.checked })} />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </label>
                        </div>
                        <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${storeSettings.high_demand ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-900/20' : 'bg-[#111] border-white/10'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${storeSettings.high_demand ? 'bg-orange-500 text-black' : 'bg-white/5 text-gray-500'}`}><Clock size={24} /></div>
                                <div><h3 className={`font-bold ${storeSettings.high_demand ? 'text-orange-400' : 'text-white'}`}>Modo Alta Demanda</h3><p className="text-xs text-gray-500">Avisa demora de {storeSettings.delay_minutes} min.</p></div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={storeSettings.high_demand} onChange={(e) => updateSettings({ high_demand: e.target.checked })} />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>
                    </div>
                )}

                {/* TABS DE NAVEGACIÓN */}
                <div className="flex gap-6 mb-8 border-b border-white/10 overflow-x-auto custom-scrollbar pb-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-3 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap
        ${activeTab === 'overview' ? 'text-gold' : 'text-gray-500 hover:text-white'}
    `}
                    >
                        <LayoutDashboard size={18} /> Resumen
                        {activeTab === 'overview' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`pb-3 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'orders' ? 'text-gold' : 'text-gray-500 hover:text-white'}`}>
                        <ClipboardList size={18} /> Pedidos Recientes
                        {activeTab === 'orders' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`pb-3 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'products' ? 'text-gold' : 'text-gray-500 hover:text-white'}`}>
                        <Package size={18} /> Productos
                        {activeTab === 'products' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
                    </button>
                    <button onClick={() => setActiveTab('categories')} className={`pb-3 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === 'categories' ? 'text-gold' : 'text-gray-500 hover:text-white'}`}>
                        <Layers size={18} /> Categorías
                        {activeTab === 'categories' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
                    </button>
                </div>

                {loading ? <div className="py-20 flex justify-center text-gold"><Loader2 className="animate-spin" /></div> : (
                    <>
                        {/* --- TAB: PEDIDOS --- */}
                        {activeTab === 'orders' && (
                            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-white/5 text-xs uppercase text-gray-400 border-b border-white/10">
                                            <tr>
                                                <th className="p-4">Fecha</th>
                                                <th className="p-4">Cliente</th>
                                                <th className="p-4">Total</th>
                                                <th className="p-4">Estado (Venta/Pérdida)</th>
                                                <th className="p-4 text-right">Detalles</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {orders.length === 0 ? (
                                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No hay pedidos registrados aún.</td></tr>
                                            ) : (
                                                orders.map((order) => (
                                                    <tr key={order.id} className={`transition-colors ${order.status === 'cancelado' ? 'opacity-50 hover:opacity-100' : 'hover:bg-white/5'}`}>
                                                        <td className="p-4 text-xs text-gray-400 font-mono whitespace-nowrap">
                                                            {formatDate(order.created_at)}
                                                        </td>
                                                        <td className="p-4">
                                                            <p className="font-bold text-white">{order.customer_name}</p>
                                                            {order.delivery_type === 'domicilio' && (
                                                                <div className="flex items-center gap-1 text-xs text-blue-400 mt-1">
                                                                    <MapPin size={10} />
                                                                    <span className="truncate max-w-[150px]">{order.address}</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="p-4 font-bold text-gold whitespace-nowrap">
                                                            ${formatCurrency(order.total)}
                                                        </td>

                                                        {/* COLUMNA DE ESTADO CON SELECTOR */}
                                                        <td className="p-4">
                                                            <div className="relative inline-block w-40">
                                                                <select
                                                                    value={order.status}
                                                                    onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                                                    className={`w-full appearance-none bg-[#1a1a1a] border text-xs font-bold uppercase py-2 px-3 pr-8 rounded focus:outline-none cursor-pointer
                                                                        ${order.status === 'completado' ? 'border-green-500 text-green-400' :
                                                                            order.status === 'cancelado' ? 'border-red-500 text-red-400' :
                                                                                'border-yellow-500 text-yellow-400'}
                                                                    `}
                                                                >
                                                                    <option value="pendiente">🟡 Pendiente</option>
                                                                    <option value="completado">🟢 Venta Real</option>
                                                                    <option value="cancelado">🔴 Pérdida</option>
                                                                </select>
                                                                {/* Icono decorativo según estado */}
                                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                    {order.status === 'completado' ? <CheckCircle2 size={14} className="text-green-500" /> :
                                                                        order.status === 'cancelado' ? <XCircle size={14} className="text-red-500" /> :
                                                                            <Clock size={14} className="text-yellow-500" />}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="bg-gold/10 text-gold hover:bg-gold hover:text-black p-2 rounded transition-colors"
                                                                title="Ver Detalles Completos"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* --- TAB: PRODUCTOS --- */}
                        {activeTab === 'products' && (
                            <>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:border-gold outline-none transition-colors" />
                                    </div>
                                    <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="bg-gold text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase flex gap-2 items-center hover:bg-white transition-colors shadow-lg shadow-gold/10">
                                        <Plus size={16} /> Nuevo Producto
                                    </button>
                                </div>

                                <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-widest text-gray-400">
                                                    <th className="p-4">Producto</th>
                                                    <th className="p-4">Categoría</th>
                                                    <th className="p-4">Precio</th>
                                                    <th className="p-4 text-center">Visible</th>
                                                    <th className="p-4 text-center">Popular</th>
                                                    <th className="p-4 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {filteredProducts.length === 0 ? (
                                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No se encontraron productos.</td></tr>
                                                ) : (
                                                    filteredProducts.map(product => (
                                                        <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/50 border border-white/10 flex-shrink-0">
                                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div><p className="font-bold text-white text-sm">{product.name}</p><p className="text-[10px] text-gray-500 truncate max-w-[150px]">{product.description}</p></div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4"><span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-white/5 text-gray-400 border border-white/5">{product.category}</span></td>
                                                            <td className="p-4 font-mono text-gold text-sm whitespace-nowrap">${formatCurrency(product.price)}</td>
                                                            <td className="p-4 text-center"><button onClick={() => toggleActive(product)} className="hover:scale-110 transition-transform">{product.active ? <Eye size={18} className="text-green-500" /> : <EyeOff size={18} className="text-red-500" />}</button></td>
                                                            <td className="p-4 text-center"><button onClick={() => togglePopular(product)} className="hover:scale-110 transition-transform"><Star size={18} className={product.isPopular ? "text-gold fill-gold" : "text-gray-700"} /></button></td>
                                                            <td className="p-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }} className="p-2 hover:bg-blue-500/20 rounded text-blue-400 hover:text-blue-300 transition-colors" title="Editar"><Edit size={16} /></button>
                                                                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* --- TAB: CATEGORÍAS --- */}
                        {activeTab === 'categories' && (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <div className="relative w-full md:w-96 opacity-50 pointer-events-none">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input type="text" placeholder="Buscar categoría..." disabled className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-500" />
                                    </div>
                                    <button onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }} className="bg-gold text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase flex gap-2 items-center hover:bg-white transition-colors shadow-lg shadow-gold/10">
                                        <Plus size={16} /> Nueva Categoría
                                    </button>
                                </div>

                                <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-widest text-gray-400">
                                                    <th className="p-4 w-1/3">Nombre</th>
                                                    <th className="p-4 w-1/3">Slug (ID)</th>
                                                    <th className="p-4 w-1/3 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {categories.length === 0 ? (
                                                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">No hay categorías creadas.</td></tr>
                                                ) : (
                                                    categories.map(cat => (
                                                        <tr key={cat.id} className="hover:bg-white/5 transition-colors group">
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 flex-shrink-0"><Layers size={20} /></div>
                                                                    <span className="font-bold text-white text-sm">{cat.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4"><span className="px-3 py-1.5 rounded-md text-xs font-mono bg-white/5 text-gold border border-white/10 select-all">{cat.slug}</span></td>
                                                            <td className="p-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="p-2 hover:bg-blue-500/20 rounded text-blue-400 hover:text-blue-300 transition-colors" title="Editar"><Edit size={16} /></button>
                                                                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
                {activeTab === 'overview' && (
                    <DashboardStats />
                )}
            </main>

            {/* MODALES */}
            <ProductFormModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} productToEdit={editingProduct} onSuccess={fetchData} />
            <CategoryFormModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} categoryToEdit={editingCategory} onSuccess={fetchData} />
            <OrderDetailsModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} />
            <QRGeneratorModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
        </div>
    );
}