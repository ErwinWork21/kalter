import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { monthNames as sharedMonthNames, hospitalList as sharedHospitalList } from '../constants/lists';
import IncomeEditor from '../components/IncomeEditor';

export default function RiwayatPage() {
    const { savedData, monthlyIncomes, setMonthlyIncomes, handleSaveCalculation } = useOutletContext();
    const navigate = useNavigate();
    const monthNames = sharedMonthNames;
    const [editingMonthIndex, setEditingMonthIndex] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const formatCurrency = (value) => `Rp ${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value || 0)}`;

    const saveMutation = useMutation({
        mutationFn: async () => {
            return handleSaveCalculation();
        },
        onSuccess: () => {
            setEditingMonthIndex(null);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 800);
        }
    });

    const handleIncomeChange = (incomeIndex, field, value) => {
        if (editingMonthIndex === null) return;
        const newMonthlyIncomes = JSON.parse(JSON.stringify(monthlyIncomes));
        const currentIncome = newMonthlyIncomes[editingMonthIndex][incomeIndex];
        if (field === 'amount') {
            const numberValue = parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
            currentIncome.amount = numberValue;
        } else {
            currentIncome[field] = value;
        }
        setMonthlyIncomes(newMonthlyIncomes);
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
        <div className="bg-white p-6 rounded-2xl shadow-md" aria-busy={saveMutation.isPending}>
            {showToast && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
                    Perubahan berhasil disimpan.
                </div>
            )}
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
                                                const monthIndex = monthNames.indexOf(monthData.month);
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
                        <h4 className="font-bold text-lg">Edit Bulan: {monthNames[editingMonthIndex]}</h4>
                        <button type="button" onClick={() => setEditingMonthIndex(null)} className="text-gray-500 hover:text-gray-700">Tutup</button>
                    </div>
                    <div className="space-y-4">
                        <IncomeEditor
                            incomes={monthlyIncomes[editingMonthIndex]}
                            hospitalList={sharedHospitalList}
                            onChange={handleIncomeChange}
                            onAdd={addIncomeField}
                            onRemove={removeIncomeField}
                        />
                        <button
                            type="button"
                            disabled={saveMutation.isPending}
                            onClick={async () => { if (saveMutation.isPending) return; await saveMutation.mutateAsync(); }}
                            className={`w-full mt-2 bg-[#C89F74] hover:bg-[#b98e65] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 ${saveMutation.isPending ? 'opacity-75 cursor-not-allowed hover:bg-[#C89F74]' : ''}`}
                        >
                            {saveMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            )}
            <div className="mt-6 p-4 bg-[#3e4a4f] text-white rounded-lg flex justify-between items-center">
                <span className="text-lg font-bold">Total Penghasilan Bruto Setahun</span>
                <span className="text-2xl font-extrabold">{formatCurrency(savedData.calculations.dashboard.rincianTahunan.totalPenghasilanBruto)}</span>
            </div>
        </div>
    );
}
