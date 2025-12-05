import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';

export default function IncomeEditor({ incomes, hospitalList, onChange, onAdd, onRemove, errorIndexes = [] }) {
    return (
        <div className="space-y-4">
            {incomes.map((income, index) => {
                const hasError = errorIndexes.includes(index);
                const errorBorderClass = hasError ? 'border-red-500 border-2' : 'border';
                
                return (
                    <div key={index} className={`relative p-4 ${errorBorderClass} rounded-lg bg-white`}>
                        {incomes.length > 1 && (
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold mb-1">Rumah Sakit</label>
                            <select
                                value={income.hospital}
                                onChange={e => onChange(index, 'hospital', e.target.value)}
                                className={`w-full p-2 ${hasError ? 'border-red-500 border-2' : 'border'} rounded-lg bg-white focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-[#C89F74]'}`}
                            >
                                <option value="">-- Pilih dari Daftar RS --</option>
                                {hospitalList.map(h => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1">Sumber Penghasilan</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    placeholder="Ex: Spesialis Anak"
                                    value={income.source}
                                    onChange={e => onChange(index, 'source', e.target.value)}
                                    className={`w-full p-2 ${hasError ? 'border-red-500 border-2' : 'border'} rounded-lg bg-white focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-[#C89F74]'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Penghasilan Bruto"
                                    value={income.amount > 0 ? new Intl.NumberFormat('id-ID').format(income.amount) : ''}
                                    onChange={e => onChange(index, 'amount', e.target.value)}
                                    className={`w-full sm:w-1/2 p-2 ${hasError ? 'border-red-500 border-2' : 'border'} rounded-lg bg-white focus:outline-none focus:ring-2 ${hasError ? 'focus:ring-red-500' : 'focus:ring-[#C89F74]'} text-right`}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
            <button
                type="button"
                onClick={onAdd}
                className="w-full p-2 text-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
                <PlusCircle size={16} /> Tambah Penghasilan
            </button>
        </div>
    );
}


