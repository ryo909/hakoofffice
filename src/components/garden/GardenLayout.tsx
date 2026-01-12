import { useRef, useEffect, useState } from 'react';
import { User, Zone, MapPosition } from '../../services/types';
import { AvatarNode } from './AvatarNode';
import './GardenLayout.css';

interface GardenLayoutProps {
    users: User[];
    zones: Zone[];
    positions: Record<string, MapPosition>;
    onUserClick: (user: User) => void;
    highlightUserId?: string;
    className?: string;
}

export const GardenLayout = ({
    users,
    zones,
    positions,
    onUserClick,
    highlightUserId,
    className
}: GardenLayoutProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter out users who don't have a position
    const visibleUsers = users.filter(u => positions[u.id]);

    return (
        <div className={`garden-container ${className || ''}`} ref={containerRef}>
            <div className="garden-aspect-ratio-box">
                {/* Background / Floor */}
                <div className="garden-floor">
                    {/* Zones Layer */}
                    {zones.map(zone => (
                        <div
                            key={zone.id}
                            className="garden-zone"
                            style={{
                                left: `${zone.x * 100}%`,
                                top: `${zone.y * 100}%`,
                                width: `${zone.w * 100}%`,
                                height: `${zone.h * 100}%`,
                                backgroundColor: zone.color,
                            }}
                        >
                            <div className="garden-zone-label" style={{ color: zone.labelColor || 'rgba(0,0,0,0.5)' }}>
                                {zone.name}
                            </div>
                        </div>
                    ))}

                    {/* Avatars Layer */}
                    {visibleUsers.map(user => (
                        <AvatarNode
                            key={user.id}
                            user={user}
                            position={positions[user.id]}
                            onClick={onUserClick}
                            isHighlighted={highlightUserId === user.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
