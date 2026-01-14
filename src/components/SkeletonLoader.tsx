import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full',
  lines = 1 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${height} ${width} bg-gray-200 rounded animate-pulse`}
        />
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <Skeleton width="w-12" height="h-8" />
          <Skeleton width="w-24" height="h-8" />
          <Skeleton width="w-32" height="h-8" />
          <Skeleton width="w-20" height="h-8" />
          <Skeleton width="w-16" height="h-8" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <Skeleton width="w-32" height="h-6" />
      <Skeleton lines={3} />
      <div className="flex space-x-2">
        <Skeleton width="w-20" height="h-8" />
        <Skeleton width="w-20" height="h-8" />
      </div>
    </div>
  );
};

export default Skeleton;
