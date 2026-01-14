export interface Stock {
  id: number;
  name: string;
  sectorName?: string;
  currentPrice?: number;
  currentRatio: number;
  debtEquityRatio: number;
  priceBookRatio: number;
  beta: number;
  shareholdingPattern: string;
  targetPrice: number;
  targetDate: string;
  positiveAnalysis?: string;
  negativeAnalysis?: string;
  peRatio?: number;
  // Enhanced analysis fields
  roe?: number; // Return on Equity
  roce?: number; // Return on Capital Employed
  revenueGrowth?: number; // Revenue growth percentage
  profitGrowth?: number; // Profit growth percentage
  dividendYield?: number; // Dividend yield percentage
  marketCap?: number; // Market capitalization
  bookValue?: string; // Book value per share
  eps?: number; // Earnings per share
  industryPE?: number; // Industry average PE
  priceTrend?: 'bullish' | 'bearish' | 'sideways'; // Price trend
  volume?: string; // Trading volume
  fundamentalScore?: number; // Overall fundamental score (1-10)
  technicalScore?: number; // Technical analysis score (1-10)
  riskLevel?: 'low' | 'medium' | 'high'; // Risk assessment
  investmentHorizon?: 'short' | 'medium' | 'long'; // Recommended investment horizon
  analystRating?: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  lastUpdated?: string; // When analysis was last updated
  keyStrengths?: string; // Key positive points
  keyConcerns?: string; // Key risk factors
  catalysts?: string; // Expected future catalysts
  companyDescription?: string; // Brief company description
}

export interface Transaction {
  id: number;
  stockId: number;
  quantity: number;
  price: number;
  date: string;
  type: 'buy' | 'sell';
}

export interface PortfolioEntry {
  id: number;
  stockId: number;
  stock?: Stock;
  quantity: number;
  price: number;
  date: string;
  type: 'buy' | 'sell';
  targetPrice: number;
  targetDate: string;
}

export interface StockPosition {
  stockId: number;
  stock?: Stock;
  transactions: Transaction[];
  targetPrice: number;
  targetDate: string;
  totalQuantity: number;
  averagePrice: number;
  totalInvestment: number;
  totalBuyQuantity: number;
  totalSellQuantity: number;
  totalBuyValue: number;
  totalSellValue: number;
  realizedPL: number;
}

export interface SoldShare {
  id: number;
  stockId: number;
  stock?: Stock;
  quantity: number;
  purchasePrice: number;
  sellPrice: number;
  purchaseDate: string;
  sellDate: string;
  profitOrLoss: number;
}

export interface ProfitLossReport {
  totalProfitLoss: number;
  totalProfitableShares: number;
  totalLossShares: number;
  totalProfit: number;
  totalLoss: number;
  soldShares: SoldShare[];
}