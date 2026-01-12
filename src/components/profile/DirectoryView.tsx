import { useState, useMemo } from 'react';
import { User } from '../../services/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Search, Filter, X } from 'lucide-react';
import './DirectoryView.css';
import { Avatar } from '../ui/Avatar';

interface DirectoryViewProps {
    users: User[];
    onSelectUser: (user: User) => void;
    onClose: () => void;
}

export const DirectoryView = ({ users, onSelectUser, onClose }: DirectoryViewProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState<string>('all');

    // Derive unique departments
    const departments = useMemo(() => {
        const depts = new Set(users.map(u => u.departmentId));
        return ['all', ...Array.from(depts)];
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.topicsTags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchDept = deptFilter === 'all' || user.departmentId === deptFilter;
            return matchSearch && matchDept;
        });
    }, [users, searchTerm, deptFilter]);

    return (
        <div className="directory-container glass-panel">
            <div className="directory-header">
                <h2>Directory</h2>
                <Button variant="ghost" size="icon" onClick={onClose}><X size={20} /></Button>
            </div>

            <div className="directory-controls">
                <div className="search-box">
                    <Input
                        placeholder="Search name or tag..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-chips">
                    {departments.map(dept => (
                        <button
                            key={dept}
                            className={`filter-chip ${deptFilter === dept ? 'active' : ''}`}
                            onClick={() => setDeptFilter(dept)}
                        >
                            {dept.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="directory-list">
                {filteredUsers.map(user => (
                    <div
                        key={user.id}
                        className="directory-item"
                        onClick={() => onSelectUser(user)}
                    >
                        <Avatar user={user} size="md" />
                        <div className="directory-item-info">
                            <div className="directory-item-name">{user.name}</div>
                            <div className="directory-item-sub">
                                <Badge variant="secondary" className="tiny-badge">{user.departmentId}</Badge>
                                <span className="truncate">{user.statusLine}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="empty-state">No users found used "{searchTerm}"</div>
                )}
            </div>
        </div>
    );
};
