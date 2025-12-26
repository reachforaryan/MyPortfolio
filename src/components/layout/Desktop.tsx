import React from 'react';
import { RetroBackground } from './RetroBackground';

interface DesktopProps {
    children: React.ReactNode;
}

export const Desktop: React.FC<DesktopProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-full relative overflow-hidden font-sans text-retro-black selection:bg-retro-blue selection:text-white">
            <RetroBackground />
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
};
