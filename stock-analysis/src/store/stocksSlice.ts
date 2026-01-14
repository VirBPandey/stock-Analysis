import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Stock } from '../types';
import { stocksApi } from '../services/api';

interface StocksState {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
  selectedStock: Stock | null;
}

const initialState: StocksState = {
  stocks: [],
  loading: false,
  error: null,
  selectedStock: null,
};

// Async Thunks
export const fetchStocks = createAsyncThunk(
  'stocks/fetchStocks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stocksApi.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stocks');
    }
  }
);

export const createStock = createAsyncThunk(
  'stocks/createStock',
  async (stockData: Omit<Stock, 'id'>, { rejectWithValue }) => {
    try {
      const response = await stocksApi.create(stockData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create stock');
    }
  }
);

export const updateStock = createAsyncThunk(
  'stocks/updateStock',
  async ({ id, data }: { id: number; data: Stock }, { rejectWithValue }) => {
    try {
      const response = await stocksApi.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stock');
    }
  }
);

export const deleteStock = createAsyncThunk(
  'stocks/deleteStock',
  async (id: number, { rejectWithValue }) => {
    try {
      await stocksApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete stock');
    }
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    setSelectedStock: (state, action: PayloadAction<Stock | null>) => {
      state.selectedStock = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Stocks
    builder.addCase(fetchStocks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStocks.fulfilled, (state, action) => {
      state.loading = false;
      state.stocks = action.payload;
    });
    builder.addCase(fetchStocks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Stock
    builder.addCase(createStock.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createStock.fulfilled, (state, action) => {
      state.loading = false;
      state.stocks.push(action.payload);
    });
    builder.addCase(createStock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Stock
    builder.addCase(updateStock.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateStock.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.stocks.findIndex(stock => stock.id === action.payload.id);
      if (index !== -1) {
        state.stocks[index] = action.payload;
      }
    });
    builder.addCase(updateStock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Stock
    builder.addCase(deleteStock.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteStock.fulfilled, (state, action) => {
      state.loading = false;
      state.stocks = state.stocks.filter(stock => stock.id !== action.payload);
    });
    builder.addCase(deleteStock.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedStock, clearError } = stocksSlice.actions;
export default stocksSlice.reducer;
