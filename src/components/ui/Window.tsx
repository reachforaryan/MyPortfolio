import React from 'react';
import { X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hyprland Style Window
// - No Draggable
// - Flex resizing
// - Active Border highlighting

interface WindowProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    isActive?: boolean;
    onFocus?: () => void;
    style?: React.CSSProperties;
}

export const Window: React.FC<WindowProps> = ({
    title,
    children,
    isOpen,
    onClose,
    className,
    isActive,
    onFocus,
    style
}) => {
    if (!isOpen) return null;

    return (
        <div
            className={cn(
                "flex flex-col min-w-[300px] flex-1 h-full transition-all duration-300 ease-in-out transform origin-center rounded-lg overflow-hidden",
                // Active State: Neon Glow + Border
                isActive
                    ? "border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.3)] z-10 scale-[1.002]"
                    : "border border-white/10 opacity-90 scale-95 hover:opacity-100 hover:border-white/30",
                "glass-panel", // Base glass effect from index.css
                className
            )}
            onClick={onFocus}
            style={style}
        >
            {/* Title Bar */}
            <div className={
                cn(
                    "window-title-bar flex items-center justify-between px-2 py-1.5 cursor-default select-none mb-0 transition-colors duration-300",
                    isActive
                        ? "bg-gradient-to-r from-neon-purple/80 to-neon-cyan/80 text-white"
                        : "bg-black/40 text-gray-400"
                )
            }>
                <div className="flex items-center gap-2 font-bold text-sm tracking-wider uppercase animate-text-glow">
                    <span className="text-xs">★</span>
                    <span>{title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/5">
                        <Minus size={10} />
                    </button>
                    <button className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/5">
                        <Square size={8} />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center text-white transition-colors border border-white/5"
                    >
                        <X size={10} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-black/60 backdrop-blur-md p-2 overflow-auto text-white/90">
                {children}
            </div>
        </div>
    );
};
