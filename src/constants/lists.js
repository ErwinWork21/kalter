/**
 * Month names in Indonesian
 */
export const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

/**
 * Short month names for charts and displays
 */
export const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

/**
 * Generate year names array (current year ± 3 years)
 */
const getCurrentYear = () => new Date().getFullYear();
const currentYear = getCurrentYear();

// change the length to 5 to show 5 years of data which starts from 3 years from current year
// for example, if current year is 2025, and the length is 5, then the year names will be 2022, 2023, 2024, 2025, 2026
export const YEAR_NAMES = Array.from({ length: 5 }, (_, i) => 
  String(currentYear - 3 + i)
);

/**
 * Hospital list for income source selection
 */
export const HOSPITAL_LIST = [
  "RSUPN Dr. Cipto Mangunkusumo (RSCM)",
  "RS Kanker Dharmais",
  "RS Jantung dan Pembuluh Darah Harapan Kita",
  "RS Pondok Indah - Pondok Indah",
  "RS Pondok Indah - Puri Indah",
  "RS Medistra",
  "Mayapada Hospital Jakarta Selatan",
  "Mayapada Hospital Kuningan",
  "RS Siloam Lippo Village",
  "RS Metropolitan Medical Centre (MMC)",
  "RS Premier Jatinegara",
  "RS Mitra Keluarga Kemayoran",
  "RS Columbia Asia Pulomas",
  "RS Abdi Waluyo",
  "RS YARSI"
];

// Legacy exports for backward compatibility
export const monthNames = MONTH_NAMES;
export const yearNames = YEAR_NAMES;
export const hospitalList = HOSPITAL_LIST;
