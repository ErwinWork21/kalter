import React, { useState } from 'react';
import { Stethoscope, Home, Loader2, ArrowLeft } from 'lucide-react';
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
                    <button onClick={() => window.history.back()} className="mb-4 flex items-center text-sm text-gray-600 hover:text-[#C89F74] transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                    </button>
                    <div className="flex justify-center items-center mb-2">
                        <h1 className="text-2xl font-bold text-[#3e4a4f]">{title}</h1>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    </div>
);

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        const { error } = await authService.resetPassword(email);
        if (error) { 
            setError(error.message); 
            setLoading(false); 
            return; 
        }
        setMessage('Tautan reset password telah dikirim ke email Anda. Silakan periksa inbox atau folder spam.');
        setLoading(false);
    };

    return (
        <AuthFormContainer title="Lupa Password" goHome={() => navigate('/') }>
            <p className="text-center text-gray-600 text-sm mb-6">Masukkan email yang terdaftar untuk mengatur ulang password Anda.</p>
            <form onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-center text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}
                {message && <p className="text-green-600 text-center text-sm mb-4 bg-green-50 p-2 rounded">{message}</p>}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74]" placeholder="contoh@email.com" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#C89F74] hover:bg-[#b98e65] disabled:bg-[#b98e65] disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Mengirim...
                        </>
                    ) : (
                        'Kirim Tautan Reset'
                    )}
                </button>
            </form>
        </AuthFormContainer>
    );
}
