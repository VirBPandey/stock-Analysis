// Constants used across the application

export const STOCK_HEALTH_THRESHOLDS = {
  CURRENT_RATIO: {
    GOOD: 1.5,
    OK: 1,
  },
  DEBT_EQUITY: {
    GOOD: 0.5,
    OK: 1,
  },
  PRICE_BOOK: {
    GOOD: 2,
    OK: 3,
    HEALTHY: 3,
  },
} as const;

export const SEARCH_MIN_LENGTH = 3;

export const DATE_FORMATS = {
  SHORT: { day: '2-digit' as const, month: 'short' as const },
  FULL: { day: '2-digit' as const, month: 'short' as const, year: 'numeric' as const },
} as const;

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const INVESTMENT_HORIZONS = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
} as const;

export const PRICE_TRENDS = {
  BULLISH: 'bullish',
  BEARISH: 'bearish',
  SIDEWAYS: 'sideways',
} as const;

export const ANALYST_RATINGS = {
  STRONG_BUY: 'strong_buy',
  BUY: 'buy',
  HOLD: 'hold',
  SELL: 'sell',
  STRONG_SELL: 'strong_sell',
} as const;

export const TRANSACTION_TYPES = {
  BUY: 'buy',
  SELL: 'sell',
} as const;

export const DEFAULT_FORM_VALUES = {
  FUNDAMENTAL_SCORE: 5,
  TECHNICAL_SCORE: 5,
  RISK_LEVEL: RISK_LEVELS.MEDIUM,
  INVESTMENT_HORIZON: INVESTMENT_HORIZONS.MEDIUM,
  ANALYST_RATING: ANALYST_RATINGS.HOLD,
  PRICE_TREND: PRICE_TRENDS.SIDEWAYS,
} as const;
