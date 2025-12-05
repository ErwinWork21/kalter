import { supabase } from '../api/supabase';
import { createInitialMonthlyIncomes, migrateToYearBasedFormat } from '../utils/dataTransformers';

/**
 * Data service
 * Handles all data persistence operations with Supabase
 */
export const dataService = {
  /**
   * Fetch user's calculation data
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async fetchUserCalculations(userId) {
    const { data, error } = await supabase
      .from('calculations')
      .select('saved_data')
      .eq('user_id', userId)
      .maybeSingle();
    
    return { data, error };
  },

  /**
   * Save or update user's calculation data
   * @param {string} userId - User ID
   * @param {Object} savedData - Data to save
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async saveUserCalculations(userId, savedData) {
    return await supabase
      .from('calculations')
      .upsert(
        {
          user_id: userId,
          saved_data: savedData,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );
  },

  /**
   * Process and normalize saved data from database
   * @param {Object} dbData - Raw data from database
   * @param {string} currentYear - Current year string
   * @returns {Object} Normalized years data
   */
  normalizeSavedData(dbData, currentYear) {
    if (!dbData?.saved_data) {
      return {};
    }

    const s = dbData.saved_data;

    // Support both old format (backward compatibility) and new year-based format
    if (s.years) {
      // New format: year-based data
      return s.years;
    } else {
      // Old format: backward compatibility - migrate to new format
      return migrateToYearBasedFormat(s, currentYear).years;
    }
  },

  /**
   * Get initial monthly incomes structure
   * @returns {Array<Array<Object>>} Initial monthly incomes
   */
  getInitialMonthlyIncomes() {
    return createInitialMonthlyIncomes();
  }
};
