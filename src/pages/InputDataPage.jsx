import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import IncomeEditor from '../components/IncomeEditor';
import { hospitalList as sharedHospitalList, monthNames as sharedMonthNames } from '../constants/lists';

// using shared lists from constants

export default function InputDataPage() {
    const { monthlyIncomes, setMonthlyIncomes, handleSaveCalculation } = useOutletContext();
    const [searchParams] = useSearchParams();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const monthNamesLocal = sharedMonthNames;
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

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
            setTimeout(() => {
                setShowToast(false);
                navigate('/app/riwayat');
            }, 500);
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
        <>
        {showToast && (
            <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
                Data berhasil disimpan.
            </div>
        )}
        <form onSubmit={async (e) => { e.preventDefault(); if (saveMutation.isPending) return; await saveMutation.mutateAsync(); }} className="bg-white p-6 sm:p-8 rounded-2xl shadow-md max-w-2xl mx-auto" aria-busy={saveMutation.isPending}>
            <h3 className="font-bold text-xl sm:text-2xl mb-6">Input Data Pajak Bulanan</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Bulan</label>
                    <select value={currentMonth} onChange={(e) => setCurrentMonth(parseInt(e.target.value))} className="w-full p-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74]">
                        {monthNamesLocal.map((name, index) => <option key={index} value={index}>{name}</option>)}
                    </select>
                </div>
                <IncomeEditor
                    incomes={monthlyIncomes[currentMonth]}
                    hospitalList={sharedHospitalList}
                    onChange={handleIncomeChange}
                    onAdd={addIncomeField}
                    onRemove={removeIncomeField}
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
