import React from 'react';

interface LoadingProps {
  message?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  className = 'loading' 
}) => {
  return <div className={className}>{message}</div>;
};

export default Loading;
