import React, { useState, useEffect } from 'react';
import { Stethoscope, Home, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { supabase } from '../api/supabase';

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
                    <div className="flex justify-center items-center mb-6">
                        <h1 className="text-2xl font-bold text-[#3e4a4f]">{title}</h1>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    </div>
);

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionChecked, setSessionChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase passes the recovery token in the URL hash, which it handles automatically
        // We just need to check if we have a valid session to update password
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Not authenticated or recovery link invalid, redirect to login
                navigate('/login');
            } else {
                setSessionChecked(true);
            }
        };

        checkSession();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Password tidak cocok');
            return;
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        setLoading(true);
        const { error } = await authService.updatePassword(password);
        if (error) { 
            setError(error.message); 
            setLoading(false); 
            return; 
        }
        
        setMessage('Password berhasil diubah! Anda akan dialihkan ke halaman utama...');
        setLoading(false);
        
        setTimeout(() => {
            navigate('/app');
        }, 2000);
    };

    if (!sessionChecked) return null;

    return (
        <AuthFormContainer title="Atur Ulang Password" goHome={() => navigate('/') }>
            <form onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-center text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}
                {message && <p className="text-green-600 text-center text-sm mb-4 bg-green-50 p-2 rounded">{message}</p>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password Baru</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74]" />
                </div>
                
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password Baru</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74]" />
                </div>

                <button type="submit" disabled={loading || message} className="w-full bg-[#C89F74] hover:bg-[#b98e65] disabled:bg-[#b98e65] disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        'Simpan Password Baru'
                    )}
                </button>
            </form>
        </AuthFormContainer>
    );
}
