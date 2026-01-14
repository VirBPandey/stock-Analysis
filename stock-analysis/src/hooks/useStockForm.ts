import { useState, useEffect, useCallback } from 'react';
import { Stock } from '../types';
import { DEFAULT_FORM_VALUES } from '../constants';

export const useStockForm = (editingStock: Stock | null, isOpen: boolean) => {
  const [formData, setFormData] = useState<Omit<Stock, 'id'>>({
    name: '',
    sectorName: '',
    currentRatio: 0,
    debtEquityRatio: 0,
    priceBookRatio: 0,
    beta: 0,
    shareholdingPattern: '',
    targetPrice: 0,
    targetDate: '',
    positiveAnalysis: '',
    negativeAnalysis: '',
    roe: 0,
    roce: 0,
    revenueGrowth: 0,
    profitGrowth: 0,
    dividendYield: 0,
    marketCap: 0,
    bookValue: '', 
    eps: 0,
    industryPE: 0,
    priceTrend: DEFAULT_FORM_VALUES.PRICE_TREND,
    volume: '',
    fundamentalScore: DEFAULT_FORM_VALUES.FUNDAMENTAL_SCORE,
    technicalScore: DEFAULT_FORM_VALUES.TECHNICAL_SCORE,
    riskLevel: DEFAULT_FORM_VALUES.RISK_LEVEL,
    investmentHorizon: DEFAULT_FORM_VALUES.INVESTMENT_HORIZON,
    analystRating: DEFAULT_FORM_VALUES.ANALYST_RATING,
    keyStrengths: '',
    keyConcerns: '',
    catalysts: '',
    companyDescription: '',
    peRatio: 0,
    currentPrice: 0,
  });

  // Initialize form data when modal opens or editing stock changes
  useEffect(() => {
    if (editingStock) {
      setFormData({
        name: editingStock.name,
        sectorName: editingStock.sectorName || '',
        currentRatio: editingStock.currentRatio,
        debtEquityRatio: editingStock.debtEquityRatio,
        priceBookRatio: editingStock.priceBookRatio,
        beta: editingStock.beta,
        shareholdingPattern: editingStock.shareholdingPattern,
        targetPrice: editingStock.targetPrice,
        targetDate: editingStock.targetDate ? (() => {
          try {
            const date = new Date(editingStock.targetDate);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
          } catch (error) {
            console.log('Date conversion error for form:', editingStock.targetDate, error);
            return '';
          }
        })() : '',
        positiveAnalysis: editingStock.positiveAnalysis || '',
        negativeAnalysis: editingStock.negativeAnalysis || '',
        roe: editingStock.roe || 0,
        roce: editingStock.roce || 0,
        revenueGrowth: editingStock.revenueGrowth || 0,
        profitGrowth: editingStock.profitGrowth || 0,
        dividendYield: editingStock.dividendYield || 0,
        marketCap: editingStock.marketCap || 0,
        bookValue: editingStock.bookValue || '',    
        eps: editingStock.eps || 0,
        industryPE: editingStock.industryPE || 0,
        priceTrend: editingStock.priceTrend || DEFAULT_FORM_VALUES.PRICE_TREND,
        volume: editingStock.volume || '',
        fundamentalScore: editingStock.fundamentalScore || DEFAULT_FORM_VALUES.FUNDAMENTAL_SCORE,
        technicalScore: editingStock.technicalScore || DEFAULT_FORM_VALUES.TECHNICAL_SCORE,
        riskLevel: editingStock.riskLevel || DEFAULT_FORM_VALUES.RISK_LEVEL,
        investmentHorizon: editingStock.investmentHorizon || DEFAULT_FORM_VALUES.INVESTMENT_HORIZON,
        analystRating: editingStock.analystRating || DEFAULT_FORM_VALUES.ANALYST_RATING,
        keyStrengths: editingStock.keyStrengths || '',
        keyConcerns: editingStock.keyConcerns || '',
        catalysts: editingStock.catalysts || '',
        companyDescription: editingStock.companyDescription || '',
        peRatio: editingStock.peRatio || 0,
        currentPrice: editingStock.currentPrice || 0,
      });
    } else {
      // Reset form for new stock
      setFormData({
        name: '',
        sectorName: '',
        currentRatio: 0,
        debtEquityRatio: 0,
        priceBookRatio: 0,
        beta: 0,
        shareholdingPattern: '',
        targetPrice: 0,
        targetDate: '',
        positiveAnalysis: '',
        negativeAnalysis: '',       
        marketCap: 0,
        bookValue: '', 
        volume: '',       
        analystRating: DEFAULT_FORM_VALUES.ANALYST_RATING,           
        currentPrice: 0,
      });
    }
  }, [editingStock, isOpen]);

  const handleInputChange = useCallback((field: keyof Omit<Stock, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return { formData, handleInputChange };
};
