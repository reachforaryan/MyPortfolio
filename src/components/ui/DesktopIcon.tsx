import React from 'react';
import { cn } from '@/lib/utils';

interface DesktopIconProps {
    label: string;
    icon: string;
    onClick: () => void;
    className?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onClick, className }) => {
    return (
        <button
            onDoubleClick={onClick}
            className={cn(
                "flex flex-col items-center gap-1 p-2 w-20 hover:bg-retro-blue/20 focus:bg-retro-blue/40 focus:outline-dotted focus:outline-1 focus:outline-white rounded-sm group",
                className
            )}
        >
            <img src={icon} alt={label} className="w-8 h-8 pixelated" />
            <span className="text-white text-xs text-shadow-sm bg-retro-teal group-focus:bg-retro-blue px-1">
                {label}
            </span>
        </button>
    );
};
