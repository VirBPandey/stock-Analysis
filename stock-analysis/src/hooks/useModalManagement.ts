import { useState, useCallback } from 'react';
import { Stock } from '../types';

/**
 * Hook for managing stock form modal state
 */
export const useStockModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  const openModal = useCallback((stock?: Stock) => {
    setEditingStock(stock || null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingStock(null);
  }, []);

  return {
    isModalOpen,
    editingStock,
    openModal,
    closeModal
  };
};

/**
 * Hook for managing transaction modal state
 */
export const useTransactionModal = () => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy');
  const [selectedStockId, setSelectedStockId] = useState<number>(0);

  const openTransactionModal = useCallback((type: 'buy' | 'sell', stockId: number = 0) => {
    setTransactionType(type);
    setSelectedStockId(stockId);
    setShowTransactionModal(true);
  }, []);

  const closeTransactionModal = useCallback(() => {
    setShowTransactionModal(false);
    setSelectedStockId(0);
  }, []);

  return {
    showTransactionModal,
    transactionType,
    selectedStockId,
    openTransactionModal,
    closeTransactionModal
  };
};
