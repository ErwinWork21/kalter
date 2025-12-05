import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import IncomeEditor from '../components/IncomeEditor';
import Toast from '../components/Toast';
import { validateIncomesComplete } from '../utils/validation';
import { hospitalList as sharedHospitalList, monthNames as sharedMonthNames, yearNames as sharedYearNames } from '../constants/lists';

// using shared lists from constants

export default function InputDataPage() {
    const { monthlyIncomes, setMonthlyIncomes, handleSaveCalculation } = useOutletContext();
    const [searchParams] = useSearchParams();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(3); // Index 3 is the current year (3 years back + current = index 3)
    const monthNamesLocal = sharedMonthNames;
    const yearNamesLocal = sharedYearNames;
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorIndexes, setErrorIndexes] = useState([]);

    useEffect(() => {
        const monthParam = searchParams.get('month');
        if (monthParam !== null) {
            const monthIndex = parseInt(monthParam, 10);
            if (monthIndex >= 0 && monthIndex < 12) {
                setCurrentMonth(monthIndex);
            }
        }
    }, [searchParams]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            return handleSaveCalculation();
        },
        onSuccess: () => {
            setShowToast(true);
        }
    });

    const handleIncomeChange = (incomeIndex, field, value) => {
        const newMonthlyIncomes = JSON.parse(JSON.stringify(monthlyIncomes));
        const currentIncome = newMonthlyIncomes[currentMonth][incomeIndex];
        if (field === 'amount') {
            const numberValue = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
            currentIncome.amount = numberValue;
        } else {
            currentIncome[field] = value;
        }
        setMonthlyIncomes(newMonthlyIncomes);
        // Clear error for this specific entry if it was previously marked as error
        if (errorIndexes.includes(incomeIndex)) {
            const newErrorIndexes = errorIndexes.filter(idx => idx !== incomeIndex);
            setErrorIndexes(newErrorIndexes);
            if (newErrorIndexes.length === 0) {
                setShowError(false);
                setErrorMessage('');
            }
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saveMutation.isPending) return;
        
        const validation = validateIncomesComplete(monthlyIncomes[currentMonth]);
        if (!validation.isValid) {
            setErrorMessage(validation.errorMessage);
            setErrorIndexes(validation.errorIndexes);
            setShowError(true);
            return;
        }
        
        setErrorIndexes([]);
        await saveMutation.mutateAsync();
    };

    return (
        <>
        <Toast 
            show={showToast} 
            message="Data berhasil disimpan."
            type="success"
            duration={500}
            onClose={() => {
                setShowToast(false);
                navigate('/app/riwayat');
            }}
        />
        <Toast 
            show={showError} 
            message={errorMessage}
            type="error"
            duration={3000}
            onClose={() => {
                setShowError(false);
                setErrorMessage('');
                setErrorIndexes([]);
            }}
        />
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-md max-w-2xl mx-auto" aria-busy={saveMutation.isPending}>
            <h3 className="font-bold text-xl sm:text-2xl mb-6">Input Data Pajak Bulanan</h3>
            <div className="space-y-4 w-full">
                <div className='flex gap-2 w-full'>
                    <div className='flex flex-1 flex-col gap-1'>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Bulan</label>
                        <select value={currentMonth} onChange={(e) => setCurrentMonth(parseInt(e.target.value))} className="w-full p-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74]">
                            {monthNamesLocal.map((name, index) => <option key={index} value={index}>{name}</option>)}
                        </select>
                    </div>
                    <div className='flex flex-1 flex-col gap-1'>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tahun</label>
                        <select value={currentYear} onChange={(e) => setCurrentYear(parseInt(e.target.value))} className="w-full p-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74]">
                            {yearNamesLocal.map((name, index) => <option key={index} value={index}>{name}</option>)}
                        </select>
                    </div>
                </div>
                <IncomeEditor
                    incomes={monthlyIncomes[currentMonth]}
                    hospitalList={sharedHospitalList}
                    onChange={handleIncomeChange}
                    onAdd={addIncomeField}
                    onRemove={removeIncomeField}
                    errorIndexes={errorIndexes}
                />
                <button type="submit" disabled={saveMutation.isPending} aria-live="polite" className={`w-full mt-4 bg-[#C89F74] hover:bg-[#b98e65] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 ${saveMutation.isPending ? 'opacity-75 cursor-not-allowed hover:bg-[#C89F74]' : ''}`}>
                    {saveMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            Menyimpan...
                        </span>
                    ) : (
                        'Simulasikan & Simpan'
                    )}
                </button>
            </div>
        </form>
        </>
    );
}
