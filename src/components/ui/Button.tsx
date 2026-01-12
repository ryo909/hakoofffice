import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx('btn', `btn-${variant}`, `btn-${size}`, className)}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
