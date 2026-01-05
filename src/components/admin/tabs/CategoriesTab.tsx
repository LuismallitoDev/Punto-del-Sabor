import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Layers } from 'lucide-react';
import { Category } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../context/ToastContext';
import { CategoryFormModal } from '../CategoryFormModal';

interface CategoriesTabProps {
    categories: Category[];
    refreshData: () => void;
}

export function CategoriesTab({ categories, refreshData }: CategoriesTabProps) {
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Lógica para eliminar categoría
    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;

        const { error } = await supabase.from('categories').delete().eq('id', id);

        if (error) {
            addToast("Error al eliminar categoría", "error");
        } else {
            addToast("Categoría eliminada", "success");
            refreshData();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header de la Pestaña */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full md:w-96 opacity-50 pointer-events-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar categoría..."
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-500"
                    />
                </div>
                <button
                    onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
                    className="bg-gold text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase flex gap-2 items-center hover:bg-white transition-colors shadow-lg shadow-gold/10"
                >
                    <Plus size={16} /> Nueva Categoría
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-white">
                        <thead className="bg-white/5 text-xs uppercase text-gray-400 border-b border-white/10">
                            <tr>
                                <th className="p-4 w-1/3">Nombre</th>
                                <th className="p-4 w-1/3">Slug (ID)</th>
                                <th className="p-4 w-1/3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-500">No hay categorías creadas.</td>
                                </tr>
                            ) : (
                                categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 flex-shrink-0">
                                                    <Layers size={20} />
                                                </div>
                                                <span className="font-bold text-sm">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1.5 rounded-md text-xs font-mono bg-white/5 text-gold border border-white/10 select-all">
                                                {cat.slug}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                                                    className="p-2 hover:bg-blue-500/20 rounded text-blue-400 hover:text-blue-300 transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Categoría */}
            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categoryToEdit={editingCategory}
                onSuccess={refreshData}
            />
        </div>
    );
}