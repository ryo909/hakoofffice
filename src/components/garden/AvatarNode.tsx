import { User, MapPosition } from '../../services/types';
import { Avatar } from '../ui/Avatar';
import './AvatarNode.css';

interface AvatarNodeProps {
    user: User;
    position: MapPosition;
    onClick: (user: User) => void;
    isHighlighted?: boolean;
}

export const AvatarNode = ({ user, position, onClick, isHighlighted }: AvatarNodeProps) => {
    return (
        <div
            className={`avatar-node ${isHighlighted ? 'avatar-node-highlight' : ''}`}
            style={{
                left: `${position.x * 100}%`,
                top: `${position.y * 100}%`,
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick(user);
            }}
        >
            <div className="avatar-node-content">
                <Avatar user={user} size="md" status={user.status} />
                <div className="avatar-node-label">{user.name.split(' ')[0]}</div>
            </div>
        </div>
    );
};
