// src/components/admin/tabs/ProductsTab.tsx
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { Product } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { formatCurrency } from '../../../utils/format';
import { useToast } from '../../../context/ToastContext';
import { ProductFormModal } from '../ProductFormModal';

interface ProductsTabProps {
    products: Product[];
    refreshData: () => void;
}

export function ProductsTab({ products, refreshData }: ProductsTabProps) {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Lógica local de productos
    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar producto?")) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) { addToast("Producto eliminado", "success"); refreshData(); }
    };

    const toggleActive = async (product: Product) => {
        await supabase.from('products').update({ active: !product.active }).eq('id', product.id);
        refreshData(); // O actualización optimista
    };

    const togglePopular = async (product: Product) => {
        await supabase.from('products').update({ is_popular: !product.isPopular }).eq('id', product.id);
        refreshData();
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text" placeholder="Buscar producto..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:border-gold outline-none text-white"
                    />
                </div>
                <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-gold text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase flex gap-2 items-center hover:bg-white transition-colors">
                    <Plus size={16} /> Nuevo Producto
                </button>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-white">
                        <thead className="bg-white/5 text-xs uppercase text-gray-400 border-b border-white/10">
                            <tr>
                                <th className="p-4">Producto</th>
                                <th className="p-4">Categoría</th>
                                <th className="p-4">Precio</th>
                                <th className="p-4 text-center">Visible</th>
                                <th className="p-4 text-center">Popular</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(product => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover bg-white/10" />
                                        <div><p className="font-bold text-sm">{product.name}</p></div>
                                    </td>
                                    <td className="p-4"><span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-white/5 text-gray-400 border border-white/5">{product.category}</span></td>
                                    <td className="p-4 font-mono text-gold text-sm">${formatCurrency(product.price)}</td>
                                    <td className="p-4 text-center"><button onClick={() => toggleActive(product)}>{product.active ? <Eye size={18} className="text-green-500" /> : <EyeOff size={18} className="text-red-500" />}</button></td>
                                    <td className="p-4 text-center"><button onClick={() => togglePopular(product)}><Star size={18} className={product.isPopular ? "text-gold fill-gold" : "text-gray-700"} /></button></td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} productToEdit={editingProduct} onSuccess={refreshData} />
        </div>
    );
}