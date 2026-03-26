/**
 * PTKP (Penghasilan Tidak Kena Pajak) rates
 * Based on Indonesian tax regulations
 */
export const PTKP_RATES = {
  'TK/0': 54000000,
  'K/0': 58500000,
  'K/1': 63000000,
  'K/2': 67500000,
  'K/3': 72000000
};

/**
 * Progressive tax brackets for PPh 21 calculation
 */
export const TAX_BRACKETS = [
  { max: 60000000, rate: 0.05 },
  { max: 250000000, rate: 0.15 },
  { max: 500000000, rate: 0.25 },
  { max: 5000000000, rate: 0.30 },
  { max: Infinity, rate: 0.35 }
];

/**
 * Default PTKP status
 */
export const DEFAULT_PTKP_STATUS = 'TK/0';
