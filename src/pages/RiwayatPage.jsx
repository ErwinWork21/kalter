import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function RiwayatPage() {
    const { savedData } = useOutletContext();
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
