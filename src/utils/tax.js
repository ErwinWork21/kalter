export const ptkpRates = { 'TK/0': 54000000, 'K/0': 58500000, 'K/1': 63000000, 'K/2': 67500000, 'K/3': 72000000 };

export function calculatePph21(monthlyIncomes, ptkpStatus = 'TK/0') {
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const calculateProgressiveTax = (pkp) => {
        if (pkp <= 0) return 0;
        let tax = 0;
        if (pkp <= 60000000) tax = pkp * 0.05;
        else if (pkp <= 250000000) tax = (60000000 * 0.05) + ((pkp - 60000000) * 0.15);
        else if (pkp <= 500000000) tax = (60000000 * 0.05) + (190000000 * 0.15) + ((pkp - 250000000) * 0.25);
        else if (pkp <= 5000000000) tax = (60000000 * 0.05) + (190000000 * 0.15) + (250000000 * 0.25) + ((pkp - 500000000) * 0.30);
        else tax = (60000000 * 0.05) + (190000000 * 0.15) + (250000000 * 0.25) + (4500000000 * 0.30) + ((pkp - 5000000000) * 0.35);
        return tax;
    };
    const riwayat = [];
    let totalKreditPajak = 0;
    monthlyIncomes.forEach((incomes, index) => {
        const bruto = incomes.reduce((sum, income) => sum + income.amount, 0);
        const dpp = bruto * 0.5;
        const estimasiPph21Dipotong = calculateProgressiveTax(dpp);
        riwayat.push({ bulan: monthNames[index], penghasilanBruto: bruto, estimasiPph21Dipotong: estimasiPph21Dipotong });
        totalKreditPajak += estimasiPph21Dipotong;
    });
    const totalPenghasilanBruto = monthlyIncomes.flat().reduce((sum, income) => sum + income.amount, 0);
    const totalDppKumulatif = totalPenghasilanBruto * 0.5;
    const totalPajakSkemaA = calculateProgressiveTax(totalDppKumulatif);
    const estimasiKurangBayar = totalPajakSkemaA - totalKreditPajak;
    const penghasilanNeto = totalPenghasilanBruto * 0.5;
    const ptkp = ptkpRates[ptkpStatus] || 54000000;
    const penghasilanKenaPajak = Math.max(0, penghasilanNeto - ptkp);
    const pajakTerutangTahunan = calculateProgressiveTax(penghasilanKenaPajak);
    return {
        dashboard: {
            estimasiKurangBayar: estimasiKurangBayar,
            rincianTahunan: {
                totalPenghasilanBruto: totalPenghasilanBruto,
                ptkp: ptkp,
                penghasilanKenaPajak: penghasilanKenaPajak,
                pajakTerutangTahunan: pajakTerutangTahunan,
                totalKreditPajak: totalKreditPajak,
                sisaBayarTahunan: estimasiKurangBayar
            }
        },
        riwayat: riwayat
    };
}
