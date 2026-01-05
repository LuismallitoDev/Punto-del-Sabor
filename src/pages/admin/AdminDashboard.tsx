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
                        {/* Tarjeta 3: MODO DESCANSO / PROGRAMACIÓN */}
                        <div className={`p-4 rounded-xl border flex flex-col gap-4 transition-all col-span-1 md:col-span-2 lg:col-span-1 ${storeSettings.holiday_mode
                                ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-900/20'
                                : 'bg-[#111] border-white/10'
                            }`}>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${storeSettings.holiday_mode ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'
                                        }`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M17 14h-6" /><path d="M13 18H7" /></svg>
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${storeSettings.holiday_mode ? 'text-blue-400' : 'text-white'}`}>
                                            Aviso / Programación
                                        </h3>
                                        <p className="text-xs text-gray-500">Cierra la tienda manual o automáticamente.</p>
                                    </div>
                                </div>
                                {/* Switch Manual (Override) */}
                                <label className="relative inline-flex items-center cursor-pointer" title="Activar manualmente ahora mismo">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={storeSettings.holiday_mode}
                                        onChange={(e) => updateSettings({ holiday_mode: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                </label>
                            </div>

                            {/* Input Mensaje */}
                            <div>
                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1 block">Mensaje para el cliente</label>
                                <input
                                    type="text"
                                    defaultValue={storeSettings.holiday_message}
                                    onBlur={(e) => updateSettings({ holiday_message: e.target.value })}
                                    placeholder="Ej: Cerrado por festivo. Volvemos el Lunes."
                                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                                />
                            </div>

                            {/* --- SECCIÓN DE PROGRAMACIÓN (NUEVO) --- */}
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-3 flex justify-between items-center">
                                    Programar Cierre Automático
                                    {(storeSettings.holiday_start || storeSettings.holiday_end) && (
                                        <button
                                            onClick={() => updateSettings({ holiday_start: null, holiday_end: null })}
                                            className="text-red-400 hover:text-red-300 text-[10px] lowercase hover:underline"
                                        >
                                            borrar fecha
                                        </button>
                                    )}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-gray-400 mb-1 block">Desde (Inicio)</label>
                                        <input
                                            type="datetime-local"
                                            // Convertimos UTC de DB a formato local para el input
                                            value={storeSettings.holiday_start ? new Date(storeSettings.holiday_start).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => {
                                                // Guardamos como ISO String UTC
                                                const date = e.target.value ? new Date(e.target.value).toISOString() : null;
                                                updateSettings({ holiday_start: date });
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 text-xs text-white focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 mb-1 block">Hasta (Fin)</label>
                                        <input
                                            type="datetime-local"
                                            value={storeSettings.holiday_end ? new Date(storeSettings.holiday_end).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => {
                                                const date = e.target.value ? new Date(e.target.value).toISOString() : null;
                                                updateSettings({ holiday_end: date });
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded px-2 py-2 text-xs text-white focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-600 mt-2">
                                    * La tienda se mostrará "Cerrada" automáticamente entre estas fechas, sin importar si el switch de arriba está apagado.
                                </p>
                            </div>
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
                    {activeTab === 'products' && (
                        <ProductsTab
                            products={products}
                            categories={categories} // <--- AGREGAR ESTA LÍNEA
                            refreshData={refreshData}
                        />
                    )}
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