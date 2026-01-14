import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="portfolio error">
      <h2>My Portfolio</h2>
      <div className="error-message">
        <p>Error loading portfolio data: {message}</p>
        <button onClick={onRetry} className="retry-btn">
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
