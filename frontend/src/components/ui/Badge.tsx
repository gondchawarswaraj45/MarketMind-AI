import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  // Plain unique executive colors: blue, sky, slate, amber, rose
  variant?: 'blue' | 'sky' | 'slate' | 'amber' | 'rose' | 'outline' | 'cyan' | 'indigo' | 'violet' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-lg transition-colors select-none';

  const variants = {
    blue: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25',
    sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25',
    cyan: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25',
    indigo: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25',
    violet: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
    emerald: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25',
    amber: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25',
    rose: 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/25',
    slate: 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-transparent',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variants[variant] || variants.blue, sizes[size], className))}
      {...props}
    >
      {children}
    </span>
  );
};
