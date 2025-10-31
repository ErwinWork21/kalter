import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';
import SummaryPair from '../components/SummaryPair';

const MonthlyIncomeChart = ({ chartData, formatCurrency }) => (
    <div style={{ width: '100%', height: 300 }} className="mb-6">
        <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis width={66} tickMargin={6} tickFormatter={(val) => `${val/1000000} Jt`} />
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
    const { dashboardSummary } = useOutletContext();
    const formatCurrency = (value) => `Rp ${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value !== undefined ? value : 0)}`;
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]; 
    const { dashboard, riwayat } = dashboardSummary;
    const chartData = useMemo(() => monthNamesShort.map((name, index) => ({ name, "Penghasilan Bruto": riwayat[index] ? riwayat[index].penghasilanBruto : 0 })), [riwayat]);
    const hasData = useMemo(() => chartData.some(item => item["Penghasilan Bruto"] > 0), [chartData]);

    const chartContent = hasData 
        ? <MonthlyIncomeChart chartData={chartData} formatCurrency={formatCurrency} />
        : <EmptyChartState />;

    return (
        <div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md mb-8">
                <h3 className="font-bold text-base sm:text-lg mb-1">Estimasi Kurang Bayar Tahun Ini:</h3>
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
                        <SummaryPair label="Penghasilan Kena Pajak:" value={formatCurrency(dashboard.rincianTahunan.penghasilanKenaPajak)} />
                        <hr className="my-2 border-gray-200"/>
                        <SummaryPair label="Pajak Terutang (PPh 21):" value={formatCurrency(dashboard.rincianTahunan.pajakTerutangTahunan)} />
                        <SummaryPair label="Total Kredit Pajak:" value={formatCurrency(dashboard.rincianTahunan.totalKreditPajak)} />
                        <hr className="my-3"/>
                        <SummaryPair label="Sisa Kurang / Lebih Bayar:" value={formatCurrency(dashboard.rincianTahunan.sisaBayarTahunan)} isBold={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}
