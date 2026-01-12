import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import './Badge.css';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'outline' | 'secondary' | 'accent';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
    return (
        <span className={clsx('badge', `badge-${variant}`, className)} {...props} />
    );
};
