import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Logo from '../../assets/Logotipo_Transparente.png';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            addToast("Credenciales incorrectas", "error");
            setLoading(false);
        } else {
            addToast("¡Bienvenido Chef!", "success");
            navigate('/admin/dashboard'); // Redirigir al panel
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-black to-black -z-10" />

            <div className="w-full max-w-md bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <img src={Logo} alt="Logo" className="w-32 mb-4 opacity-90" />
                    <h2 className="text-2xl font-serif text-white tracking-wide">Acceso Administrativo</h2>
                    <p className="text-gray-500 text-sm mt-2">Ingresa tus credenciales para gestionar el menú</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold focus:outline-none transition-colors"
                            placeholder="admin@elpuntodelsabor.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gold mb-2 font-bold">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-gold focus:outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gold text-black font-bold py-3 rounded-lg uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
                        {loading ? "Verificando..." : "Ingresar"}
                    </button>
                </form>
            </div>
        </div>
    );
}