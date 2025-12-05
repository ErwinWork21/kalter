export const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const currentYear = new Date().getFullYear();
export const yearNames = Array.from({ length: 7 }, (_, i) => 
    String(currentYear - 3 + i)
);

export const hospitalList = [
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


