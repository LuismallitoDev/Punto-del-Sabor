import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Save, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Settings() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            addToast("La contraseña debe tener al menos 6 caracteres", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            addToast("Las contraseñas no coinciden", "error");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            addToast("Error al actualizar contraseña", "error");
            console.error(error);
        } else {
            addToast("¡Contraseña actualizada correctamente!", "success");
            setNewPassword('');
            setConfirmPassword('');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin/dashboard" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gold">Configuración de Cuenta</h1>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                </div>

                {/* Tarjeta de Seguridad */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <ShieldCheck className="text-gold" size={24} />
                        <h2 className="text-lg font-semibold">Seguridad</h2>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-gold focus:outline-none transition-colors"
                                    placeholder="Repite la contraseña"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || !newPassword}
                                className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                                    ${loading || !newPassword
                                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                        : 'bg-gold text-black hover:bg-white shadow-lg shadow-gold/10'}
                                `}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                {loading ? "Actualizando..." : "Guardar Nueva Contraseña"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-200 text-sm text-center">
                        ℹ️ Para crear nuevos administradores, por favor utiliza el panel principal de Supabase por seguridad.
                    </p>
                </div>

            </div>
        </div>
    );
}