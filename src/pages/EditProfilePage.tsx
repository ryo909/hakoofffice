import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { dataService } from '../services/mockData';
import { User, Department } from '../services/types';
import { EditProfileForm } from '../components/profile/EditProfileForm';

export const EditProfilePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [user, setUser] = useState<User | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const init = async () => {
            if (!token) {
                setError('No edit token provided.');
                setLoading(false);
                return;
            }

            // In a real app, we'd call an API like /api/validate-token?token=...
            // which would return the User associated with the token.
            // Here in mock, we iterate users to find a match (inefficient but works for MVP)
            const users = await dataService.getUsers();
            let foundUser: User | null = null;

            for (const u of users) {
                const isValid = await dataService.validateEditToken(u.id, token);
                if (isValid) {
                    foundUser = u;
                    break;
                }
            }

            if (foundUser) {
                setUser(foundUser);
                const deps = await dataService.getDepartments();
                setDepartments(deps);
            } else {
                setError('Invalid or expired token.');
            }
            setLoading(false);
        };
        init();
    }, [token]);

    const handleSave = async (updatedUser: User) => {
        await dataService.updateUser(updatedUser);
        alert('Profile updated successfully!');
        navigate('/');
    };

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Validating token...</div>;
    if (error) return <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <h2>Access Denied</h2>
        <p>{error}</p>
        <a href="/">Go to Home</a>
    </div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f7' }}>
            <EditProfileForm
                user={user!}
                departments={departments}
                onSave={handleSave}
                onCancel={() => navigate('/')}
            />
        </div>
    );
};
