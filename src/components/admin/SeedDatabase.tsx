/*import { useState } from 'react';
import { products } from '../../data/products'; // Tu data local
import { supabase } from '../../lib/supabase';

export function SeedDatabase() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleUpload = async () => {
        setLoading(true);
        setStatus('Iniciando carga masiva...');

        try {
            for (const product of products) {
                setStatus(`Procesando: ${product.name}...`);

                // 1. Convertir la ruta de la imagen local a un archivo Blob
                // Vite resuelve los imports de imagen como rutas URL, así que hacemos fetch
                const response = await fetch(product.image);
                const blob = await response.blob();

                // 2. Subir imagen al Bucket 'menu-images'
                const fileName = `${product.id}-${Date.now()}.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from('menu-images')
                    .upload(fileName, blob);

                if (uploadError) throw uploadError;

                // 3. Obtener URL pública
                const { data: { publicUrl } } = supabase.storage
                    .from('menu-images')
                    .getPublicUrl(fileName);

                // 4. Insertar producto en la base de datos
                const { error: insertError } = await supabase
                    .from('products')
                    .insert({
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        category: product.category,
                        image: publicUrl, // Guardamos la URL de Supabase, no la local
                        is_popular: product.isPopular || false,
                        ingredients: product.ingredients || [],
                        calories: product.calories || 0,
                        active: true
                    });

                if (insertError) throw insertError;
            }

            setStatus('¡Éxito! Todos los productos han sido cargados a la nube.');
        } catch (error) {
            console.error(error);
            setStatus('Error: Revisa la consola para más detalles.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-zinc-900 text-white rounded-xl border border-white/10 max-w-md mx-auto mt-10 text-center">
            <h2 className="text-2xl font-bold text-gold mb-4">Panel de Carga Inicial</h2>
            <p className="text-gray-400 mb-6 text-sm">
                Este botón subirá tus {products.length} productos locales y sus imágenes a Supabase.
            </p>

            <div className="mb-4 text-xs font-mono bg-black p-2 rounded text-left h-24 overflow-y-auto">
                {status || "Esperando..."}
            </div>

            <button
                onClick={handleUpload}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-full font-bold uppercase tracking-widest transition-all
          ${loading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gold text-black hover:bg-white hover:scale-105'
                    }`}
            >
                {loading ? 'Subiendo...' : '🚀 Cargar Datos a Supabase'}
            </button>
        </div>
    );
} */