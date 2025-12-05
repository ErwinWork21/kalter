import { MONTH_NAMES } from '../constants/lists';

/**
 * Transform monthly incomes array to input format for saving
 * @param {Array<Array<Object>>} monthlyIncomes - Array of 12 months with income entries
 * @returns {Array<Object>} Transformed input data with month names and filtered entries
 */
export const transformMonthlyIncomesToInputs = (monthlyIncomes) => {
  return monthlyIncomes
    .map((incomes, index) => ({
      month: MONTH_NAMES[index],
      entries: incomes.filter(inc => inc.amount > 0)
    }))
    .filter(monthData => monthData.entries.length > 0);
};

/**
 * Create initial monthly incomes structure (12 months, each with one empty entry)
 * @returns {Array<Array<Object>>} Initial monthly incomes structure
 */
export const createInitialMonthlyIncomes = () => {
  return Array(12).fill(null).map(() => [
    { hospital: '', source: '', amount: 0 }
  ]);
};

/**
 * Migrate old data format to new year-based format
 * @param {Object} oldData - Old format data
 * @param {string} currentYear - Current year string
 * @returns {Object} New format data with years structure
 */
export const migrateToYearBasedFormat = (oldData, currentYear) => {
  return {
    years: {
      [currentYear]: {
        savedData: oldData.savedData || null,
        monthlyIncomes: oldData.monthlyIncomes || createInitialMonthlyIncomes()
      }
    }
  };
};
