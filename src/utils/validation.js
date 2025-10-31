/**
 * Validates that at least one income entry has an amount greater than 0
 * @param {Array} incomes - Array of income objects with amount property
 * @returns {boolean} - Returns true if at least one income has amount > 0
 */
export const validateIncomes = (incomes) => {
    if (!incomes || !Array.isArray(incomes)) return false;
    return incomes.some(income => income.amount > 0);
};

/**
 * Validates that income entries with hospital or source filled also have amount > 0
 * @param {Array} incomes - Array of income objects with hospital, source, and amount properties
 * @returns {{isValid: boolean, errorMessage: string|null, errorIndexes: number[]}} - Returns validation result with error message and indexes of entries with errors
 */
export const validateIncomesComplete = (incomes) => {
    if (!incomes || !Array.isArray(incomes)) {
        return {
            isValid: false,
            errorMessage: 'Data penghasilan tidak valid.',
            errorIndexes: []
        };
    }

    const errorIndexes = [];

    // Check if any entry has hospital or source filled but amount is 0 or empty
    incomes.forEach((income, index) => {
        const hasHospitalOrSource = (income.hospital && income.hospital.trim() !== '') || 
                                   (income.source && income.source.trim() !== '');
        if (hasHospitalOrSource && (!income.amount || income.amount <= 0)) {
            errorIndexes.push(index);
        }
    });

    if (errorIndexes.length > 0) {
        return {
            isValid: false,
            errorMessage: 'Harap isi jumlah (jumlah &gt; 0) untuk penghasilan yang telah diisi rumah sakit atau sumber penghasilannya.',
            errorIndexes
        };
    }

    // Check if at least one entry has amount > 0
    if (!incomes.some(income => income.amount > 0)) {
        // All entries need amount, so mark all indexes as errors
        return {
            isValid: false,
            errorMessage: 'Harap isi jumlah (jumlah &gt; 0) untuk minimal satu penghasilan sebelum menyimpan.',
            errorIndexes: incomes.map((_, index) => index)
        };
    }

    return {
        isValid: true,
        errorMessage: null,
        errorIndexes: []
    };
};

