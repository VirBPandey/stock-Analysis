/**
 * UI Utility Functions
 * Common UI patterns and helpers used across components
 */

/**
 * Show confirmation dialog with custom message
 * @param message - The confirmation message to display
 * @returns Promise<boolean> - true if user confirms, false otherwise
 */
export const confirmAction = async (message: string): Promise<boolean> => {
  return window.confirm(message);
};

/**
 * Predefined confirmation messages
 */
export const CONFIRM_MESSAGES = {
  DELETE_STOCK: 'Are you sure you want to delete this stock?',
  DELETE_STOCK_WITH_PORTFOLIO: 'Are you sure you want to delete this stock? This will also remove all associated portfolio entries.',
  DELETE_TRANSACTION: 'Are you sure you want to delete this transaction?',
  DELETE_SOLD_SHARE: 'Are you sure you want to delete this sold share entry?',
};

/**
 * Show error alert
 * @param message - The error message to display
 */
export const showError = (message: string): void => {
  alert(message);
};

/**
 * Handle async operation with loading state and error handling
 * @param operation - The async operation to perform
 * @param setLoading - Function to set loading state
 * @param errorMessage - Optional custom error message
 */
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  setLoading?: (loading: boolean) => void,
  errorMessage: string = 'An error occurred'
): Promise<T | null> => {
  try {
    if (setLoading) setLoading(true);
    const result = await operation();
    return result;
  } catch (error) {
    console.error(errorMessage, error);
    showError(errorMessage);
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
};

/**
 * Loading component message
 */
export const LOADING_MESSAGES = {
  DEFAULT: 'Loading...',
  STOCKS: 'Loading stocks...',
  PORTFOLIO: 'Loading portfolio...',
  NEAR_TARGET: 'Loading near target shares...',
  SOLD_SHARES: 'Loading sold shares...',
};
