import { User, Zone, Tour, Department } from './types';

export interface DataService {
    getUsers(): Promise<User[]>;
    getUser(id: string): Promise<User | undefined>;
    updateUser(user: User): Promise<void>;

    getZones(): Promise<Zone[]>;
    updateZones(zones: Zone[]): Promise<void>;

    getTours(): Promise<Tour[]>;
    getDepartments(): Promise<Department[]>;

    // Auth (Mock/Real)
    validateEditToken(userId: string, token: string): Promise<boolean>;
    validateAdminSecret(secret: string): Promise<boolean>;

    // Admin
    createUser(user: User): Promise<User>;
    generateEditToken(userId: string): Promise<string>; // Returns the raw token (only for admin)
}
