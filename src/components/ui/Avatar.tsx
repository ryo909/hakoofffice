import clsx from 'clsx';
import { User } from '../../services/types';
import './Avatar.css';

interface AvatarProps {
    user?: Partial<User>; // Allow partial for flexibility
    src?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    status?: User['status'];
    className?: string;
    showStatus?: boolean;
}

export const Avatar = ({
    user,
    src,
    name,
    size = 'md',
    status,
    className,
    showStatus = true
}: AvatarProps) => {
    const finalSrc = src || user?.avatarUrl;
    const finalName = name || user?.name || '?';
    const finalStatus = status || user?.status;

    const initials = finalName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className={clsx('avatar-container', `avatar-${size}`, className)}>
            <div className="avatar-circle">
                {finalSrc ? (
                    <img src={finalSrc} alt={finalName} className="avatar-img" />
                ) : (
                    <span className="avatar-initials">{initials}</span>
                )}
            </div>
            {showStatus && finalStatus && (
                <span className={clsx('avatar-status', `status-${finalStatus}`)} />
            )}
        </div>
    );
};
