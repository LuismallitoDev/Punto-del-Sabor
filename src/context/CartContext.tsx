import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definición de un ítem en el carrito
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Definición del Contexto
interface CartContextType {
  cart: CartItem[];
  // CAMBIO AQUÍ: Ahora permitimos recibir 'quantity' opcionalmente
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Función para agregar al carrito
  const addToCart = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((prevCart) => {
      // Verificamos si el producto ya existe
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      // Si mandan cantidad (desde el modal), la usamos. Si no, sumamos 1.
      const qtyToAdd = product.quantity || 1;

      if (existingItem) {
        // Si existe, actualizamos la cantidad sumando lo nuevo
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      } else {
        // Si no existe, lo agregamos con la cantidad inicial
        return [...prevCart, { ...product, quantity: qtyToAdd }];
      }
    });
  };

  // Función para eliminar (o restar)
  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        // Si hay más de 1, restamos 1
        return prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      // Si queda 1, lo borramos del todo
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => setCart([]);

  // Cálculos derivados
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};