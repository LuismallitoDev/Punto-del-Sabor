/**
 * Formatea un número a pesos colombianos (COP) sin decimales.
 * Ejemplo: 2000 -> $2.000
 */
export const formatCurrency = (value: number): string => {
    return value.toLocaleString('es-CO');
};