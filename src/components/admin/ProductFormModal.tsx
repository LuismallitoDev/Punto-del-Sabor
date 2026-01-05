import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { Product } from '../../types';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: Product | null; // Si viene null, es modo CREAR
    onSuccess: () => void; // Para recargar la tabla al guardar
}

export function ProductFormModal({ isOpen, onClose, productToEdit, onSuccess }: ProductFormModalProps) {
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    // Estados del Formulario
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('empanadas');
    const [ingredients, setIngredients] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Cargar datos si estamos EDITANDO
    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                setName(productToEdit.name);
                setDescription(productToEdit.description);
                setPrice(productToEdit.price.toString());
                setCategory(productToEdit.category);
                setIngredients(productToEdit.ingredients?.join(', ') || ''); // Array a String
                setPreviewUrl(productToEdit.image);
            } else {
                // Resetear si es NUEVO
                setName('');
                setDescription('');
                setPrice('');
                setCategory('empanadas');
                setIngredients('');
                setImageFile(null);
                setPreviewUrl('');
            }
        }
    }, [isOpen, productToEdit]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Previsualización local
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = previewUrl;

            // 1. Si hay nueva imagen, subirla a Supabase Storage
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('menu-images')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('menu-images')
                    .getPublicUrl(fileName);

                finalImageUrl = publicUrl;
            }

            // 2. Preparar el objeto para DB
            const productData = {
                name,
                description,
                price: parseInt(price),
                category,
                image: finalImageUrl,
                ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean), // String a Array
                is_popular: productToEdit?.isPopular || false, // Mantener estado anterior
                active: true
            };

            if (productToEdit) {
                // MODO EDICIÓN
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productToEdit.id);
                if (error) throw error;
                addToast("Producto actualizado correctamente", "success");
            } else {
                // MODO CREACIÓN
                const { error } = await supabase
                    .from('products')
                    .insert(productData);
                if (error) throw error;
                addToast("Producto creado exitosamente", "success");
            }

            onSuccess(); // Recargar tabla
            onClose();   // Cerrar modal

        } catch (error) {
            console.error(error);
            addToast("Error al guardar el producto", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-serif text-gold">
                                {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                        </div>

                        {/* Formulario con Scroll */}
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                            {/* Carga de Imagen */}
                            <div className="flex flex-col items-center gap-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-32 h-32 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-gold transition-colors overflow-hidden relative group"
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <Upload className="mx-auto mb-2" />
                                            <span className="text-xs">Subir Foto</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-white">Cambiar</span>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Nombre</label>
                                    <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none" placeholder="Ej: Empanada de Pollo" />
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Precio (COP)</label>
                                    <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none" placeholder="2000" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Descripción</label>
                                <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none resize-none" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Categoría</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none">
                                        <option value="empanadas">Empanadas</option>
                                        <option value="fritos">Fritos</option>
                                        <option value="papas">Papas</option>
                                        <option value="patacones">Patacones</option>
                                        <option value="bebidas">Bebidas</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Ingredientes (Separar por comas)</label>
                                    <input value={ingredients} onChange={e => setIngredients(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none" placeholder="Ej: Carne, Papa, Guiso" />
                                </div>
                            </div>
                        </form>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-4">
                            <button onClick={onClose} className="px-6 py-3 text-gray-400 hover:text-white transition-colors">Cancelar</button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-gold text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}