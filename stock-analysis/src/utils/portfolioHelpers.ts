import { useMemo } from 'react';
import { Stock, StockPosition } from '../types';
import { groupByKey } from './stockUtils';

/**
 * Group stocks by sector
 */
export const useStockSectorGroups = (stocks: Stock[]) => {
  return useMemo(() => {
    const groups = groupByKey(stocks, (stock) => stock.sectorName || 'Other');
    const sectorNames = Object.keys(groups).sort();
    return { sectorGroups: groups, availableSectors: sectorNames };
  }, [stocks]);
};

/**
 * Group positions by sector
 */
export const usePositionSectorGroups = (positions: StockPosition[]) => {
  return useMemo(() => {
    return positions.reduce((acc: Record<string, StockPosition[]>, pos) => {
      const sector = pos.stock?.sectorName || 'Other';
      if (!acc[sector]) acc[sector] = [];
      acc[sector].push(pos);
      return acc;
    }, {});
  }, [positions]);
};

/**
 * Calculate portfolio investment metrics
 */
export const calculatePortfolioMetrics = (stockPositions: StockPosition[]) => {
  debugger;
  const totalInvestment = stockPositions.reduce(
    (sum, pos) => sum + (pos.totalInvestment || 0), 
    0
  );
  const totalRealizedPL = stockPositions.reduce(
    (sum, pos) => sum + (pos.realizedPL || 0), 
    0
  );
  const stocksWithTargets = stockPositions.filter(
    pos => pos.targetPrice > 0
  ).length;

  return {
    totalInvestment,
    totalRealizedPL,
    stocksWithTargets
  };
};
