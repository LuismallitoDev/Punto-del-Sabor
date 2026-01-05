import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) console.error('Error cargando categorías:', error);
        else if (data) setCategories(data);

        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return { categories, loading, refreshCategories: fetchCategories };
};