import { useEffect, useState } from 'react';
import { dataService } from '../services/mockData';
import { User, Zone, MapPosition, Tour } from '../services/types';
import { GardenLayout } from '../components/garden/GardenLayout';
import { SidePanel } from '../components/ui/SidePanel';
import { ProfileCard } from '../components/profile/ProfileCard';
import { DirectoryView } from '../components/profile/DirectoryView';
import { Button } from '../components/ui/Button';
import { Search, Map, ChevronRight, X } from 'lucide-react';
import './HomePage.css';

export const HomePage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);
    const [positions, setPositions] = useState<Record<string, MapPosition>>({});
    const [tours, setTours] = useState<Tour[]>([]);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);

    // Tour State
    const [activeTour, setActiveTour] = useState<Tour | null>(null);
    const [tourStep, setTourStep] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            const [_users, _zones, _positions, _tours] = await Promise.all([
                dataService.getUsers(),
                dataService.getZones(),
                dataService.getUserPositions(),
                dataService.getTours()
            ]);
            setUsers(_users);
            setZones(_zones);
            setPositions(_positions);
            setTours(_tours);
        };
        loadData();
    }, []);

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
    };

    // Tour Logic
    const startTour = (tour: Tour) => {
        setActiveTour(tour);
        setTourStep(0);
        visitTourStep(tour, 0);
    };

    const visitTourStep = (tour: Tour, step: number) => {
        const userId = tour.userIds[step];
        const user = users.find(u => u.id === userId);
        if (user) {
            handleUserClick(user);
        }
    };

    const nextTourStep = () => {
        if (!activeTour) return;
        const nextStep = tourStep + 1;
        if (nextStep < activeTour.userIds.length) {
            setTourStep(nextStep);
            visitTourStep(activeTour, nextStep);
        } else {
            endTour();
        }
    };

    const endTour = () => {
        setActiveTour(null);
        setTourStep(0);
        setIsPanelOpen(false);
        alert('Tour Completed! 🎉');
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="flex-center" style={{ gap: '12px' }}>
                    <h1 className="app-title">Office Garden</h1>
                </div>

                <div className="header-controls" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {activeTour ? (
                        <div className="tour-badge">
                            <span>Items: {tourStep + 1} / {activeTour.userIds.length}</span>
                            <Button size="sm" onClick={endTour} variant="secondary"><X size={14} /> Quit</Button>
                            <Button size="sm" onClick={nextTourStep} variant="primary">Next <ChevronRight size={14} /></Button>
                        </div>
                    ) : (
                        <>
                            <select
                                className="tour-select"
                                onChange={(e) => {
                                    const t = tours.find(tour => tour.id === e.target.value);
                                    if (t) startTour(t);
                                    e.target.value = ''; // reset
                                }}
                            >
                                <option value="">Start Tour...</option>
                                {tours.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                            <Button variant="ghost" onClick={() => setIsDirectoryOpen(!isDirectoryOpen)}>
                                <Search size={20} /> Directory
                            </Button>
                        </>
                    )}
                </div>
            </header>

            <main className="home-content-row">
                {isDirectoryOpen && (
                    <DirectoryView
                        users={users}
                        onSelectUser={(u) => {
                            handleUserClick(u);
                            // On mobile we might want to close directory, but for PC ok to keep open
                            // setIsDirectoryOpen(false);
                        }}
                        onClose={() => setIsDirectoryOpen(false)}
                    />
                )}

                <div className="garden-section">
                    <GardenLayout
                        users={users}
                        zones={zones}
                        positions={positions}
                        onUserClick={handleUserClick}
                        highlightUserId={selectedUser?.id}
                    />
                </div>
            </main>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                title={activeTour ? `Tour: ${activeTour.title}` : selectedUser?.name || 'Profile'}
            >
                {selectedUser && (
                    <>
                        <ProfileCard
                            user={selectedUser}
                            showEditButton={!activeTour} // IDK maybe hide edit during tour
                            onEdit={() => {/* Logic to show how to edit? */ }}
                        />
                        {activeTour && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                <Button className="width-full" onClick={nextTourStep}>
                                    {tourStep < activeTour.userIds.length - 1 ? 'Next Person' : 'Finish Tour'}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </SidePanel>
        </div>
    );
};
