import { useMemo } from 'react';
import { Stock, StockPosition } from '../../types';

export const usePortfolioMetrics = (stockPositions: StockPosition[]) => {
  return useMemo(() => {
    const totalInvested = stockPositions.reduce(
      (sum, pos) => sum + pos.totalInvestment, 
      0
    );
    
    const totalCurrentValue = stockPositions.reduce((sum, pos) => {
      if (pos.stock?.currentPrice) {
        return sum + (pos.totalQuantity * pos.stock.currentPrice);
      }
      return sum + pos.totalInvestment;
    }, 0);
    
    const totalPL = totalCurrentValue - totalInvested;
    const totalPLPercentage = totalInvested > 0 
      ? (totalPL / totalInvested) * 100 
      : 0;

    return {
      totalInvested,
      totalCurrentValue,
      totalPL,
      totalPLPercentage
    };
  }, [stockPositions]);
};

export const usePortfolioStocks = (
  stocks: Stock[],
  stockPositions: StockPosition[]
) => {
  return useMemo(() => {
    const portfolioStockIds = stockPositions.map(pos => pos.stockId);
    return stocks.filter(stock => portfolioStockIds.includes(stock.id));
  }, [stocks, stockPositions]);
};

export const useFilteredPortfolioStocks = (
  portfolioStocks: Stock[],
  searchTerm: string,
  selectedSectors: string[]
) => {
  return useMemo(() => {
    return portfolioStocks.filter(stock => {
      const matchesSearch = searchTerm.length < 3 ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSectors.length === 0 ||
        selectedSectors.includes(stock.sectorName || 'Other');
      return matchesSearch && matchesSector;
    });
  }, [portfolioStocks, searchTerm, selectedSectors]);
};
