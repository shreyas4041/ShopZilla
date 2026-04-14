import React from 'react';
import type { Order } from '../types';

interface OrderStatusTrackerProps {
  status: Order['status'];
}

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
  const statuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentIndex = statuses.indexOf(status);

  return (
    <div className="flex items-center w-full pt-2">
      {statuses.map((s, index) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                index <= currentIndex
                  ? 'bg-accent border-accent text-white'
                  : 'bg-gray-100 dark:bg-secondary border-gray-300 dark:border-gray-600'
              }`}
            >
              {index < currentIndex ? <CheckIcon /> : <div className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-transparent'}`}></div>}
            </div>
            <p
              className={`mt-2 text-xs text-center w-20 ${
                index <= currentIndex ? 'text-textDark dark:text-textLight font-semibold' : 'text-gray-500'
              }`}
            >
              {s}
            </p>
          </div>
          {index < statuses.length - 1 && (
            <div className={`flex-1 h-1 transition-colors duration-300 ${index < currentIndex ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default OrderStatusTracker;
