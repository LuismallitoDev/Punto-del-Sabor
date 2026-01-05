import { CartItem } from "../context/CartContext";

export interface Category {
    id: string;
    name: string;
    slug: string; // 'papas', 'bebidas', etc.
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isPopular?: boolean;
    ingredients?: string[];
    calories?: number;
    active?: boolean;
}



export interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    customer_phone?: string;
    delivery_type: 'domicilio' | 'recoger';
    address?: string;
    payment_method: 'nequi' | 'efectivo' | 'bancolombia';
    items: CartItem[]; // Reutilizamos tu tipo CartItem si existe, o any[]
    total: number;
    status: string;
}
