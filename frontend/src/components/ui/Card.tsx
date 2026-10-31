import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow: _glow, // removed AI
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-2xl border transition-all duration-200',
          'bg-[#f8fafc] dark:bg-[#131b2e]',
          'border-slate-200/90 dark:border-slate-800',
          'shadow-xs',
          hoverEffect && 'hover:border-blue-400 dark:hover:border-blue-600/70',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
