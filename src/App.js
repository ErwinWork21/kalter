import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import InputDataPage from './pages/InputDataPage';
import RiwayatPage from './pages/RiwayatPage';
import { useSupabaseSession } from './auth/useSupabaseSession';

export default function App() {
    const { session, loading } = useSupabaseSession();
    if (loading) return null;
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/app" element={session ? <Dashboard /> : <Navigate to="/login" replace />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="input" element={<InputDataPage />} />
                <Route path="riwayat" element={<RiwayatPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

