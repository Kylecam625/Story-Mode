import React from 'react';
import { cn } from '../../lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-bold transition-all duration-200',
        {
          'bg-white hover:bg-gray-100 text-gray-800 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] hover:scale-[1.02]': 
            variant === 'default',
          'bg-gray-600 hover:bg-gray-700 text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-[1.02]': 
            variant === 'secondary',
          'hover:bg-gray-700/50 text-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:text-purple-300': 
            variant === 'ghost',
          'px-4 py-2': size === 'sm',
          'px-6 py-3': size === 'md',
          'px-8 py-4': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}