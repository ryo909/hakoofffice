import { DataService } from './api';
import { User, Zone, Tour, Department } from './types';

const STORAGE_KEY_PREFIX = 'box_garden_';

const INITIAL_DEPARTMENTS: Department[] = [
    { id: 'sales', name: 'Sales', color: '#FFD700' },
    { id: 'eng', name: 'Engineering', color: '#87CEFA' },
    { id: 'design', name: 'Design', color: '#FF69B4' },
    { id: 'admin', name: 'Admin', color: '#D3D3D3' },
];

const INITIAL_ZONES: Zone[] = [
    { id: 'z1', name: 'Sales Area', x: 0.1, y: 0.1, w: 0.3, h: 0.3, color: 'rgba(255, 215, 0, 0.2)' },
    { id: 'z2', name: 'Eng Area', x: 0.5, y: 0.1, w: 0.4, h: 0.3, color: 'rgba(135, 206, 250, 0.2)' },
    { id: 'z3', name: 'Design Studio', x: 0.1, y: 0.5, w: 0.3, h: 0.3, color: 'rgba(255, 105, 180, 0.2)' },
    { id: 'z4', name: 'Lounge', x: 0.5, y: 0.5, w: 0.4, h: 0.3, color: 'rgba(211, 211, 211, 0.2)' },
];

const INITIAL_USERS: User[] = [
    {
        id: 'u1',
        name: 'Alice Johnson',
        departmentId: 'sales',
        status: 'working',
        statusLine: 'Closing deals!',
        likes: ['Coffee', 'Hiking', 'Jazz'],
        topicsTags: ['Sales', 'Negotiation', 'Coffee'],
        happyRecent: 'Hit my monthly target early!',
        helpTopics: ['Contract review', 'Client intros'],
        contactPreference: ['slack'],
        visibility: 'company',
        editTokenHash: 'hash_alice', // In real app, this would be proper hash
    },
    {
        id: 'u2',
        name: 'Bob Smith',
        departmentId: 'eng',
        status: 'focus',
        statusLine: 'Do not disturb',
        likes: ['Coding', 'Gaming', 'Sci-Fi'],
        topicsTags: ['React', 'TypeScript', 'Dota2'],
        happyRecent: 'Fixed a nasty bug.',
        helpTopics: ['Frontend arch', 'Bug fixing'],
        contactPreference: ['slack', 'discord'],
        visibility: 'company',
        editTokenHash: 'hash_bob',
    },
    {
        id: 'u3',
        name: 'Charlie Brown',
        departmentId: 'design',
        status: 'available',
        statusLine: 'Open for feedback',
        likes: ['Sketch', 'Cats', 'Minimalism'],
        topicsTags: ['UI/UX', 'Figma', 'Cats'],
        happyRecent: 'Found a great new font.',
        helpTopics: ['Design critique', 'Asset help'],
        contactPreference: ['slack'],
        visibility: 'company',
        editTokenHash: 'hash_charlie',
    }
];

// Map positions stored separately (or could be in user, but better normalized for map view)
// For MVP, we might just store initial positions. 
// But let's assume positions are part of the box garden state? 
// No, the requirement says "app decides position" or "admin sets it".
// Let's add position to User or keep separate. 
// Task said: "mapPositions: userId, x, y"
// For MockService, let's keep it simple and store positions in localStorage too.
const INITIAL_POSITIONS: Record<string, { x: number, y: number }> = {
    'u1': { x: 0.2, y: 0.2 },
    'u2': { x: 0.6, y: 0.2 },
    'u3': { x: 0.2, y: 0.6 },
};

export class MockDataService implements DataService {
    private get<T>(key: string, defaultVal: T): T {
        const s = localStorage.getItem(STORAGE_KEY_PREFIX + key);
        if (!s) return defaultVal;
        try { return JSON.parse(s); } catch { return defaultVal; }
    }

    private set<T>(key: string, val: T) {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
    }

    async getUsers(): Promise<User[]> {
        const users = this.get<User[]>('users', INITIAL_USERS);
        // Merge positions? Or handle positions separately?
        // Let's attach positions for the frontend convenience if needed, 
        // but the Interface User doesn't have x/y.
        // We might need a separate call for positions.
        return users;
    }

    async getUser(id: string): Promise<User | undefined> {
        const users = await this.getUsers();
        return users.find(u => u.id === id);
    }

    async updateUser(user: User): Promise<void> {
        let users = await this.getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx >= 0) {
            users[idx] = user;
        } else {
            users.push(user);
        }
        this.set('users', users);
    }

    async getZones(): Promise<Zone[]> {
        return this.get<Zone[]>('zones', INITIAL_ZONES);
    }

    async updateZones(zones: Zone[]): Promise<void> {
        this.set('zones', zones);
    }

    async getTours(): Promise<Tour[]> {
        return this.get<Tour[]>('tours', [
            {
                id: 't1',
                title: 'Welcome Tour',
                description: 'Meet the key people to get started.',
                userIds: ['u1', 'u2', 'u3']
            }
        ]);
    }

    async getDepartments(): Promise<Department[]> {
        return INITIAL_DEPARTMENTS;
    }

    // Auth Mocks
    async validateEditToken(userId: string, token: string): Promise<boolean> {
        // In Mock, strict hashing is overkill but we simulate it.
        // We expect token to be "token_alice" and hash to be "hash_alice" for simplicity in mock?
        // Or just check if token === user.editTokenHash (if we treat them as plain text for mock debugging)
        const user = await this.getUser(userId);
        if (!user) return false;
        // VERY WEAK MOCK CHECK:
        return `token_${user.name.split(' ')[0].toLowerCase()}` === token || token === 'admin_override';
    }

    async validateAdminSecret(secret: string): Promise<boolean> {
        return secret === 'secret123';
    }

    async createUser(user: User): Promise<User> {
        const users = await this.getUsers();
        user.id = `u${Date.now()}`;
        // Generate dummy hash
        user.editTokenHash = `hash_${user.id}`;
        users.push(user);
        this.set('users', users);
        return user;
    }

    async generateEditToken(userId: string): Promise<string> {
        const user = await this.getUser(userId);
        if (!user) throw new Error('User not found');
        return `token_${user.name.split(' ')[0].toLowerCase()}`; // Dummy token
    }

    // Extra helper for positions
    async getUserPositions(): Promise<Record<string, { x: number, y: number }>> {
        return this.get('positions', INITIAL_POSITIONS);
    }

    async updateUserPosition(userId: string, x: number, y: number): Promise<void> {
        const positions = await this.getUserPositions();
        positions[userId] = { x, y };
        this.set('positions', positions);
    }
}

export const dataService = new MockDataService();
