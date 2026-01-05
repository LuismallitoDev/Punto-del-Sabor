import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface StoreSettings {
    id: string;
    force_close: boolean;
    high_demand: boolean;
    delay_minutes: number;
}

export const useStoreSettings = () => {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Cargar estado inicial
        const fetchSettings = async () => {
            const { data } = await supabase.from('store_settings').select('*').single();
            if (data) setSettings(data);
            setLoading(false);
        };

        fetchSettings();

        // 2. Suscribirse a cambios en vivo (Realtime)
        const channel = supabase
            .channel('store_settings_changes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'store_settings' },
                (payload) => {
                    // Actualizar el estado inmediatamente
                    setSettings(payload.new as StoreSettings);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Función para que el Admin actualice los valores
    const updateSettings = async (updates: Partial<StoreSettings>) => {
        if (!settings) return;
        const { error } = await supabase
            .from('store_settings')
            .update(updates)
            .eq('id', settings.id);

        if (error) console.error("Error actualizando tienda:", error);
    };

    return { settings, loading, updateSettings };
};