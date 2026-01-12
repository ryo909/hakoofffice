import { useState, ChangeEvent } from 'react';
import { User, Department } from '../../services/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import './EditProfileForm.css';

interface EditProfileFormProps {
    user: User;
    departments: Department[];
    onSave: (updatedUser: User) => Promise<void>;
    onCancel: () => void;
}

export const EditProfileForm = ({ user, departments, onSave, onCancel }: EditProfileFormProps) => {
    const [formData, setFormData] = useState<User>({ ...user });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field: keyof User, index: number, value: string) => {
        setFormData(prev => {
            const arr = [...(prev[field] as string[])];
            arr[index] = value;
            return { ...prev, [field]: arr };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form-container">
            <Card variant="solid" padding="lg">
                <h2 className="edit-form-title">Edit Profile</h2>

                <div className="form-section">
                    <label className="input-label">Department</label>
                    <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        className="input-field"
                    >
                        {departments.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-section">
                    <Input
                        label="One-liner Status (e.g. 'Working on Project X')"
                        name="statusLine"
                        value={formData.statusLine}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-section">
                    <label className="input-label">Status</label>
                    <div className="status-radio-group">
                        {['available', 'working', 'focus'].map(status => (
                            <label key={status} className={`status-radio-label ${formData.status === status ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="status"
                                    value={status}
                                    checked={formData.status === status}
                                    onChange={handleChange}
                                    className="hidden-radio"
                                />
                                <span className={`status-dot-inline status-${status}`} />
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <label className="input-label">Top 3 Likes (Hobbies/Interests)</label>
                    <div className="grid-3">
                        {[0, 1, 2].map(i => (
                            <Input
                                key={i}
                                placeholder={`Like #${i + 1}`}
                                value={formData.likes[i] || ''}
                                onChange={(e) => handleArrayChange('likes', i, e.target.value)}
                            />
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <Input
                        label="Recent Happy Thing"
                        name="happyRecent"
                        value={formData.happyRecent}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-section">
                    <Input
                        label="Topics / Tags (Comma separated)"
                        value={formData.topicsTags.join(', ')}
                        onChange={(e) => setFormData(p => ({ ...p, topicsTags: e.target.value.split(',').map(s => s.trim()) }))}
                    />
                </div>

                <div className="form-actions">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </Card>
        </form>
    );
};
