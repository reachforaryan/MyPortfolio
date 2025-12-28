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
            onClick={onClick} // Allow single click for better mobile/tablet verification if needed, or stick to double. Keeping standard behavior but adding touch support logic is good practice, but for here I'll just enhance styles.
            className={cn(
                "flex flex-col items-center gap-2 p-2 w-24 hover:bg-white/10 focus:bg-white/20 focus:outline focus:outline-1 focus:outline-neon-cyan/50 rounded-lg group transition-all duration-200 hover:scale-105 active:scale-95",
                className
            )}
        >
            <img src={icon} alt={label} className="w-10 h-10 pixelated drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            <span className="text-white text-xs font-medium tracking-wide bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded shadow-lg group-hover:text-neon-cyan transition-colors">
                {label}
            </span>
        </button>
    );
};
