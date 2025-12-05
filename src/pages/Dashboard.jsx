import React, { useState, useMemo, useEffect } from 'react';
import { Stethoscope, BarChart2, FileText, User as UserIcon, LogIn, Trash2, PlusCircle } from 'lucide-react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardSkeleton from '../components/DashboardSkeleton';
import NavItem from '../components/NavItem';
import SummaryPair from '../components/SummaryPair';
import { calculatePph21 } from '../utils/tax';
import { yearNames } from '../constants/lists';

const hospitalList = [ "RSUPN Dr. Cipto Mangunkusumo (RSCM)", "RS Kanker Dharmais", "RS Jantung dan Pembuluh Darah Harapan Kita", "RS Pondok Indah - Pondok Indah", "RS Pondok Indah - Puri Indah", "RS Medistra", "Mayapada Hospital Jakarta Selatan", "Mayapada Hospital Kuningan", "RS Siloam Lippo Village", "RS Metropolitan Medical Centre (MMC)", "RS Premier Jatinegara", "RS Mitra Keluarga Kemayoran", "RS Columbia Asia Pulomas", "RS Abdi Waluyo", "RS YARSI" ];

function InputDataPage({ monthlyIncomes, setMonthlyIncomes, onSave }) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const handleIncomeChange = (incomeIndex, field, value) => {
        const newMonthlyIncomes = JSON.parse(JSON.stringify(monthlyIncomes));
        const currentIncome = newMonthlyIncomes[currentMonth][incomeIndex];
        if (field === 'amount') {
            const numberValue = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
            currentIncome.amount = numberValue;
        } else {
            currentIncome[field] = value; // do not reset the other field
        }
        setMonthlyIncomes(newMonthlyIncomes);
    };
    const addIncomeField = () => {
        const newMonthlyIncomes = JSON.parse(JSON.stringify(monthlyIncomes));
        newMonthlyIncomes[currentMonth].push({ hospital: '', source: '', amount: 0 });
        setMonthlyIncomes(newMonthlyIncomes);
    };
    const removeIncomeField = (incomeIndex) => {
        const newMonthlyIncomes = JSON.parse(JSON.stringify(monthlyIncomes));
        if (newMonthlyIncomes[currentMonth].length > 1) {
            newMonthlyIncomes[currentMonth].splice(incomeIndex, 1);
            setMonthlyIncomes(newMonthlyIncomes);
        }
    };
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="bg-white p-6 sm:p-8 rounded-2xl shadow-md max-w-2xl mx-auto">
            <h3 className="font-bold text-xl sm:text-2xl mb-6">Input Data Pajak Bulanan</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Bulan</label>
                    <select value={currentMonth} onChange={(e) => setCurrentMonth(parseInt(e.target.value))} className="w-full p-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74]">
                        {monthNames.map((name, index) => <option key={index} value={index}>{name}</option>)}
                    </select>
                </div>
                {monthlyIncomes[currentMonth].map((income, index) => (
                    <div key={index} className="relative p-4 border rounded-lg bg-gray-50/50">
                        {monthlyIncomes[currentMonth].length > 1 && (
                            <button type="button" onClick={() => removeIncomeField(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        )}
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold mb-1">Rumah Sakit</label>
                            <select value={income.hospital} onChange={e => handleIncomeChange(index, 'hospital', e.target.value)} className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C89F74]">
                                <option value="">-- Pilih dari Daftar RS --</option>
                                {hospitalList.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Sumber Penghasilan</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input type="text" placeholder="Deskripsi (jika bukan dari daftar RS)" value={income.source} onChange={e => handleIncomeChange(index, 'source', e.target.value)} className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C89F74]" />
                                <input type="text" placeholder="Jumlah" value={income.amount > 0 ? new Intl.NumberFormat('id-ID').format(income.amount) : ''} onChange={e => handleIncomeChange(index, 'amount', e.target.value)} className="w-full sm:w-1/2 p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#C89F74] text-right" />
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addIncomeField} className="w-full p-2 text-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition flex items-center justify-center gap-2">
                    <PlusCircle size={16} /> Tambah Penghasilan
                </button>
                <button type="submit" className="w-full mt-4 bg-[#C89F74] hover:bg-[#b98e65] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300">
                    Simulasikan & Simpan
                </button>
            </div>
        </form>
    );
}

function RiwayatPage({ savedData }) {
    const formatCurrency = (value) => `Rp ${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value || 0)}`;
    if (!savedData) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-md text-center">
                <h3 className="font-bold text-2xl mb-4">Riwayat Data Anda</h3>
                <p className="text-gray-500">Belum ada data yang disimulasikan. Silakan isi data di menu "Input Data" terlebih dahulu.</p>
            </div>
        );
    }
    const { inputs } = savedData;
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="font-bold text-2xl mb-6">Riwayat Data Anda</h3>
            <p className="text-gray-600 mb-4 text-sm">Berikut adalah rincian data penghasilan yang telah Anda simpan.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Bulan</th>
                            <th scope="col" className="px-6 py-3">Rumah Sakit</th>
                            <th scope="col" className="px-6 py-3">Sumber Lain</th>
                            <th scope="col" className="px-6 py-3">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inputs.flatMap(monthData =>
                            monthData.entries.map((entry, index) => (
                                <tr key={`${monthData.month}-${index}`} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{monthData.month}</td>
                                    <td className="px-6 py-4">{entry.hospital || "-"}</td>
                                    <td className="px-6 py-4">{entry.source || "-"}</td>
                                    <td className="px-6 py-4 font-semibold">{formatCurrency(entry.amount)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 p-4 bg-[#3e4a4f] text-white rounded-lg flex justify-between items-center">
                <span className="text-lg font-bold">Total Penghasilan Bruto Setahun</span>
                <span className="text-2xl font-extrabold">{formatCurrency(savedData.calculations.dashboard.rincianTahunan.totalPenghasilanBruto)}</span>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [supabaseUser, setSupabaseUser] = useState(null);
    const [monthlyIncomes, setMonthlyIncomes] = useState(() => Array(12).fill(null).map(() => [{ hospital: '', source: '', amount: 0 }]));
    const [ptkpStatus] = useState('TK/0');
    const [savedData, setSavedData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [allYearsData, setAllYearsData] = useState({});

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            const u = data?.user || null;
            if (!u) {
                navigate('/login');
                return;
            }
            setSupabaseUser(u);
        });
    }, [navigate]);

    const calcQuery = useQuery({
        queryKey: ['calculations', supabaseUser?.id],
        enabled: !!supabaseUser,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('calculations')
                .select('saved_data')
                .eq('user_id', supabaseUser.id)
                .maybeSingle();
            if (error) throw error;
            return data;
        }
    });

    useEffect(() => {
        const data = calcQuery.data;
        if (data?.saved_data) {
            const s = data.saved_data;
            // Support both old format (backward compatibility) and new year-based format
            if (s.years) {
                // New format: year-based data
                setAllYearsData(s.years);
            } else {
                // Old format: backward compatibility - migrate to new format
                const currentYear = new Date().getFullYear().toString();
                const migratedYears = {
                    [currentYear]: {
                        savedData: s.savedData || null,
                        monthlyIncomes: s.monthlyIncomes || Array(12).fill(null).map(() => [{ hospital: '', source: '', amount: 0 }])
                    }
                };
                setAllYearsData(migratedYears);
            }
        }
    }, [calcQuery.data]);

    useEffect(() => {
        const yearData = allYearsData[selectedYear];
        if (yearData) {
            setSavedData(yearData.savedData || null);
            if (yearData.monthlyIncomes) {
                setMonthlyIncomes(yearData.monthlyIncomes);
            } else {
                setMonthlyIncomes(Array(12).fill(null).map(() => [{ hospital: '', source: '', amount: 0 }]));
            }
        } else {
            setSavedData(null);
            setMonthlyIncomes(Array(12).fill(null).map(() => [{ hospital: '', source: '', amount: 0 }]));
        }
    }, [selectedYear, allYearsData]);

    const upsertMutation = useMutation({
        mutationFn: async (payload) => {
            return supabase
                .from('calculations')
                .upsert({ user_id: supabaseUser.id, saved_data: payload, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['calculations', supabaseUser?.id] });
        }
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleSaveCalculation = async (year = null) => {
        const currentYear = year || new Date().getFullYear().toString();
        const calculationResult = calculatePph21(monthlyIncomes, ptkpStatus);
        const rawInputs = monthlyIncomes
            .map((incomes, index) => ({
                month: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][index],
                entries: incomes.filter(inc => inc.amount > 0)
            }))
            .filter(monthData => monthData.entries.length > 0);
        const newSavedData = { calculations: calculationResult, inputs: rawInputs };
        setSavedData(newSavedData);
        
        // Get existing data to preserve other years
        const existingYears = { ...allYearsData };
        
        // Update the specific year's data
        const updatedYears = {
            ...existingYears,
            [currentYear]: {
                savedData: newSavedData,
                monthlyIncomes: monthlyIncomes
            }
        };
        
        setAllYearsData(updatedYears);
        const payload = { years: updatedYears };
        upsertMutation.mutate(payload);
    };

    const dashboardSummary = useMemo(() => calculatePph21(monthlyIncomes, ptkpStatus), [monthlyIncomes, ptkpStatus]);
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]; 
    const { dashboard, riwayat } = dashboardSummary;
    const chartData = useMemo(() => monthNamesShort.map((name, index) => ({ name, "Penghasilan Bruto": riwayat[index] ? riwayat[index].penghasilanBruto : 0 })), [riwayat]);
    const formatCurrency = (value) => `Rp ${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value !== undefined ? value : 0)}`;

    if (calcQuery.isLoading || !supabaseUser) return <DashboardSkeleton />;

    return (
        <div className="min-h-screen bg-[#FDFBF6] font-sans text-gray-800">
            <div className="flex flex-col lg:flex-row">
                <aside className="bg-[#E0E7E1] w-full lg:w-64 p-4 lg:p-6 lg:min-h-screen flex flex-col">
                    <div>
                        <div className="flex items-center mb-8">
                            <Stethoscope className="w-10 h-10 text-[#3e4a4f]" />
                            <h1 className="ml-3 text-xl font-bold text-[#3e4a4f]">Kalkulator Dokter</h1>
                        </div>
                        <nav className="flex flex-row lg:flex-col justify-around lg:justify-start lg:space-y-2">
                            <NavLink to="/app/dashboard" className={({isActive}) => ''}>
                                <NavItem icon={<BarChart2 />} label="Dashboard" isActive={location.pathname.endsWith('/dashboard')} onClick={() => {}} />
                            </NavLink>
                            <NavLink to="/app/input" className={({isActive}) => ''}>
                                <NavItem icon={<FileText />} label="Input Data" isActive={location.pathname.endsWith('/input')} onClick={() => {}} />
                            </NavLink>
                            <NavLink to="/app/riwayat" className={({isActive}) => ''}>
                                <NavItem icon={<UserIcon />} label="Riwayat" isActive={location.pathname.endsWith('/riwayat')} onClick={() => {}} />
                            </NavLink>
                        </nav>
                    </div>
                    <div className="mt-auto pt-8">
                        <p className="text-xs text-gray-500">User ID:</p>
                        <p className="text-xs text-gray-500 break-words mb-4">{supabaseUser?.id}</p>
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-red-100 text-red-700 flex items-center">
                            <LogIn className="w-5 h-5 mr-3 transform rotate-180"/>
                            <span className="font-semibold">Logout</span>
                        </button>
                    </div>
                </aside>
                <main className="flex-1 p-4 sm:p-6 md:p-8">
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Halo, {supabaseUser?.user_metadata?.displayName || supabaseUser?.email || 'User'}!</h2>
                            <p className="text-gray-500">Selamat datang kembali di dashboard Anda.</p>
                        </div>
                        <div className="flex items-center p-2 rounded-full bg-white shadow-sm self-end sm:self-center">
                            <UserIcon className="w-8 h-8 text-gray-600" />
                        </div>
                    </header>

                    <Outlet context={{ monthlyIncomes, setMonthlyIncomes, savedData, dashboardSummary, handleSaveCalculation, selectedYear, setSelectedYear, allYearsData }} />
                </main>
            </div>
        </div>
    );
}
