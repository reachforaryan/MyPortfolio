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
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-2 p-2 w-24 hover:bg-white/10 focus:bg-white/20 focus:outline focus:outline-1 focus:outline-vapor-blue/50 rounded-lg group transition-all duration-200 hover:scale-105 active:scale-95",
                className
            )}
        >
            <img src={icon} alt={label} className="w-10 h-10 pixelated drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            <span className="text-vapor-blue text-xs font-medium tracking-wide bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded shadow-lg group-hover:text-vapor-pink transition-colors border border-transparent group-hover:border-white/10">
                {label}
            </span>
        </button>
    );
};
