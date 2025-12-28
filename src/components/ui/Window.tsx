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
    onMinimize?: () => void;
    onMaximize?: () => void;
    isMaximized?: boolean;
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
    onMinimize,
    onMaximize,
    isMaximized,
    className,
    isActive,
    onFocus,
    style
}) => {
    if (!isOpen) return null;

    return (
        <div
            className={cn(
                "flex flex-col min-w-0 md:min-w-[300px] flex-1 h-full transition-all duration-300 ease-in-out transform origin-center rounded-lg overflow-hidden relative",
                // Active State: Dynamic Vapor Glow + Pulse Border
                isActive
                    ? "border-2 border-vapor-purple animate-border-pulse shadow-vapor-glow z-10 scale-[1.002]"
                    : "border-2 border-white/10 opacity-90 scale-95 hover:opacity-100 hover:border-white/30",
                "glass-panel",
                className
            )}
            onClick={onFocus}
            style={style}
        >
            {/* Title Bar - Animated Vapor Gradient */}
            <div className={
                cn(
                    "window-title-bar flex items-center justify-between px-2 py-1.5 cursor-default select-none mb-0 transition-all duration-300",
                    isActive
                        ? "bg-vapor-gradient bg-[length:200%_200%] animate-gradient-shift text-black/80"
                        : "bg-black/40 text-gray-400"
                )
            }>
                <div className="flex items-center gap-2 font-bold text-sm tracking-wider uppercase">
                    {isActive && <span className="text-xs animate-spin-slow">✿</span>}
                    <span>{title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
                        className="w-5 h-5 rounded-full bg-black/10 hover:bg-yellow-500/80 hover:text-white flex items-center justify-center text-current transition-colors border border-black/5"
                    >
                        <Minus size={10} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMaximize?.(); }}
                        className="w-5 h-5 rounded-full bg-black/10 hover:bg-green-500/80 hover:text-white flex items-center justify-center text-current transition-colors border border-black/5"
                    >
                        <Square size={8} className={isMaximized ? "fill-current" : ""} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="w-5 h-5 rounded-full bg-black/10 hover:bg-rose-500/80 hover:text-white flex items-center justify-center text-current transition-colors border border-black/5"
                    >
                        <X size={10} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-black/60 backdrop-blur-md p-2 overflow-auto text-vapor-blue/90 selection:bg-vapor-pink selection:text-black">
                {children}
            </div>
        </div>
    );
};
