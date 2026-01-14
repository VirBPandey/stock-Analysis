import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PortfolioEntry, SoldShare, ProfitLossReport } from '../types';
import { portfolioApi, soldSharesApi } from '../services/api';

interface PortfolioState {
  portfolioEntries: PortfolioEntry[];
  soldShares: SoldShare[];
  profitLossReport: ProfitLossReport | null;
  loading: boolean;
  error: string | null;
  selectedEntry: PortfolioEntry | null;
}

const initialState: PortfolioState = {
  portfolioEntries: [],
  soldShares: [],
  profitLossReport: null,
  loading: false,
  error: null,
  selectedEntry: null,
};

// Async Thunks for Portfolio
export const fetchPortfolioEntries = createAsyncThunk(
  'portfolio/fetchPortfolioEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await portfolioApi.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch portfolio');
    }
  }
);

export const fetchNearTargetEntries = createAsyncThunk(
  'portfolio/fetchNearTargetEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await portfolioApi.getNearTarget();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch near target entries');
    }
  }
);

export const createPortfolioEntry = createAsyncThunk(
  'portfolio/createPortfolioEntry',
  async (entryData: Omit<PortfolioEntry, 'id'>, { rejectWithValue }) => {
    try {
      const response = await portfolioApi.create(entryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create portfolio entry');
    }
  }
);

export const updatePortfolioEntry = createAsyncThunk(
  'portfolio/updatePortfolioEntry',
  async ({ id, data }: { id: number; data: PortfolioEntry }, { rejectWithValue }) => {
    try {
      const response = await portfolioApi.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update portfolio entry');
    }
  }
);

export const updateStockTarget = createAsyncThunk(
  'portfolio/updateStockTarget',
  async ({ stockId, targetPrice, targetDate }: { stockId: number; targetPrice: number; targetDate: string }, { rejectWithValue }) => {
    try {
      const response = await portfolioApi.updateStockTarget(stockId, targetPrice, targetDate);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stock target');
    }
  }
);

export const deletePortfolioEntry = createAsyncThunk(
  'portfolio/deletePortfolioEntry',
  async (id: number, { rejectWithValue }) => {
    try {
      await portfolioApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete portfolio entry');
    }
  }
);

// Async Thunks for Sold Shares
export const fetchSoldShares = createAsyncThunk(
  'portfolio/fetchSoldShares',
  async (_, { rejectWithValue }) => {
    try {
      const response = await soldSharesApi.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sold shares');
    }
  }
);

export const fetchProfitLossReport = createAsyncThunk(
  'portfolio/fetchProfitLossReport',
  async (_, { rejectWithValue }) => {
    try {
      const response = await soldSharesApi.getProfitLossReport();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profit/loss report');
    }
  }
);

export const createSoldShare = createAsyncThunk(
  'portfolio/createSoldShare',
  async (shareData: Omit<SoldShare, 'id' | 'profitOrLoss'>, { rejectWithValue }) => {
    try {
      const response = await soldSharesApi.create(shareData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create sold share');
    }
  }
);

export const deleteSoldShare = createAsyncThunk(
  'portfolio/deleteSoldShare',
  async (id: number, { rejectWithValue }) => {
    try {
      await soldSharesApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete sold share');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setSelectedEntry: (state, action: PayloadAction<PortfolioEntry | null>) => {
      state.selectedEntry = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Portfolio Entries
    builder.addCase(fetchPortfolioEntries.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPortfolioEntries.fulfilled, (state, action) => {
      state.loading = false;
      state.portfolioEntries = action.payload;
    });
    builder.addCase(fetchPortfolioEntries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Near Target Entries
    builder.addCase(fetchNearTargetEntries.fulfilled, (state, action) => {
      state.portfolioEntries = action.payload;
    });

    // Create Portfolio Entry
    builder.addCase(createPortfolioEntry.fulfilled, (state, action) => {
      state.portfolioEntries.push(action.payload);
    });

    // Update Portfolio Entry
    builder.addCase(updatePortfolioEntry.fulfilled, (state, action) => {
      const index = state.portfolioEntries.findIndex((entry: PortfolioEntry) => entry.id === action.payload.id);
      if (index !== -1) {
        state.portfolioEntries[index] = action.payload;
      }
    });

    // Update Stock Target
    builder.addCase(updateStockTarget.fulfilled, (state) => {
      // Refetch will be handled by the component
    });

    // Delete Portfolio Entry
    builder.addCase(deletePortfolioEntry.fulfilled, (state, action) => {
      state.portfolioEntries = state.portfolioEntries.filter((entry: PortfolioEntry) => entry.id !== action.payload);
    });

    // Fetch Sold Shares
    builder.addCase(fetchSoldShares.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSoldShares.fulfilled, (state, action) => {
      state.loading = false;
      state.soldShares = action.payload;
    });
    builder.addCase(fetchSoldShares.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Profit/Loss Report
    builder.addCase(fetchProfitLossReport.fulfilled, (state, action) => {
      state.profitLossReport = action.payload;
    });

    // Create Sold Share
    builder.addCase(createSoldShare.fulfilled, (state, action) => {
      state.soldShares.push(action.payload);
    });

    // Delete Sold Share
    builder.addCase(deleteSoldShare.fulfilled, (state, action) => {
      state.soldShares = state.soldShares.filter((share: SoldShare) => share.id !== action.payload);
    });
  },
});

export const { setSelectedEntry, clearError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
