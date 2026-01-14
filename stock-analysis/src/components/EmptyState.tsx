import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  icon = '📈'
}) => {
  return (
    <div className="empty-state">
      <h3>{icon} {title}</h3>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button className="action-btn add-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
