import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopProps {
    children: React.ReactNode;
    backgroundImage?: string;
    enableCrt?: boolean;
}

export const Desktop: React.FC<DesktopProps> = ({ children, backgroundImage, enableCrt = true }) => {
    return (
        <div
            className={cn(
                "h-screen w-full relative overflow-hidden font-sans text-retro-black selection:bg-retro-blue selection:text-white flex flex-row gap-4 p-4 items-stretch pb-14",
                enableCrt && "scanlines",
                backgroundImage ? "bg-cover bg-center" : "bg-retro-teal"
            )}
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
            {/* CRT Flicker Overlay */}
            {enableCrt && (
                <div className="absolute inset-0 bg-white/5 pointer-events-none z-[100] animate-crt-flicker mix-blend-overlay" />
            )}

            {children}
            {/* Dark overlay for better text readability on HD images if needed */}
            {backgroundImage && (
                <div className="absolute inset-0 bg-black/20 pointer-events-none z-0" />
            )}
        </div>
    );
};
