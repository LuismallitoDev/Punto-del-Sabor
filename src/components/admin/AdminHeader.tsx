// src/components/admin/AdminHeader.tsx
import { Link } from 'react-router-dom';
import { LogOut, Settings as SettingsIcon, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/Logotipo_Transparente.png';

interface AdminHeaderProps {
    onOpenQR: () => void;
}

export function AdminHeader({ onOpenQR }: AdminHeaderProps) {
    const { signOut } = useAuth();

    return (
        <header className="border-b border-white/10 bg-[#111] sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img src={Logo} alt="Logo" className="w-12 opacity-90" />
                    <h1 className="text-xl font-bold text-gold tracking-wide hidden md:block">Panel de Control</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onOpenQR} className="p-2 text-gold hover:bg-gold/10 rounded-full transition-colors" title="Generar QR">
                        <QrCode size={20} />
                    </button>
                    <Link to="/admin/settings" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                        <SettingsIcon size={20} />
                    </Link>
                    <button onClick={signOut} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 ml-2 border-l border-white/10 pl-4">
                        <LogOut size={16} /> <span className="hidden md:inline">Salir</span>
                    </button>
                </div>
            </div>
        </header>
    );
}