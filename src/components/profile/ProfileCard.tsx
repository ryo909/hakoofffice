import { User } from '../../services/types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MessageCircle, ThumbsUp, Hash, Heart, ExternalLink, MessageSquare } from 'lucide-react';
import './ProfileCard.css';

interface ProfileCardProps {
    user: User;
    onEdit?: () => void;
    showEditButton?: boolean;
}

export const ProfileCard = ({ user, onEdit, showEditButton }: ProfileCardProps) => {
    return (
        <div className="profile-detail-container">
            {/* Header */}
            <div className="profile-header">
                <Avatar user={user} size="xl" showStatus={true} className="profile-avatar-lg" />
                <div className="profile-header-info">
                    <h2 className="profile-name">{user.name}</h2>
                    <div className="profile-status-line">
                        <span className={`status-dot-inline status-${user.status}`} />
                        {user.statusLine || 'Availability not set'}
                    </div>
                    {/* Department Badge? We need Department Name look up, but for now just ID */}
                    <div className="profile-tags">
                        <Badge variant="secondary">{user.departmentId.toUpperCase()}</Badge>
                    </div>
                </div>
            </div>

            {/* Conversation Starters */}
            <Card variant="glass" className="profile-section conversation-starter-box">
                <h3 className="section-title"><MessageSquare size={16} /> Conversation Starters</h3>
                <div className="starter-list">
                    <div className="starter-item">
                        <span className="starter-label">Recent Joy</span>
                        <p className="starter-text">{user.happyRecent || 'Ask me!'}</p>
                    </div>
                    <div className="starter-item">
                        <span className="starter-label">Ask me about</span>
                        <div className="tags-flex">
                            {user.helpTopics.map(t => <Badge key={t} variant="outline" className="tag-badge">{t}</Badge>)}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Details */}
            <div className="profile-section">
                <h3 className="section-title"><Heart size={16} /> Likes</h3>
                <div className="tags-flex">
                    {user.likes.map(like => (
                        <Badge key={like} variant="secondary" className="like-badge">{like}</Badge>
                    ))}
                </div>
            </div>

            <div className="profile-section">
                <h3 className="section-title"><Hash size={16} /> Topics</h3>
                <div className="tags-flex">
                    {user.topicsTags.map(tag => (
                        <Badge key={tag} variant="outline" className="topic-badge">#{tag}</Badge>
                    ))}
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="profile-footer">
                {user.chatworkLink && (
                    <a href={user.chatworkLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Button variant="primary" className="width-full">
                            <MessageCircle size={18} /> Open Chatwork
                        </Button>
                    </a>
                )}
                {showEditButton && (
                    <Button variant="secondary" className="width-full" onClick={onEdit}>
                        Edit Profile
                    </Button>
                )}
            </div>
        </div>
    );
};
