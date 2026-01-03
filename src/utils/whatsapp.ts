import { WHATSAPP_NUMBER } from '../config/constants';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface OrderDetails {
    address: string;
    paymentMethod: string;
    notes: string;
}

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

    // 2. Construimos el mensaje como texto normal primero
    const message = `Hola El Punto del Sabor, quiero confirmar el siguiente pedido:\n\n${itemsList}\n\n*TOTAL A PAGAR: $${totalFormatted}*\n\n--------------------------------\n*DATOS DE ENTREGA:*\n${customerInfo}`;

    // 3. LA CLAVE: encodeURIComponent "empaqueta" el texto para que # y & no rompan el link
    const encodedMessage = encodeURIComponent(message);

    const number = typeof WHATSAPP_NUMBER !== 'undefined' ? WHATSAPP_NUMBER : "573233353753";

    // 4. Creamos la URL segura
    const url = `https://wa.me/${number}?text=${encodedMessage}`;

    window.open(url, '_blank');
};