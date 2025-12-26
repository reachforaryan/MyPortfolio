import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopProps {
    children: React.ReactNode;
    backgroundImage?: string;
}

export const Desktop: React.FC<DesktopProps> = ({ children, backgroundImage }) => {
    return (
        <div
            className={cn(
                "min-h-screen w-full relative overflow-hidden font-sans text-retro-black selection:bg-retro-blue selection:text-white flex flex-row gap-4 p-4 items-stretch pb-14",
                backgroundImage ? "bg-cover bg-center" : "bg-retro-teal"
            )}
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
            {children}
            {/* Dark overlay for better text readability on HD images if needed */}
            {backgroundImage && (
                <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
            )}
        </div>
    );
};
