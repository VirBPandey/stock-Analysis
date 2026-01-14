import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './stocksSlice';
import portfolioReducer from './portfolioSlice';

export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    portfolio: portfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['stocks/fetchStocks/fulfilled', 'portfolio/fetchPortfolioEntries/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
