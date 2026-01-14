import React from 'react';
import PortfolioHeader from './PortfolioHeader';
import ErrorState from './ErrorState';
import PositionsList from './PositionsList';
import TargetPriceModal from '../../components/TargetPriceModal';
import TransactionModal from '../../components/TransactionModal';
import usePortfolio from '../../hooks/usePortfolio';
import usePortfolioUI from '../../hooks/usePortfolioUI';
import { useTransactionModal } from '../../hooks/useModalManagement';

const Portfolio: React.FC = () => {
  // Portfolio data and logic
  const {
    stockPositions,
    stocks,
    loading,
    error,
    deleteTransaction,
    refreshData
  } = usePortfolio();

  // UI state management
  const {
    expandedStocks,
    expandedBuyTables,
    expandedSellTables,
    showTargetModal,
    selectedStock,
    toggleStockExpansion,
    toggleBuyTable,
    toggleSellTable,
    openTargetModal,
    closeTargetModal
  } = usePortfolioUI();

  // Transaction modal management
  const {
    showTransactionModal,
    transactionType,
    selectedStockId,
    openTransactionModal,
    closeTransactionModal
  } = useTransactionModal();

  // Event handlers
  const handleDeleteTransaction = async (id: number) => {
    const success = await deleteTransaction(id);
    if (success) {
      console.log('Transaction deleted successfully');
    }
  };

  const handleTransactionAdded = () => {
    refreshData();
  };

  const handleTargetUpdated = () => {
    refreshData();
  };

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={refreshData} />;
  }

  return (
    <div className="portfolio">
      <PortfolioHeader
        stockPositions={stockPositions}
        onOpenBuyModal={() => openTransactionModal('buy', 0)}
        onOpenSellModal={() => openTransactionModal('sell', 0)}
      />

      <PositionsList
        stockPositions={stockPositions}
        expandedStocks={expandedStocks}
        expandedBuyTables={expandedBuyTables}
        expandedSellTables={expandedSellTables}
        onToggleStock={toggleStockExpansion}
        onToggleBuyTable={toggleBuyTable}
        onToggleSellTable={toggleSellTable}
        onOpenTargetModal={openTargetModal}
        onOpenTransactionModal={openTransactionModal}
        onDeleteTransaction={handleDeleteTransaction}
        loading={loading}
      />

      <TargetPriceModal
        isOpen={showTargetModal}
        onClose={closeTargetModal}
        selectedStock={selectedStock}
        stockPositions={stockPositions}
        onTargetUpdated={handleTargetUpdated}
      />

      <TransactionModal
        isOpen={showTransactionModal}
        onClose={closeTransactionModal}
        stocks={stocks}
        stockPositions={stockPositions}
        onTransactionAdded={handleTransactionAdded}
        initialType={transactionType}
        initialStockId={selectedStockId}
      />
    </div>
  );
};

export default Portfolio;
