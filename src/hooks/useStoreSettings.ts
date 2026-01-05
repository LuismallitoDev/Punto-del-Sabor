import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface StoreSettings {
    id: string;
    force_close: boolean;
    high_demand: boolean;
    delay_minutes: number;
    holiday_mode: boolean;
    holiday_message: string;
    holiday_start: string | null; 
    holiday_end: string | null;
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

        // 2. Suscribirse a cambios en vivo (Para sincronizar otras pestañas)
        const channel = supabase
            .channel('store_settings_changes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'store_settings' },
                (payload) => {
                    // Solo actualizamos si el cambio viene de afuera (para evitar conflictos con el optimista)
                    setSettings((current) => ({ ...current, ...payload.new } as StoreSettings));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // 3. Función optimista
    const updateSettings = async (updates: Partial<StoreSettings>) => {
        if (!settings) return;

        // A) COPIA DE SEGURIDAD (Por si falla)
        const oldSettings = { ...settings };

        // B) ACTUALIZACIÓN VISUAL INMEDIATA (Optimista) 🚀
        setSettings({ ...settings, ...updates });

        // C) ACTUALIZACIÓN EN BASE DE DATOS
        const { error } = await supabase
            .from('store_settings')
            .update(updates)
            .eq('id', settings.id);

        // D) REVERTIR SI HUBO ERROR (Rollback)
        if (error) {
            console.error("Error actualizando tienda:", error);
            setSettings(oldSettings); // Volvemos al estado anterior
            alert("No se pudo actualizar el estado. Revisa tu conexión.");
        }
    };

    return { settings, loading, updateSettings };
};