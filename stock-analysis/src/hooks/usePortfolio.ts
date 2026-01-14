import { useState, useEffect, useCallback } from 'react';
import { PortfolioEntry, Stock, StockPosition } from '../types';
import { portfolioApi, stocksApi } from '../services/api';
import { groupPortfolioByStock } from '../utils/portfolioUtils';
import { confirmAction, showError, CONFIRM_MESSAGES } from '../utils/uiUtils';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [stockPositions, setStockPositions] = useState<StockPosition[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch portfolio data
  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioApi.getAll();
      console.log('Portfolio API response:', response);
      
      // Ensure we have an array
      const portfolioData = Array.isArray(response.data) ? response.data : 
                           Array.isArray(response) ? response : [];
      
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Failed to fetch portfolio data');
      setPortfolio([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stocks data
  const fetchStocks = useCallback(async () => {
    try {
      console.log('Fetching stocks...');
      const response = await stocksApi.getAll();
      console.log('Stocks API response:', response);
      
      // Ensure we have an array
      const stocksData = Array.isArray(response.data) ? response.data : 
                        Array.isArray(response) ? response : [];
      
      setStocks(stocksData);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setError('Failed to fetch stocks data');
      setStocks([]); // Set empty array on error
    }
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback(async (id: number) => {
    const confirmed = await confirmAction(CONFIRM_MESSAGES.DELETE_TRANSACTION);
    if (confirmed) {
      try {
        await portfolioApi.delete(id);
        await fetchPortfolio(); // Refresh data
        return true;
      } catch (error) {
        console.error('Error deleting transaction:', error);
        setError('Error deleting transaction');
        return false;
      }
    }
    return false;
  }, [fetchPortfolio]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([fetchPortfolio(), fetchStocks()]);
  }, [fetchPortfolio, fetchStocks]);

  // Group portfolio entries into stock positions when portfolio changes
  useEffect(() => {
    console.log('Portfolio state changed:', portfolio);
    if (portfolio && Array.isArray(portfolio)) {
      const positions = groupPortfolioByStock(portfolio);
      setStockPositions(positions);
    } else {
      setStockPositions([]);
    }
  }, [portfolio, groupPortfolioByStock]);

  // Initial data fetch
  useEffect(() => {
    console.log('Portfolio hook initialized, fetching data...');
    refreshData();
  }, [refreshData]);

  return {
    // State
    portfolio,
    stockPositions,
    stocks,
    loading,
    error,
    
    // Actions
    fetchPortfolio,
    fetchStocks,
    deleteTransaction,
    refreshData,
  };
};

export default usePortfolio;