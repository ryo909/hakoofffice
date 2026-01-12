import { ReactNode, useEffect } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { Button } from './Button';
import './SidePanel.css';

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    variant?: 'panel' | 'modal'; // panel = right side, modal = center/bottom
}

export const SidePanel = ({ isOpen, onClose, title, children, variant = 'panel' }: SidePanelProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <>
            <div
                className={clsx('panel-overlay', { 'panel-open': isOpen })}
                onClick={onClose}
            />
            <div className={clsx('panel-content', `panel-${variant}`, { 'panel-open': isOpen })}>
                <div className="panel-header">
                    {title && <h2 className="panel-title">{title}</h2>}
                    <Button variant="ghost" size="icon" onClick={onClose} className="panel-close-btn">
                        <X size={20} />
                    </Button>
                </div>
                <div className="panel-body">
                    {children}
                </div>
            </div>
        </>
    );
};
