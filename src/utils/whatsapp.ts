import { WHATSAPP_NUMBER } from '../config/constants';
import type { CartItem } from '../context/CartContext';

interface OrderDetails {
    address: string;
    paymentMethod: string;
    notes: string;
}

// Generador genérico de links de WhatsApp
export const createWhatsAppLink = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const number = WHATSAPP_NUMBER || "573043538560";
    return `https://wa.me/${number}?text=${encodedMessage}`;
};

// Mensaje para venta mayorista (ProductModal)
export const getWholesaleMessage = (productName: string) => {
    return `Hola, estoy interesado en hacer un pedido mayorista de ${productName}. Me gustaría conocer más detalles.`;
};

// Función principal de envío de pedidos
export const sendOrderToWhatsapp = (items: CartItem[], details: OrderDetails) => {
    if (items.length === 0) return;

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const itemsList = items.map(item => {
        const subtotal = (item.price * item.quantity).toLocaleString('es-CO');
        return `• ${item.quantity}x ${item.name} ($${subtotal})`;
    }).join('\n');

    const customerInfo = [
        `📍 *Dirección:* ${details.address}`,
        `💳 *Método de Pago:* ${details.paymentMethod}`,
        details.notes ? `📝 *Observaciones:* ${details.notes}` : ''
    ].filter(Boolean).join('\n');

    const totalFormatted = total.toLocaleString('es-CO');

    const message = `Hola El Punto del Sabor, quiero confirmar el siguiente pedido:\n\n${itemsList}\n\n*TOTAL A PAGAR: $${totalFormatted}*\n\n--------------------------------\n*DATOS DE ENTREGA:*\n${customerInfo}`;

    window.open(createWhatsAppLink(message), '_blank');
};