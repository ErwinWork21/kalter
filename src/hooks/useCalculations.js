import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../services/dataService';
import { calculationService } from '../services/calculationService';
import { DEFAULT_PTKP_STATUS } from '../constants/taxRates';

/**
 * Custom hook for managing calculation data
 * @param {string} userId - User ID
 * @param {string} selectedYear - Currently selected year
 * @returns {Object} Calculation data and operations
 */
export function useCalculations(userId, selectedYear) {
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear().toString();
  
  const [allYearsData, setAllYearsData] = useState({});
  const [monthlyIncomes, setMonthlyIncomes] = useState(() => 
    dataService.getInitialMonthlyIncomes()
  );
  const [savedData, setSavedData] = useState(null);

  // Fetch calculations from database
  const calcQuery = useQuery({
    queryKey: ['calculations', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await dataService.fetchUserCalculations(userId);
      if (error) throw error;
      return data;
    }
  });

  // Normalize and set data when query completes
  useEffect(() => {
    const data = calcQuery.data;
    if (data) {
      const normalized = dataService.normalizeSavedData(data, currentYear);
      setAllYearsData(normalized);
    }
  }, [calcQuery.data, currentYear]);

  // Update monthly incomes and saved data when selected year changes
  useEffect(() => {
    const yearData = allYearsData[selectedYear];
    if (yearData) {
      setSavedData(yearData.savedData || null);
      setMonthlyIncomes(
        yearData.monthlyIncomes || dataService.getInitialMonthlyIncomes()
      );
    } else {
      setSavedData(null);
      setMonthlyIncomes(dataService.getInitialMonthlyIncomes());
    }
  }, [selectedYear, allYearsData]);

  // Mutation for saving calculations
  const saveMutation = useMutation({
    mutationFn: async ({ year, ptkpStatus = DEFAULT_PTKP_STATUS }) => {
      const targetYear = year || currentYear;
      const newSavedData = calculationService.calculateAndPrepareData(
        monthlyIncomes,
        ptkpStatus
      );
      
      // Update local state
      setSavedData(newSavedData);
      
      // Update all years data
      const updatedYears = {
        ...allYearsData,
        [targetYear]: {
          savedData: newSavedData,
          monthlyIncomes: monthlyIncomes
        }
      };
      
      setAllYearsData(updatedYears);
      
      // Save to database
      const { error } = await dataService.saveUserCalculations(userId, {
        years: updatedYears
      });
      
      if (error) throw error;
      return newSavedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculations', userId] });
    }
  });

  // Calculate dashboard summary
  const dashboardSummary = useMemo(() => {
    return calculationService.calculateDashboardSummary(
      monthlyIncomes,
      DEFAULT_PTKP_STATUS
    );
  }, [monthlyIncomes]);

  const handleSaveCalculation = async (year = null, ptkpStatus = DEFAULT_PTKP_STATUS) => {
    await saveMutation.mutateAsync({ year, ptkpStatus });
  };

  return {
    monthlyIncomes,
    setMonthlyIncomes,
    savedData,
    allYearsData,
    dashboardSummary,
    handleSaveCalculation,
    isLoading: calcQuery.isLoading,
    isSaving: saveMutation.isPending,
    error: calcQuery.error || saveMutation.error
  };
}

export default useCalculations;
