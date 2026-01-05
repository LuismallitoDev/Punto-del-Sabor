import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el negocio está abierto en tiempo real.
 * Horario: 4:00 PM (16:00) - 10:00 PM (22:00)
 */
export const useBusinessHours = () => {
    const [isOpenNow, setIsOpenNow] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hour = now.getHours(); // 0 - 23
            // Abierto si es >= 16:00 Y < 22:00
            setIsOpenNow(hour >= 16 && hour < 22);
        };

        checkTime(); // Verificación inicial
        const interval = setInterval(checkTime, 60000); // Revisa cada minuto
        return () => clearInterval(interval);
    }, []);

    return { isOpenNow };
};