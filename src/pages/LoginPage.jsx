import React, { useState } from 'react';
import { Stethoscope, Home, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthFormContainer = ({ title, children, goHome }) => (
    <div className="min-h-screen bg-[#FDFBF6] font-sans">
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center cursor-pointer" onClick={goHome}>
                    <Stethoscope className="w-8 h-8 text-[#C89F74]" />
                    <h1 className="ml-3 text-xl font-bold text-[#3e4a4f]">Kalkulator Dokter</h1>
                </div>
                <button onClick={goHome} className="flex items-center px-4 py-2 bg-gray-100 text-[#3e4a4f] font-semibold rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-300 text-sm">
                    <Home className="w-4 h-4 mr-2" /> Beranda
                </button>
            </nav>
        </header>
        <div className="flex items-center justify-center p-4 pt-16">
            <div className="w-full max-w-md">
                <div className="bg-[#E0E7E1] p-6 sm:p-8 rounded-2xl shadow-lg">
                    <div className="flex justify-center items-center mb-4">
                        <h1 className="ml-3 text-2xl font-bold text-[#3e4a4f]">{title}</h1>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    </div>
);

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error } = await authService.signIn(email, password);
        if (error) { setError(error.message); setLoading(false); return; }
        navigate('/app');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <AuthFormContainer title="Login Akun" goHome={() => navigate('/') }>
            <form onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input onKeyDown={handleKeyDown} type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74]" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input onKeyDown={handleKeyDown} type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74]" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#C89F74] hover:bg-[#b98e65] disabled:bg-[#b98e65] disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        'Login'
                    )}
                </button>
                <p className="text-center text-gray-600 text-sm mt-6">
                    Belum punya akun? <button type="button" onClick={() => navigate('/register')} className="font-bold text-[#C89F74] hover:text-[#b98e65]">Daftar di sini</button>
                </p>
            </form>
        </AuthFormContainer>
    );
}
