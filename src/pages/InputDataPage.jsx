import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Trash2, PlusCircle } from 'lucide-react';

const hospitalList = [ "RSUPN Dr. Cipto Mangunkusumo (RSCM)", "RS Kanker Dharmais", "RS Jantung dan Pembuluh Darah Harapan Kita", "RS Pondok Indah - Pondok Indah", "RS Pondok Indah - Puri Indah", "RS Medistra", "Mayapada Hospital Jakarta Selatan", "Mayapada Hospital Kuningan", "RS Siloam Lippo Village", "RS Metropolitan Medical Centre (MMC)", "RS Premier Jatinegara", "RS Mitra Keluarga Kemayoran", "RS Columbia Asia Pulomas", "RS Abdi Waluyo", "RS YARSI" ];

export default function InputDataPage() {
    const { monthlyIncomes, setMonthlyIncomes, handleSaveCalculation } = useOutletContext();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

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
        <form onSubmit={(e) => { e.preventDefault(); handleSaveCalculation(); }} className="bg-white p-6 sm:p-8 rounded-2xl shadow-md max-w-2xl mx-auto">
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
