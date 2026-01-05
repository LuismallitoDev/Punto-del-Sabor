import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save } from 'lucide-react';
import { Product } from '../../types';
import { useBlockScroll } from '../../hooks/useBlockScroll';

// Importamos las piezas separadas
import { useProductForm } from '../../hooks/useProductForm';
import { ImageUploader } from './ImageUploader'; // Asumiendo que los pones en la misma carpeta o ajusta ruta
import { CategoryDropdown } from './CategoryDropdown';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: Product | null;
    onSuccess: () => void;
}

export function ProductFormModal({ isOpen, onClose, productToEdit, onSuccess }: ProductFormModalProps) {
    useBlockScroll(isOpen);

    // 1. Invocamos el Hook de Lógica
    const {
        formState,
        setters,
        imageHandlers,
        loading,
        handleSubmit
    } = useProductForm(productToEdit ?? null, onSuccess, onClose);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        className="bg-[#111] border border-white/10 w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-serif text-gold">
                                {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                            <div className="flex flex-col md:flex-row gap-8">

                                {/* COMPONENTE DE IMAGEN */}
                                <ImageUploader
                                    previewUrl={formState.previewUrl}
                                    fileInputRef={imageHandlers.fileInputRef}
                                    onImageChange={imageHandlers.handleImageChange}
                                    onRemoveImage={imageHandlers.handleRemoveImage}
                                    isPopular={formState.isPopular}
                                    setIsPopular={setters.setIsPopular}
                                />

                                {/* CAMPOS DE TEXTO */}
                                <div className="w-full md:w-2/3 space-y-5">

                                    <div>
                                        <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Nombre</label>
                                        <input required value={formState.name} onChange={e => setters.setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none focus:bg-white/10 transition-colors" placeholder="Ej: Empanada de Pollo" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Precio (COP)</label>
                                            <input required type="number" value={formState.price} onChange={e => setters.setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none focus:bg-white/10 transition-colors" placeholder="2000" />
                                        </div>
                                        <div>
                                            <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Calorías (Aprox)</label>
                                            <input type="number" value={formState.calories} onChange={e => setters.setCalories(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none focus:bg-white/10 transition-colors" placeholder="Ej: 350" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Categoría</label>

                                        {/* COMPONENTE DE DROPDOWN */}
                                        <CategoryDropdown
                                            value={formState.category}
                                            onChange={setters.setCategory}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Descripción</label>
                                        <textarea required value={formState.description} onChange={e => setters.setDescription(e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none resize-none focus:bg-white/10 transition-colors" />
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Ingredientes (Separar por comas)</label>
                                        <input value={formState.ingredients} onChange={e => setters.setIngredients(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none focus:bg-white/10 transition-colors" placeholder="Ej: Carne, Papa, Guiso" />
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end gap-4">
                            <button onClick={onClose} className="px-6 py-3 text-gray-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">Cancelar</button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-gold text-black px-8 py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-gold/20"
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