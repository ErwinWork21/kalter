import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { MONTH_NAMES, HOSPITAL_LIST, YEAR_NAMES } from '../constants/lists';
import IncomeEditor from '../components/IncomeEditor';
import Toast from '../components/Toast';
import { validateIncomesComplete } from '../utils/validation';
import { formatCurrency, parseAmount } from '../utils/formatters';
import { FileText, PlusCircle } from 'lucide-react';

export default function RiwayatPage() {
    const { savedData, monthlyIncomes, setMonthlyIncomes, handleSaveCalculation, selectedYear, setSelectedYear, allYearsData } = useOutletContext();
    const navigate = useNavigate();
    const [editingMonthIndex, setEditingMonthIndex] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorIndexes, setErrorIndexes] = useState([]);
    // Initialize currentYearIndex based on selectedYear from context, not just current year
    const [currentYearIndex, setCurrentYearIndex] = useState(() => {
        const yearIndex = YEAR_NAMES.findIndex(y => y === selectedYear);
        return yearIndex !== -1 ? yearIndex : YEAR_NAMES.findIndex(y => y === new Date().getFullYear().toString());
    });
    const isInternalYearChange = useRef(false);
    const prevSelectedYear = useRef(null); // Start as null to ensure first sync happens
    const prevCurrentYearIndex = useRef(currentYearIndex);
    const isMounted = useRef(false);

    // Get year-specific savedData - ensure it updates when selectedYear changes
    const yearSavedData = useMemo(() => {
        if (!selectedYear) return null;
        const yearData = allYearsData[selectedYear];
        return yearData?.savedData || null;
    }, [allYearsData, selectedYear]);

    // Update selectedYear when currentYearIndex changes (only if changed internally via dropdown)
    useEffect(() => {
        // Only update if currentYearIndex actually changed
        if (prevCurrentYearIndex.current !== currentYearIndex) {
            if (isInternalYearChange.current) {
                const yearStr = YEAR_NAMES[currentYearIndex];
                if (yearStr && yearStr !== selectedYear) {
                    // Update selectedYear when user changes the dropdown
                    setSelectedYear(yearStr);
                }
            }
            prevCurrentYearIndex.current = currentYearIndex;
        }
    }, [currentYearIndex, selectedYear, setSelectedYear]);

    // Sync year index with selectedYear (when changed externally or on mount)
    useEffect(() => {
        // On first mount, always sync
        if (!isMounted.current) {
            const yearIndex = YEAR_NAMES.findIndex(y => y === selectedYear);
            if (yearIndex !== -1 && yearIndex !== currentYearIndex) {
                setCurrentYearIndex(yearIndex);
                prevCurrentYearIndex.current = yearIndex;
            }
            prevSelectedYear.current = selectedYear;
            isMounted.current = true;
            return;
        }
        
        // Skip if selectedYear hasn't actually changed
        if (prevSelectedYear.current === selectedYear) return;
        
        // Only sync if the change was NOT initiated internally
        // (if it was internal, currentYearIndex is already correct)
        if (!isInternalYearChange.current) {
            const yearIndex = YEAR_NAMES.findIndex(y => y === selectedYear);
            if (yearIndex !== -1 && yearIndex !== currentYearIndex) {
                setCurrentYearIndex(yearIndex);
                prevCurrentYearIndex.current = yearIndex;
            }
        } else {
            // Reset the flag after handling the internal change
            isInternalYearChange.current = false;
        }
        prevSelectedYear.current = selectedYear;
    }, [selectedYear, currentYearIndex]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            return handleSaveCalculation(selectedYear);
        },
        onSuccess: () => {
            setEditingMonthIndex(null);
            setShowToast(true);
        }
    });

    const handleIncomeChange = (incomeIndex, field, value) => {
        if (editingMonthIndex === null) return;
        const newMonthlyIncomes = JSON.parse(JSON.stringify(monthlyIncomes));
        const currentIncome = newMonthlyIncomes[editingMonthIndex][incomeIndex];
        if (field === 'amount') {
            currentIncome.amount = parseAmount(value);
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
        if (editingMonthIndex === null) return;
        const newMonthlyIncomes = JSON.parse(JSON.stringify(monthlyIncomes));
        newMonthlyIncomes[editingMonthIndex].push({ hospital: '', source: '', amount: 0 });
        setMonthlyIncomes(newMonthlyIncomes);
    };

    const removeIncomeField = (incomeIndex) => {
        if (editingMonthIndex === null) return;
        const newMonthlyIncomes = JSON.parse(JSON.stringify(monthlyIncomes));
        if (newMonthlyIncomes[editingMonthIndex].length > 1) {
            newMonthlyIncomes[editingMonthIndex].splice(incomeIndex, 1);
            setMonthlyIncomes(newMonthlyIncomes);
        }
    };

    const handleSave = async () => {
        if (saveMutation.isPending) return;
        
        const validation = validateIncomesComplete(monthlyIncomes[editingMonthIndex]);
        if (!validation.isValid) {
            setErrorMessage(validation.errorMessage);
            setErrorIndexes(validation.errorIndexes);
            setShowError(true);
            return;
        }
        
        setErrorIndexes([]);
        await saveMutation.mutateAsync();
    };

    if (!yearSavedData) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="font-bold text-2xl">Riwayat Data Anda</h3>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Tahun:</label>
                        <select 
                            value={currentYearIndex} 
                            onChange={(e) => {
                                const newIndex = parseInt(e.target.value);
                                isInternalYearChange.current = true;
                                setCurrentYearIndex(newIndex);
                            }}
                            className="p-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74] text-sm"
                        >
                            {YEAR_NAMES.map((name, index) => (
                                <option key={index} value={index}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="mb-6 p-6 rounded-full bg-gray-100">
                        <FileText className="w-16 h-16 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-700 mb-2">Belum Ada Data untuk Tahun {YEAR_NAMES[currentYearIndex]}</h4>
                    <p className="text-gray-500 mb-6 max-w-md">
                        Belum ada data penghasilan yang disimulasikan untuk tahun {YEAR_NAMES[currentYearIndex]}. 
                        Mulai input data penghasilan bulanan Anda untuk melihat riwayat dan perhitungan pajak.
                    </p>
                    <Link
                        to="/app/input"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#C89F74] hover:bg-[#b98e65] text-white font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C89F74] focus:ring-offset-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Input Data Baru</span>
                    </Link>
                </div>
            </div>
        );
    }
    const { inputs } = yearSavedData;
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md" aria-busy={saveMutation.isPending}>
            <Toast 
                show={showToast} 
                message="Perubahan berhasil disimpan."
                type="success"
                duration={800}
                onClose={() => setShowToast(false)}
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="font-bold text-2xl mb-2">Riwayat Data Anda</h3>
                    <p className="text-gray-600 text-sm">Berikut adalah rincian data penghasilan yang telah Anda simpan untuk tahun {YEAR_NAMES[currentYearIndex]}.</p>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 font-medium">Tahun:</label>
                    <select 
                        value={currentYearIndex} 
                        onChange={(e) => {
                            const newIndex = parseInt(e.target.value);
                            isInternalYearChange.current = true;
                            setCurrentYearIndex(newIndex);
                        }}
                        className="p-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74] text-sm"
                    >
                        {YEAR_NAMES.map((name, index) => (
                            <option key={index} value={index}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Bulan</th>
                            <th scope="col" className="px-6 py-3">Rumah Sakit</th>
                            <th scope="col" className="px-6 py-3">Sumber Lain</th>
                            <th scope="col" className="px-6 py-3">Jumlah</th>
                            <th scope="col" className="px-6 py-3">Aksi</th>
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
                                    <td className="px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const monthIndex = MONTH_NAMES.indexOf(monthData.month);
                                                if (monthIndex >= 0) setEditingMonthIndex(monthIndex);
                                            }}
                                            className="px-3 py-1 rounded-md border text-[#3e4a4f] hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {editingMonthIndex !== null && (
                <div className="mt-6 p-4 border rounded-2xl bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg">Edit Bulan: {MONTH_NAMES[editingMonthIndex]}</h4>
                        <button 
                            type="button" 
                            onClick={() => {
                                setEditingMonthIndex(null);
                                setErrorIndexes([]);
                            }} 
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Tutup
                        </button>
                    </div>
                    <div className="space-y-4">
                        <IncomeEditor
                            incomes={monthlyIncomes[editingMonthIndex]}
                            hospitalList={HOSPITAL_LIST}
                            onChange={handleIncomeChange}
                            onAdd={addIncomeField}
                            onRemove={removeIncomeField}
                            errorIndexes={errorIndexes}
                        />
                        <button
                            type="button"
                            disabled={saveMutation.isPending}
                            onClick={handleSave}
                            className={`w-full mt-2 bg-[#C89F74] hover:bg-[#b98e65] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 ${saveMutation.isPending ? 'opacity-75 cursor-not-allowed hover:bg-[#C89F74]' : ''}`}
                        >
                            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            )}
            <div className="mt-6 p-4 bg-[#3e4a4f] text-white rounded-lg flex justify-between items-center">
                <span className="text-lg font-bold">Total Penghasilan Bruto Setahun ({YEAR_NAMES[currentYearIndex]})</span>
                <span className="text-2xl font-extrabold">{formatCurrency(yearSavedData.calculations.dashboard.rincianTahunan.totalPenghasilanBruto)}</span>
            </div>
        </div>
    );
}
