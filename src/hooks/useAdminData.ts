// src/hooks/useAdminData.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category, Order } from '../types';
import { useToast } from '../context/ToastContext';

export function useAdminData() {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Productos
            const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (prodData) {
                // Mapeo para asegurar tipos (snake_case -> camelCase si es necesario)
                const mappedProducts = prodData.map((item: any) => ({
                    ...item,
                    isPopular: item.is_popular // Mapeo manual si tu tipo usa camelCase pero la DB snake_case
                }));
                setProducts(mappedProducts);
            }

            // 2. Categorías
            const { data: catData } = await supabase.from('categories').select('*').order('name');
            if (catData) setCategories(catData);

            // 3. Ordenes
            const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50);
            if (orderData) setOrders(orderData);

        } catch (error) {
            console.error("Error fetching data:", error);
            addToast("Error al cargar datos", "error");
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        products,
        categories,
        orders,
        loading,
        refreshData: fetchData,
        setProducts, // Exponemos setters para actualizaciones optimistas
        setOrders
    };
}