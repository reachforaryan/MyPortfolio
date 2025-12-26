import React from 'react';


interface DesktopProps {
    children: React.ReactNode;
}

export const Desktop: React.FC<DesktopProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-retro-teal relative overflow-hidden font-sans text-retro-black selection:bg-retro-blue selection:text-white">
            {children}
        </div>
    );
};
