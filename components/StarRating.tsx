import React from 'react';
import { StarIcon } from './Icons';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            className={`w-5 h-5 ${
              starValue <= rating
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        );
      })}
       <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
