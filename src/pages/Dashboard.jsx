import React, { useState, useEffect } from 'react';
import { BarChart2, FileText, User as UserIcon, LogIn } from 'lucide-react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { useCalculations } from '../hooks/useCalculations';
import DashboardSkeleton from '../components/DashboardSkeleton';
import NavItem from '../components/NavItem';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const {
    monthlyIncomes,
    setMonthlyIncomes,
    savedData,
    allYearsData,
    dashboardSummary,
    handleSaveCalculation,
    isLoading: calculationsLoading
  } = useCalculations(user?.id, selectedYear);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/');
  };

  if (authLoading || calculationsLoading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF6] font-sans text-gray-800">
      <div className="flex flex-col lg:flex-row">
        <aside className="bg-[#E0E7E1] w-full lg:w-64 p-4 lg:p-6 lg:min-h-screen flex flex-col">
          <div>
            <div className="flex items-center mb-8">
              <img src="/assets/kalter-logo-full.png" alt="Kalkulator Dokter" className="w-28" />
            </div>
            <nav className="flex flex-row lg:flex-col justify-around lg:justify-start lg:space-y-2">
              <NavLink to="/app/dashboard" className={({isActive}) => ''}>
                <NavItem 
                  icon={<BarChart2 />} 
                  label="Dashboard" 
                  isActive={location.pathname.endsWith('/dashboard')} 
                  onClick={() => {}} 
                />
              </NavLink>
              <NavLink to="/app/input" className={({isActive}) => ''}>
                <NavItem 
                  icon={<FileText />} 
                  label="Input Data" 
                  isActive={location.pathname.endsWith('/input')} 
                  onClick={() => {}} 
                />
              </NavLink>
              <NavLink to="/app/riwayat" className={({isActive}) => ''}>
                <NavItem 
                  icon={<UserIcon />} 
                  label="Riwayat" 
                  isActive={location.pathname.endsWith('/riwayat')} 
                  onClick={() => {}} 
                />
              </NavLink>
            </nav>
          </div>
          <div className="mt-auto pt-8">
            <p className="text-xs text-gray-500">User ID:</p>
            <p className="text-xs text-gray-500 break-words mb-4">{user?.id}</p>
            <button 
              onClick={handleLogout} 
              className="w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-red-100 text-red-700 flex items-center"
            >
              <LogIn className="w-5 h-5 mr-3 transform rotate-180"/>
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Halo, {user?.user_metadata?.displayName || user?.email || 'User'}!
              </h2>
              <p className="text-gray-500">Selamat datang kembali di dashboard Anda.</p>
            </div>
            <div className="flex items-center justify-center p-2 rounded-full bg-white shadow-sm self-end sm:self-center w-10 h-10">
              {
                user?.user_metadata?.displayName || user?.email ? (
                  <p className="text-sm font-bold">{user?.user_metadata?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}</p>
                ) : (
                  <UserIcon className="w-5 h-5 text-gray-600" />
                )
              }
            </div>
          </header>

          <Outlet 
            context={{ 
              monthlyIncomes, 
              setMonthlyIncomes, 
              savedData, 
              dashboardSummary, 
              handleSaveCalculation, 
              selectedYear, 
              setSelectedYear, 
              allYearsData 
            }} 
          />
        </main>
      </div>
    </div>
  );
}
