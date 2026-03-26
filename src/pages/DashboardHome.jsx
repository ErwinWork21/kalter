import React, { useMemo, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';
import SummaryPair from '../components/SummaryPair';
import { YEAR_NAMES, MONTH_NAMES_SHORT } from '../constants/lists';
import { formatCurrency } from '../utils/formatters';
import { DEFAULT_PTKP_STATUS } from '../constants/taxRates';
import { calculationService } from '../services/calculationService';

const MonthlyIncomeChart = ({ chartData, formatCurrency }) => (
    <div style={{ width: '100%', height: 300 }} className="mb-2">
        <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: 20, bottom: 15 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis width={66} tickMargin={6} tickFormatter={(val) => `${val / 1000000} Jt`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Penghasilan Bruto" fill="#C89F74" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

const EmptyChartState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-400">
        <BarChart2 className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-center text-sm sm:text-base">Belum ada data penghasilan bulanan.</p>
        <p className="text-center text-xs sm:text-sm mt-1">Silakan input data di menu "Input Data" untuk melihat grafik.</p>
    </div>
);

export default function DashboardHome() {
    const { selectedYear, setSelectedYear, allYearsData, monthlyIncomes, dashboardSummary: contextDashboardSummary } = useOutletContext();
    const [currentYearIndex, setCurrentYearIndex] = useState(() => {
        const currentYear = new Date().getFullYear().toString();
        return YEAR_NAMES.findIndex(y => y === currentYear);
    });

    // Get data for selected year
    const yearData = allYearsData[selectedYear];
    const yearMonthlyIncomes = yearData?.monthlyIncomes || monthlyIncomes;

    // Use context dashboard summary if available, otherwise calculate
    const calculatedSummary = useMemo(() =>
        calculationService.calculateDashboardSummary(yearMonthlyIncomes, DEFAULT_PTKP_STATUS),
        [yearMonthlyIncomes]
    );
    const dashboardSummary = contextDashboardSummary || calculatedSummary;

    const { dashboard, riwayat } = dashboardSummary;

    const chartData = useMemo(() =>
        MONTH_NAMES_SHORT.map((name, index) => ({
            name,
            "Penghasilan Bruto": riwayat[index] ? riwayat[index].penghasilanBruto : 0
        })),
        [riwayat]
    );

    const hasData = useMemo(() => chartData.some(item => item["Penghasilan Bruto"] > 0), [chartData]);

    useEffect(() => {
        const yearStr = YEAR_NAMES[currentYearIndex];
        if (yearStr) {
            setSelectedYear(yearStr);
        }
    }, [currentYearIndex, setSelectedYear]);

    const chartContent = hasData
        ? <MonthlyIncomeChart chartData={chartData} formatCurrency={formatCurrency} />
        : <EmptyChartState />;

    return (
        <div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8">
                <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-2 mb-4">
                    <h3 className="font-bold text-base sm:text-lg">Estimasi Kurang Bayar Tahun</h3>
                    <div className="flex items-center gap-2">
                        <select
                            value={currentYearIndex}
                            onChange={(e) => setCurrentYearIndex(parseInt(e.target.value))}
                            className="p-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89F74] text-sm"
                        >
                            {YEAR_NAMES.map((name, index) => (
                                <option key={index} value={index}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <p className={`text-2xl sm:text-3xl font-bold ${dashboard.estimasiKurangBayar >= 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(dashboard.estimasiKurangBayar)}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-md">
                    <h4 className="font-bold text-lg mb-4">Perbandingan Penghasilan Bulanan</h4>
                    {chartContent}
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
                    <h4 className="font-bold text-lg mb-4">Rincian Perhitungan Pajak Tahunan</h4>
                    <div className="space-y-3 text-sm">
                        <SummaryPair label="Total Penghasilan Bruto:" value={formatCurrency(dashboard.rincianTahunan.totalPenghasilanBruto)} />
                        <hr className="my-2 border-gray-200" />
                        <div className="hidden">
                            <SummaryPair label="Pajak Terutang (PPh 21):" value={formatCurrency(dashboard.rincianTahunan.pajakTerutangTahunan)} />
                        </div>
                        <SummaryPair label="Angsuran Pajak:" value={formatCurrency(dashboard.rincianTahunan.totalKreditPajak)} />
                        <hr className="my-3" />
                        <SummaryPair label="Sisa Kurang / Lebih Bayar:" value={formatCurrency(dashboard.rincianTahunan.sisaBayarTahunan)} isBold={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}
