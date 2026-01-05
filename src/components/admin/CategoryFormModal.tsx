import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { Category } from '../../types';
import { useBlockScroll } from '../../utils/useBlockScroll';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryToEdit?: Category | null;
    onSuccess: () => void;
}

export function CategoryFormModal({ isOpen, onClose, categoryToEdit, onSuccess }: CategoryFormModalProps) {
    const { addToast } = useToast();
    useBlockScroll(isOpen);

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    // Cargar datos al abrir
    useEffect(() => {
        if (isOpen) {
            if (categoryToEdit) {
                setName(categoryToEdit.name);
                setSlug(categoryToEdit.slug);
            } else {
                // Limpiar si es nuevo
                setName('');
                setSlug('');
            }
        }
    }, [isOpen, categoryToEdit]);

    // Generar Slug automáticamente al escribir el nombre
    const handleNameChange = (val: string) => {
        setName(val);
        // Solo autogeneramos si estamos creando uno nuevo
        if (!categoryToEdit) {
            const simpleSlug = val
                .toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, '-'); // Reemplaza espacios y raros por guiones
            setSlug(simpleSlug);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const categoryData = { name, slug };

            if (categoryToEdit) {
                // UPDATE
                const { error } = await supabase
                    .from('categories')
                    .update(categoryData)
                    .eq('id', categoryToEdit.id);
                if (error) throw error;
                addToast("Categoría actualizada", "success");
            } else {
                // INSERT
                const { error } = await supabase
                    .from('categories')
                    .insert(categoryData);
                if (error) throw error;
                addToast("Categoría creada", "success");
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            addToast("Error al guardar categoría (quizás el slug ya existe)", "error");
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
                        className="bg-[#111] border border-white/10 w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-serif text-gold">
                                {categoryToEdit ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">

                            <div>
                                <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Nombre</label>
                                <input
                                    required
                                    value={name}
                                    onChange={e => handleNameChange(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none focus:bg-white/10 transition-colors"
                                    placeholder="Ej: Postres"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Slug (ID para sistema)</label>
                                <input
                                    required
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none font-mono text-sm text-gray-400"
                                    placeholder="ej: postres"
                                />
                                <p className="text-[10px] text-gray-500 mt-1">Este identificador se usa internamente. Evita espacios.</p>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex justify-end gap-4 border-t border-white/10 mt-6">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm uppercase tracking-widest font-bold">Cancelar</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gold text-black px-6 py-2 rounded font-bold uppercase hover:bg-white flex items-center gap-2 text-sm tracking-widest"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}