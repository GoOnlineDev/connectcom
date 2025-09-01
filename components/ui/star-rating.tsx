"use client";

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  interactive = false, 
  onRatingChange,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;
        const isPartiallyFilled = starValue - 0.5 <= rating && starValue > rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(starValue)}
            disabled={!interactive}
            className={cn(
              sizeClasses[size],
              interactive && "cursor-pointer hover:scale-110 transition-transform",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled || isPartiallyFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : interactive
                  ? 'text-gray-300 hover:text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

interface StarRatingDisplayProps {
  rating: number;
  maxRating?: number;
  showNumber?: boolean;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRatingDisplay({ 
  rating, 
  maxRating = 5, 
  showNumber = false, 
  totalReviews,
  size = 'md',
  className 
}: StarRatingDisplayProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <StarRating rating={rating} maxRating={maxRating} size={size} />
      {showNumber && (
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)}
          {totalReviews !== undefined && ` (${totalReviews} review${totalReviews !== 1 ? 's' : ''})`}
        </span>
      )}
    </div>
  );
}
