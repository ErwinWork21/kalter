import { PTKP_RATES, TAX_BRACKETS, DEFAULT_PTKP_STATUS } from '../constants/taxRates';
import { MONTH_NAMES } from '../constants/lists';

/**
 * Calculate progressive tax based on PKP (Penghasilan Kena Pajak)
 * @param {number} pkp - Taxable income
 * @returns {number} Calculated tax amount
 */
export function calculateProgressiveTax(pkp) {
  if (pkp <= 0) return 0;

  let tax = 0;
  let remainingPkp = pkp;

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];
    const previousMax = i > 0 ? TAX_BRACKETS[i - 1].max : 0;
    const bracketRange = Math.min(bracket.max - previousMax, remainingPkp);

    if (bracketRange > 0) {
      tax += bracketRange * bracket.rate;
      remainingPkp -= bracketRange;
    }

    if (remainingPkp <= 0) break;
  }

  return tax;
}

/**
 * Calculate PPh 21 tax for monthly incomes
 * @param {Array<Array<Object>>} monthlyIncomes - Array of 12 months, each containing income entries
 * @param {string} ptkpStatus - PTKP status (default: 'TK/0')
 * @returns {Object} Calculation results with dashboard summary and monthly history
 */
export function calculatePph21(monthlyIncomes, ptkpStatus = DEFAULT_PTKP_STATUS) {
  const riwayat = [];
  let totalKreditPajak = 0;

  // Calculate monthly tax credits
  monthlyIncomes.forEach((incomes, index) => {
    const bruto = incomes.reduce((sum, income) => sum + income.amount, 0);
    const dpp = bruto * 0.5; // 50% of gross income
    const estimasiPph21Dipotong = calculateProgressiveTax(dpp);
    
    riwayat.push({
      bulan: MONTH_NAMES[index],
      penghasilanBruto: bruto,
      estimasiPph21Dipotong: estimasiPph21Dipotong
    });
    
    totalKreditPajak += estimasiPph21Dipotong;
  });

  // Calculate annual totals
  const totalPenghasilanBruto = monthlyIncomes.flat().reduce((sum, income) => sum + income.amount, 0);
  const totalDppKumulatif = totalPenghasilanBruto * 0.5;
  const totalPajakSkemaA = calculateProgressiveTax(totalDppKumulatif);
  const estimasiKurangBayar = totalPajakSkemaA - totalKreditPajak;

  // Calculate annual tax obligation
  const penghasilanNeto = totalPenghasilanBruto * 0.5;
  const ptkp = PTKP_RATES[ptkpStatus] || PTKP_RATES[DEFAULT_PTKP_STATUS];
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
