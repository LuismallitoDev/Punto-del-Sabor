import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Download,  } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import { useBlockScroll } from '../../utils/useBlockScroll';

interface QRGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function QRGeneratorModal({ isOpen, onClose }: QRGeneratorModalProps) {
    useBlockScroll(isOpen);
    const [tableNumber, setTableNumber] = useState('1');
    const qrRef = useRef<HTMLDivElement>(null);

    // URL Base de tu tienda (detecta automáticamente si estás en localhost o vercel)
    const baseUrl = window.location.origin;
    const qrValue = `${baseUrl}/?mesa=${tableNumber}`;

    const handleDownloadPDF = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a6' // Tamaño pequeño, ideal para mesas (105mm x 148mm)
        });

        // Diseño del PDF
        pdf.setFillColor(10, 10, 10); // Fondo negro (#0a0a0a)
        pdf.rect(0, 0, 105, 148, 'F'); // Rellenar todo el fondo

        pdf.setTextColor(197, 157, 95); // Color Dorado (#C59D5F)
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.text("MENÚ DIGITAL", 52.5, 20, { align: 'center' });

        // Imagen del QR
        pdf.addImage(imgData, 'PNG', 27.5, 40, 50, 50); // Centrado

        // Texto Mesa
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.text(`MESA ${tableNumber}`, 52.5, 100, { align: 'center' });

        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text("Escanea para ordenar", 52.5, 110, { align: 'center' });

        pdf.save(`QR-Mesa-${tableNumber}.pdf`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#111] border border-white/10 w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                            <h2 className="text-xl font-serif text-gold flex items-center gap-2">
                                <QrCode size={20} /> Generador de QR
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
                        </div>

                        {/* Contenido */}
                        <div className="p-8 flex flex-col items-center gap-6">

                            {/* Input Mesa */}
                            <div className="w-full">
                                <label className="text-xs uppercase text-gray-400 font-bold mb-2 block">Número de Mesa</label>
                                <input
                                    type="number"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-gold outline-none text-center font-bold text-lg"
                                    min="1"
                                />
                            </div>

                            {/* Preview Visual */}
                            <div className="bg-white p-4 rounded-lg shadow-lg" ref={qrRef}>
                                <QRCodeCanvas
                                    value={qrValue}
                                    size={200}
                                    level={"H"} // Alta corrección de errores
                                    includeMargin={true}
                                />
                            </div>
                            <p className="text-xs text-gray-500 font-mono text-center break-all">
                                {qrValue}
                            </p>

                            {/* Botón Descargar */}
                            <button
                                onClick={handleDownloadPDF}
                                className="w-full bg-gold text-black font-bold py-3 rounded-lg uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/10"
                            >
                                <Download size={20} /> Descargar PDF
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}