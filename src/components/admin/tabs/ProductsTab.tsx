import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Star, Filter, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Category } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { formatCurrency } from '../../../utils/format';
import { useToast } from '../../../context/ToastContext';
import { ProductFormModal } from '../ProductFormModal';

interface ProductsTabProps {
    products: Product[];
    categories: Category[];
    refreshData: () => void;
}

export function ProductsTab({ products, categories, refreshData }: ProductsTabProps) {
    const { addToast } = useToast();

    // Estados de Filtro
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // <--- Estado del Dropdown

    // Refs
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Estados de Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lógica local de productos
    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar producto?")) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) { addToast("Producto eliminado", "success"); refreshData(); }
    };

    const toggleActive = async (product: Product) => {
        await supabase.from('products').update({ active: !product.active }).eq('id', product.id);
        refreshData();
    };

    const togglePopular = async (product: Product) => {
        await supabase.from('products').update({ is_popular: !product.isPopular }).eq('id', product.id);
        refreshData();
    };

    // --- LÓGICA DE FILTRADO ---
    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());

        // Comparamos el slug o value de la categoría
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Obtener nombre de la categoría seleccionada para mostrar en el botón
    const currentCategoryLabel = selectedCategory === 'all'
        ? 'Todas las Categorías'
        : categories.find(c => (c.slug || c.name) === selectedCategory)?.name || selectedCategory;

    return (
        <div className="space-y-6">

            {/* BARRA DE HERRAMIENTAS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

                <div className="flex flex-col md:flex-row w-full lg:w-auto gap-4 flex-1">
                    {/* Buscador */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:border-gold outline-none text-white transition-colors"
                        />
                    </div>

                    {/* --- DROPDOWN PERSONALIZADO --- */}
                    <div className="relative w-full md:w-64 z-20" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full border transition-all duration-300 bg-[#111]
                                ${isDropdownOpen ? 'border-gold shadow-lg shadow-gold/10' : 'border-white/10 hover:border-gold/50'}
                            `}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Filter size={16} className={isDropdownOpen ? 'text-gold' : 'text-gray-400'} />
                                <span className={`text-sm truncate ${selectedCategory !== 'all' ? 'text-gold font-medium' : 'text-gray-300'}`}>
                                    {currentCategoryLabel}
                                </span>
                            </div>
                            {isDropdownOpen ? <ChevronUp size={16} className="text-gold" /> : <ChevronDown size={16} className="text-gray-500" />}
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.ul
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar z-50 py-1"
                                >
                                    {/* Opción: Todas */}
                                    <li>
                                        <button
                                            onClick={() => { setSelectedCategory('all'); setIsDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors
                                                ${selectedCategory === 'all' ? 'bg-gold/10 text-gold' : 'text-gray-300 hover:bg-white/5'}
                                            `}
                                        >
                                            <span>Todas Las Categorías</span>
                                            {selectedCategory === 'all' && <Check size={14} />}
                                        </button>
                                    </li>

                                    {/* Separador */}
                                    <div className="h-px bg-white/5 my-1 mx-2" />

                                    {/* Lista Dinámica */}
                                    {categories.map((cat) => {
                                        const catValue = cat.slug || cat.name; // Usar lo que coincida con tu DB
                                        const isSelected = selectedCategory === catValue;
                                        return (
                                            <li key={cat.id}>
                                                <button
                                                    onClick={() => { setSelectedCategory(catValue); setIsDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors
                                                        ${isSelected ? 'bg-gold/10 text-gold' : 'text-gray-300 hover:bg-white/5'}
                                                    `}
                                                >
                                                    <span>{cat.name}</span>
                                                    {isSelected && <Check size={14} />}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* ------------------------------- */}
                </div>

                {/* Botón Nuevo */}
                <button
                    onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                    className="w-full md:w-auto bg-gold text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase flex gap-2 items-center justify-center hover:bg-white transition-colors shadow-lg shadow-gold/10 whitespace-nowrap"
                >
                    <Plus size={16} /> <span>Nuevo Producto</span>
                </button>
            </div>

            {/* TABLA DE PRODUCTOS */}
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
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-500">
                                            <Filter size={40} strokeWidth={1} />
                                            <p>No hay productos en esta categoría.</p>
                                            {selectedCategory !== 'all' && (
                                                <button
                                                    onClick={() => setSelectedCategory('all')}
                                                    className="text-gold text-xs uppercase font-bold hover:underline"
                                                >
                                                    Ver todos los productos
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(product => (
                                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/50 border border-white/10 flex-shrink-0 relative">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">N/A</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-white">{product.name}</p>
                                                    <p className="text-[10px] text-gray-500 truncate max-w-[150px] hidden sm:block">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-white/5 text-gray-400 border border-white/5 whitespace-nowrap">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-gold text-sm whitespace-nowrap">
                                            ${formatCurrency(product.price)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => toggleActive(product)} className="hover:scale-110 transition-transform">
                                                {product.active ? <Eye size={18} className="text-green-500" /> : <EyeOff size={18} className="text-red-500" />}
                                            </button>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => togglePopular(product)} className="hover:scale-110 transition-transform">
                                                <Star size={18} className={product.isPopular ? "text-gold fill-gold" : "text-gray-700"} />
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productToEdit={editingProduct}
                onSuccess={refreshData}
            />
        </div>
    );
}