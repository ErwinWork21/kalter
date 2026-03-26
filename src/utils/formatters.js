/**
 * Format currency value to Indonesian Rupiah format
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string (e.g., "Rp 1.000.000")
 */
export const formatCurrency = (value) => {
  const numValue = value !== undefined && value !== null ? value : 0;
  return `Rp ${new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue)}`;
};

/**
 * Format number with Indonesian locale (without currency symbol)
 * @param {number} value - The value to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
  return new Intl.NumberFormat('id-ID').format(value || 0);
};

/**
 * Parse input string to number, removing non-numeric characters
 * @param {string} input - Input string that may contain formatting
 * @returns {number} Parsed number
 */
export const parseAmount = (input) => {
  if (typeof input === 'number') return input;
  if (typeof input !== 'string') return 0;
  return parseInt(input.replace(/[^0-9]/g, ''), 10) || 0;
};
