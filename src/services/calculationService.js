import { calculatePph21 } from '../utils/tax';
import { transformMonthlyIncomesToInputs } from '../utils/dataTransformers';
import { DEFAULT_PTKP_STATUS } from '../constants/taxRates';

/**
 * Calculation service
 * Handles tax calculation and data transformation
 */
export const calculationService = {
  /**
   * Calculate tax and prepare data for saving
   * @param {Array<Array<Object>>} monthlyIncomes - Monthly income data
   * @param {string} ptkpStatus - PTKP status
   * @returns {Object} Calculation result with calculations and inputs
   */
  calculateAndPrepareData(monthlyIncomes, ptkpStatus = DEFAULT_PTKP_STATUS) {
    const calculationResult = calculatePph21(monthlyIncomes, ptkpStatus);
    const inputs = transformMonthlyIncomesToInputs(monthlyIncomes);
    
    return {
      calculations: calculationResult,
      inputs: inputs
    };
  },

  /**
   * Calculate tax summary for dashboard
   * @param {Array<Array<Object>>} monthlyIncomes - Monthly income data
   * @param {string} ptkpStatus - PTKP status
   * @returns {Object} Dashboard summary
   */
  calculateDashboardSummary(monthlyIncomes, ptkpStatus = DEFAULT_PTKP_STATUS) {
    return calculatePph21(monthlyIncomes, ptkpStatus);
  }
};
