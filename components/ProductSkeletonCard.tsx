import React from 'react';
import { Skeleton, Card } from './ui';

const ProductSkeletonCard: React.FC = () => {
  return (
    <Card className="h-full flex flex-col">
      <Skeleton className="w-full h-56" />
      <div className="p-4 space-y-3 flex-grow flex flex-col">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex-grow" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-full mt-2" />
      </div>
    </Card>
  );
};

export default ProductSkeletonCard;
