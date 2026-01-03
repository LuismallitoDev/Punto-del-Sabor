export type Category = 'empanadas' | 'fritos' | 'papas' | 'patacones' | 'bebidas' | 'all';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string; // Ahora es un string (URL/Path)
    isPopular?: boolean;
}