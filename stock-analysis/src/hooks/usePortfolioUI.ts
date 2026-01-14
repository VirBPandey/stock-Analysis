import { useState, useCallback } from 'react';

export const usePortfolioUI = () => {
  const [expandedStocks, setExpandedStocks] = useState<{[stockId: number]: boolean}>({});
  const [expandedBuyTables, setExpandedBuyTables] = useState<{[stockId: number]: boolean}>({});
  const [expandedSellTables, setExpandedSellTables] = useState<{[stockId: number]: boolean}>({});
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{stockId: number, stockName: string} | null>(null);

  // Toggle stock expansion
  const toggleStockExpansion = useCallback((stockId: number) => {
    setExpandedStocks(prev => ({
      ...prev,
      [stockId]: !prev[stockId]
    }));
  }, []);

  // Toggle buy table expansion
  const toggleBuyTable = useCallback((stockId: number) => {
    setExpandedBuyTables(prev => ({
      ...prev,
      [stockId]: !prev[stockId]
    }));
  }, []);

  // Toggle sell table expansion
  const toggleSellTable = useCallback((stockId: number) => {
    setExpandedSellTables(prev => ({
      ...prev,
      [stockId]: !prev[stockId]
    }));
  }, []);

  // Expand all tables for a stock
  const expandAllTables = useCallback((stockId: number) => {
    setExpandedBuyTables(prev => ({ ...prev, [stockId]: true }));
    setExpandedSellTables(prev => ({ ...prev, [stockId]: true }));
  }, []);

  // Collapse all tables for a stock
  const collapseAllTables = useCallback((stockId: number) => {
    setExpandedBuyTables(prev => ({ ...prev, [stockId]: false }));
    setExpandedSellTables(prev => ({ ...prev, [stockId]: false }));
  }, []);

  // Expand all stocks
  const expandAllStocks = useCallback((stockIds: number[]) => {
    const expanded = stockIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
    setExpandedStocks(prev => ({ ...prev, ...expanded }));
  }, []);

  // Collapse all stocks
  const collapseAllStocks = useCallback(() => {
    setExpandedStocks({});
  }, []);

  // Target modal handlers
  const openTargetModal = useCallback((stockId: number, stockName: string) => {
    setSelectedStock({ stockId, stockName });
    setShowTargetModal(true);
  }, []);

  const closeTargetModal = useCallback(() => {
    setShowTargetModal(false);
    setSelectedStock(null);
  }, []);

  return {
    // State
    expandedStocks,
    expandedBuyTables,
    expandedSellTables,
    showTargetModal,
    selectedStock,
    
    // Stock expansion actions
    toggleStockExpansion,
    expandAllStocks,
    collapseAllStocks,
    
    // Table expansion actions
    toggleBuyTable,
    toggleSellTable,
    expandAllTables,
    collapseAllTables,
    
    // Modal actions
    openTargetModal,
    closeTargetModal
  };
};

export default usePortfolioUI;