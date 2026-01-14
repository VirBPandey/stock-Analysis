import { PortfolioEntry, StockPosition, Transaction } from '../types';

/**
 * Normalize portfolio entry data from API response
 */
export const normalizePortfolioEntry = (entry: any): PortfolioEntry => {
  return {
    id: entry.id || 0,
    stockId: entry.stockId || 0,
    stock: entry.stock,
    quantity: Number(entry.quantity) || 0,
    price: Number(entry.price || entry.purchasePrice) || 0,
    date: entry.date || entry.purchaseDate || '',
    type: entry.type || 'buy',
    targetPrice: Number(entry.targetPrice) || 0,
    targetDate: entry.targetDate || '',
  };
};

/**
 * Group portfolio entries by stock and calculate positions
 */
export const groupPortfolioByStock = (portfolioEntries: PortfolioEntry[]): StockPosition[] => {
  if (!Array.isArray(portfolioEntries)) {
    console.warn('portfolioEntries is not an array:', portfolioEntries);
    return [];
  }

  const stockMap = new Map<number, StockPosition>();

  portfolioEntries.forEach(rawEntry => {
    const entry = normalizePortfolioEntry(rawEntry);
    const stockId = entry.stockId;

    if (!stockMap.has(stockId)) {
      stockMap.set(stockId, {
        stockId,
        stock: entry.stock,
        transactions: [],
        targetPrice: entry.targetPrice || 0,
        targetDate: entry.targetDate || '',
        totalQuantity: 0,
        averagePrice: 0,
        totalInvestment: 0,
        totalBuyQuantity: 0,
        totalSellQuantity: 0,
        totalBuyValue: 0,
        totalSellValue: 0,
        realizedPL: 0,
      });
    }

    const position = stockMap.get(stockId)!;

    // Add transaction
    position.transactions.push({
      id: entry.id,
      stockId: entry.stockId,
      quantity: entry.quantity,
      price: entry.price,
      date: entry.date,
      type: entry.type,
    });

    // Update totals based on transaction type
    const quantity = entry.quantity;
    const price = entry.price;

    if (entry.type === 'buy') {
      position.totalBuyQuantity += quantity;
      position.totalBuyValue += quantity * price;
      position.totalQuantity += quantity;
      position.totalInvestment += quantity * price;
    } else if (entry.type === 'sell') {
      position.totalSellQuantity += quantity;
      position.totalSellValue += quantity * price;
      position.totalQuantity -= quantity;
      // Subtract cost basis (avg price * quantity), not sell value
      const avgPrice = position.totalBuyQuantity > 0 
        ? position.totalBuyValue / position.totalBuyQuantity 
        : 0;
      position.totalInvestment -= quantity * avgPrice;
    }
  });

  // Calculate average price and realized P&L for each position
  stockMap.forEach(position => {
    position.averagePrice = position.totalBuyQuantity > 0
      ? position.totalBuyValue / position.totalBuyQuantity
      : 0;

    // Calculate realized P&L (sell value - average buy price * sell quantity)
    if (position.totalSellQuantity > 0 && position.averagePrice > 0) {
      const avgCostOfSoldShares = position.averagePrice * position.totalSellQuantity;
      position.realizedPL = position.totalSellValue - avgCostOfSoldShares;
    }
  });

  return Array.from(stockMap.values());
};

/**
 * Calculate total portfolio investment
 */
export const calculateTotalInvestment = (positions: StockPosition[]): number => {
  return positions.reduce((sum, pos) => sum + (pos.totalInvestment || 0), 0);
};

/**
 * Calculate total realized profit/loss
 */
export const calculateTotalRealizedPL = (positions: StockPosition[]): number => {
  return positions.reduce((sum, pos) => sum + (pos.realizedPL || 0), 0);
};

/**
 * Count stocks with targets
 */
export const countStocksWithTargets = (positions: StockPosition[]): number => {
  return positions.filter(pos => pos.targetPrice > 0).length;
};

/**
 * Filter transactions by type
 */
export const filterTransactionsByType = (
  transactions: Transaction[],
  type: 'buy' | 'sell'
): Transaction[] => {
  return transactions.filter(t => t.type === type);
};

/**
 * Sort transactions by date
 */
export const sortTransactionsByDate = (
  transactions: Transaction[],
  ascending: boolean = false
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
