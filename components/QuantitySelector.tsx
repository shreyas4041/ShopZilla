
import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
      <button onClick={onDecrease} className="px-3 py-1 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary rounded-l-md transition-colors">-</button>
      <span className="px-4 py-1 text-textDark dark:text-textLight font-medium">{quantity}</span>
      <button onClick={onIncrease} className="px-3 py-1 text-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary rounded-r-md transition-colors">+</button>
    </div>
  );
};

export default QuantitySelector;
