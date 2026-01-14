import axios from 'axios';
import { Stock, PortfolioEntry, SoldShare, ProfitLossReport } from '../types';

const API_BASE_URL = 'http://localhost:5120/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authApi = {
  login: (username: string, password: string) => api.post('/auth/login', { username, password }),
};

// Stock API calls
export const stocksApi = {
  getAll: () => api.get<Stock[]>('/stocks'),
  getById: (id: number) => api.get<Stock>(`/stocks/${id}`),
  create: (stock: Omit<Stock, 'id'>) => api.post<Stock>('/stocks', stock),
  update: (id: number, stock: Stock) => api.put(`/stocks/${id}`, stock),
  delete: (id: number) => api.delete(`/stocks/${id}`),
};

// Portfolio API calls
export const portfolioApi = {
  getAll: () => api.get<PortfolioEntry[]>('/portfolio'),
  getById: (id: number) => api.get<PortfolioEntry>(`/portfolio/${id}`),
  getNearTarget: () => api.get<PortfolioEntry[]>('/portfolio/near-target'),
  create: (entry: Omit<PortfolioEntry, 'id'>) => api.post<PortfolioEntry>('/portfolio', entry),
  update: (id: number, entry: PortfolioEntry) => api.put(`/portfolio/${id}`, entry),
  updateStockTarget: (stockId: number, targetPrice: number, targetDate: string) => 
    api.put(`/portfolio/stock/${stockId}/target`, { targetPrice, targetDate }),
  delete: (id: number) => api.delete(`/portfolio/${id}`),
};

// Sold Shares API calls
export const soldSharesApi = {
  getAll: () => api.get<SoldShare[]>('/soldshares'),
  getById: (id: number) => api.get<SoldShare>(`/soldshares/${id}`),
  getProfitLossReport: () => api.get<ProfitLossReport>('/soldshares/profit-loss'),
  create: (share: Omit<SoldShare, 'id' | 'profitOrLoss'>) => api.post<SoldShare>('/soldshares', share),
  update: (id: number, share: SoldShare) => api.put(`/soldshares/${id}`, share),
  delete: (id: number) => api.delete(`/soldshares/${id}`),
};

export { api };