import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { Product } from '../types';

export const useProductForm = (
    productToEdit: Product | null,
    onSuccess: () => void,
    onClose: () => void
) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Estados del Formulario
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('empanadas');
    const [ingredients, setIngredients] = useState('');
    const [calories, setCalories] = useState('');
    const [isPopular, setIsPopular] = useState(false);

    // Estados de Imagen
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cargar datos al iniciar
    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setDescription(productToEdit.description);
            setPrice(productToEdit.price.toString());
            setCategory(productToEdit.category);
            setIngredients(productToEdit.ingredients?.join(', ') || '');
            setCalories(productToEdit.calories ? productToEdit.calories.toString() : '');
            setIsPopular(productToEdit.isPopular || false);
            setPreviewUrl(productToEdit.image);
        } else {
            resetForm();
        }
    }, [productToEdit]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('empanadas');
        setIngredients('');
        setCalories('');
        setIsPopular(false);
        setImageFile(null);
        setPreviewUrl('');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("¿Estás seguro de que quieres eliminar la imagen actual?")) {
            setImageFile(null);
            setPreviewUrl('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalImageUrl = previewUrl;

            // 1. Subir imagen si es nueva
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

            // 2. Objeto para DB
            const productData = {
                name,
                description,
                price: parseInt(price) || 0,
                category,
                image: finalImageUrl,
                ingredients: ingredients.split(',').map(i => i.trim()).filter(Boolean),
                calories: calories ? parseInt(calories) : 0,
                is_popular: isPopular,
                active: true
            };

            if (productToEdit) {
                const { error } = await supabase.from('products').update(productData).eq('id', productToEdit.id);
                if (error) throw error;
                addToast("Producto actualizado correctamente", "success");
            } else {
                const { error } = await supabase.from('products').insert(productData);
                if (error) throw error;
                addToast("Producto creado exitosamente", "success");
            }

            onSuccess();
            onClose();

        } catch (error) {
            console.error(error);
            addToast("Error al guardar el producto", "error");
        } finally {
            setLoading(false);
        }
    };

    return {
        formState: { name, description, price, category, ingredients, calories, isPopular, previewUrl },
        setters: { setName, setDescription, setPrice, setCategory, setIngredients, setCalories, setIsPopular },
        imageHandlers: { handleImageChange, handleRemoveImage, fileInputRef },
        loading,
        handleSubmit
    };
};