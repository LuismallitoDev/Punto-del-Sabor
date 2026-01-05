import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/format';
import { LogOut, Plus, Search, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import Logo from '../../assets/Logotipo_Transparente.png';

export function AdminDashboard() {
    const { signOut, user } = useAuth();
    const { addToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados del Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // 1. Cargar Productos
    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: true }); // Ordenar por fecha de creación

        if (error) {
            console.error(error);
            addToast("Error cargando productos", "error");
        } else if (data) {
            // Mapeo manual para asegurar compatibilidad de tipos
            const mappedData: Product[] = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                image: item.image,
                isPopular: item.is_popular, // DB snake_case -> TS camelCase
                ingredients: item.ingredients,
                calories: item.calories,
                active: item.active
            }));
            setProducts(mappedData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // 2. Acciones Rápidas (Toggle Popular / Active / Delete)
    const togglePopular = async (product: Product) => {
        const newValue = !product.isPopular;
        // Optimistic UI Update (Actualizar visualmente antes de la DB para que se sienta rápido)
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isPopular: newValue } : p));

        await supabase.from('products').update({ is_popular: newValue }).eq('id', product.id);
        addToast(newValue ? "Marcado como Popular 🔥" : "Quitado de Populares", "info");
    };

    const toggleActive = async (product: Product) => {
        // Asumimos que tienes un campo 'active' en tu tipo Product. Si no, agrégalo al interface.
        const isActive = (product as any).active;
        const newValue = !isActive;

        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: newValue } : p));
        await supabase.from('products').update({ active: newValue }).eq('id', product.id);

        addToast(newValue ? "Producto Visible 👁️" : "Producto Oculto 🙈", "info");
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            addToast("Error al eliminar", "error");
        } else {
            setProducts(prev => prev.filter(p => p.id !== id));
            addToast("Producto eliminado", "success");
        }
    };

    // 3. Abrir Modales
    const handleNewProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    // Filtrado
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            {/* Navbar Admin */}
            <header className="border-b border-white/10 bg-[#111] sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src={Logo} alt="Logo" className="w-12" />
                        <div>
                            <h1 className="text-xl font-bold text-gold tracking-wide">Panel de Control</h1>
                            <p className="text-xs text-gray-500">Hola, {user?.email}</p>
                        </div>
                    </div>
                    <button onClick={signOut} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
                        <LogOut size={16} /> Salir
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">

                {/* Barra de Herramientas */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-sm focus:border-gold outline-none transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleNewProduct}
                        className="bg-gold text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-gold/20"
                    >
                        <Plus size={18} /> Nuevo Producto
                    </button>
                </div>

                {/* Tabla de Productos */}
                <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-widest text-gray-400">
                                    <th className="p-4">Producto</th>
                                    <th className="p-4">Categoría</th>
                                    <th className="p-4">Precio</th>
                                    <th className="p-4 text-center">Estado</th>
                                    <th className="p-4 text-center">Popular</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">Cargando inventario...</td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No se encontraron productos.</td></tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/50 border border-white/10">
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{product.name}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-white/10 text-gray-300 border border-white/5">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono text-gold">
                                                ${formatCurrency(product.price)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => toggleActive(product)} className="hover:scale-110 transition-transform">
                                                    {(product as any).active ? <Eye size={18} className="text-green-500" /> : <EyeOff size={18} className="text-red-500" />}
                                                </button>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => togglePopular(product)} className="hover:scale-110 transition-transform">
                                                    <Star size={18} className={product.isPopular ? "text-gold fill-gold" : "text-gray-600"} />
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEditProduct(product)} className="p-2 hover:bg-blue-500/20 rounded text-blue-400 hover:text-blue-300 transition-colors">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors">
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
            </main>

            {/* Modal de Crear/Editar */}
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productToEdit={editingProduct}
                onSuccess={fetchProducts}
            />
        </div>
    );
}