// src/pages/admin/AdminDashboard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Layers, ClipboardList, LayoutDashboard, Loader2, Power, Clock } from 'lucide-react';

// Hooks y Utilidades
import { useAdminData } from '../../hooks/useAdminData';
import { useStoreSettings } from '../../hooks/useStoreSettings';

// Componentes Refactorizados
import { AdminHeader } from '../../components/admin/AdminHeader';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { ProductsTab } from '../../components/admin/tabs/ProductsTab'; // Crear estos archivos
import { OrdersTab } from '../../components/admin/tabs/OrdersTab';     // Crear estos archivos
import { CategoriesTab } from '../../components/admin/tabs/CategoriesTab'; // Crear estos archivos
import { QRGeneratorModal } from '../../components/admin/QRGeneratorModal';

export function AdminDashboard() {
    // 1. Lógica Global
    const { products, categories, orders, loading, refreshData } = useAdminData();
    const { settings: storeSettings, updateSettings } = useStoreSettings();

    // 2. Estado UI Local
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories'>('orders');
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    // Renderizado de carga
    if (loading) {
        return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gold"><Loader2 className="animate-spin w-8 h-8" /></div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">

            {/* Header Limpio */}
            <AdminHeader onOpenQR={() => setIsQRModalOpen(true)} />

            <main className="container mx-auto px-4 py-8">

                {/* Panel Kill Switch (Control de Tienda) */}
                {storeSettings && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* Switch Cierre Emergencia */}
                        <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${storeSettings.force_close ? 'bg-red-900/20 border-red-500' : 'bg-[#111] border-white/10'}`}>
                            <div className="flex gap-4 items-center">
                                <div className={`p-3 rounded-full ${storeSettings.force_close ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-500'}`}><Power size={20} /></div>
                                <div><h3 className="font-bold">Cierre de Emergencia</h3><p className="text-xs text-gray-400">Bloquea la tienda al instante.</p></div>
                            </div>
                            <input type="checkbox" checked={storeSettings.force_close} onChange={e => updateSettings({ force_close: e.target.checked })} className="accent-red-500 w-6 h-6 cursor-pointer" />
                        </div>

                        {/* Switch Alta Demanda */}
                        <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${storeSettings.high_demand ? 'bg-orange-900/20 border-orange-500' : 'bg-[#111] border-white/10'}`}>
                            <div className="flex gap-4 items-center">
                                <div className={`p-3 rounded-full ${storeSettings.high_demand ? 'bg-orange-500 text-black' : 'bg-white/5 text-gray-500'}`}><Clock size={20} /></div>
                                <div><h3 className="font-bold">Alta Demanda</h3><p className="text-xs text-gray-400">Avisa demora de {storeSettings.delay_minutes} min.</p></div>
                            </div>
                            <input type="checkbox" checked={storeSettings.high_demand} onChange={e => updateSettings({ high_demand: e.target.checked })} className="accent-orange-500 w-6 h-6 cursor-pointer" />
                        </div>
                    </div>
                )}

                {/* Navegación (Tabs) */}
                <div className="flex gap-6 mb-8 border-b border-white/10 overflow-x-auto custom-scrollbar pb-2">
                    <TabButton id="overview" label="Resumen" icon={<LayoutDashboard size={18} />} active={activeTab} onClick={setActiveTab} />
                    <TabButton id="orders" label="Pedidos" icon={<ClipboardList size={18} />} active={activeTab} onClick={setActiveTab} />
                    <TabButton id="products" label="Productos" icon={<Package size={18} />} active={activeTab} onClick={setActiveTab} />
                    <TabButton id="categories" label="Categorías" icon={<Layers size={18} />} active={activeTab} onClick={setActiveTab} />
                </div>

                {/* Contenido Dinámico */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'overview' && <DashboardStats />}
                    {activeTab === 'orders' && <OrdersTab orders={orders} refreshData={refreshData} />}
                    {activeTab === 'products' && <ProductsTab products={products} refreshData={refreshData} />}
                    {activeTab === 'categories' && <CategoriesTab categories={categories} refreshData={refreshData} />}
                </div>

            </main>

            {/* Modales Globales (como el QR) */}
            <QRGeneratorModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
        </div>
    );
}

// Subcomponente simple para los botones de Tabs
function TabButton({ id, label, icon, active, onClick }: any) {
    const isActive = active === id;
    return (
        <button
            onClick={() => onClick(id)}
            className={`pb-3 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap 
                ${isActive ? 'text-gold' : 'text-gray-500 hover:text-white'}`}
        >
            {icon} {label}
            {isActive && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
        </button>
    );
}