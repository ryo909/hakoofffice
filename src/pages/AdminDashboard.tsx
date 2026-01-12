import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dataService } from '../services/mockData';
import { User, MapPosition } from '../services/types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Copy, Plus, RefreshCw, MapPin } from 'lucide-react';
import './AdminDashboard.css';

export const AdminDashboard = () => {
    const [searchParams] = useSearchParams();
    const secret = searchParams.get('secret');

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [positions, setPositions] = useState<Record<string, MapPosition>>({});

    // New User Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState<Partial<User>>({
        name: '',
        departmentId: 'sales',
        status: 'available',
        statusLine: 'Hello!',
        likes: [],
        topicsTags: [],
        happyRecent: '',
        helpTopics: [],
        contactPreference: ['slack'],
        visibility: 'company'
    });

    const loadData = async () => {
        const [u, p] = await Promise.all([
            dataService.getUsers(),
            dataService.getUserPositions()
        ]);
        setUsers(u);
        setPositions(p);
    };

    useEffect(() => {
        const checkAuth = async () => {
            if (!secret) {
                setLoading(false);
                return;
            }
            const valid = await dataService.validateAdminSecret(secret);
            setIsAuthenticated(valid);
            if (valid) {
                await loadData();
            }
            setLoading(false);
        };
        checkAuth();
    }, [secret]);

    const handleCreateUser = async () => {
        if (!newUser.name) return alert('Name is required');
        await dataService.createUser(newUser as User);
        setShowAddForm(false);
        setNewUser({ name: '', departmentId: 'sales', status: 'available', ...newUser }); // Reset basic
        await loadData();
    };

    const generateLink = async (userId: string) => {
        const token = await dataService.generateEditToken(userId);
        const url = `${window.location.origin}/edit?token=${token}`;
        navigator.clipboard.writeText(url);
        alert('Edit Link copied to clipboard:\n' + url);
    };

    const updatePosition = async (userId: string, x: number, y: number) => {
        await dataService.updateUserPosition(userId, x, y);
        await loadData();
    };

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Verifying Secret...</div>;
    if (!isAuthenticated) return <div className="flex-center" style={{ height: '100vh' }}><h1>Access Denied</h1></div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus size={16} /> Add User
                </Button>
            </header>

            {showAddForm && (
                <Card variant="solid" className="admin-form-card">
                    <h3>New User</h3>
                    <div className="form-row">
                        <Input
                            placeholder="Name"
                            value={newUser.name}
                            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                        />
                        <select
                            value={newUser.departmentId}
                            onChange={e => setNewUser({ ...newUser, departmentId: e.target.value })}
                            className="input-field"
                        >
                            <option value="sales">Sales</option>
                            <option value="eng">Engineering</option>
                            <option value="design">Design</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <Button onClick={handleCreateUser}>Create</Button>
                </Card>
            )}

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Dept</th>
                            <th>Position (X, Y)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                                        <b>{user.name}</b>
                                    </div>
                                </td>
                                <td><Badge variant="outline">{user.departmentId}</Badge></td>
                                <td>
                                    <div className="pos-inputs">
                                        <input
                                            type="number" step="0.01" min="0" max="1"
                                            className="tiny-input"
                                            value={positions[user.id]?.x ?? 0}
                                            onChange={(e) => updatePosition(user.id, parseFloat(e.target.value), positions[user.id]?.y ?? 0)}
                                        />
                                        <input
                                            type="number" step="0.01" min="0" max="1"
                                            className="tiny-input"
                                            value={positions[user.id]?.y ?? 0}
                                            onChange={(e) => updatePosition(user.id, positions[user.id]?.x ?? 0, parseFloat(e.target.value))}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Button variant="secondary" size="sm" onClick={() => generateLink(user.id)}>
                                            <Copy size={14} /> Copy Edit Link
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
