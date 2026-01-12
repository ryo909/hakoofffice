import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="input-group">
                {label && <label className="input-label">{label}</label>}
                <input
                    ref={ref}
                    className={clsx('input-field', { 'input-error': error }, className)}
                    {...props}
                />
                {error && <span className="input-error-msg">{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';
