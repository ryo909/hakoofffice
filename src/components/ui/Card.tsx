import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'solid' | 'outline';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'glass', padding = 'md', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx('card', `card-${variant}`, `card-p-${padding}`, className)}
                {...props}
            />
        );
    }
);
Card.displayName = 'Card';
