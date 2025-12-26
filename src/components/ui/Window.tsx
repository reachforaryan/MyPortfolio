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
                "flex flex-col bg-retro-gray p-1 min-w-[300px] flex-1 h-full transition-all duration-300 ease-in-out transform origin-center",
                isActive ? "border-2 border-retro-blue z-10" : "border-2 border-retro-gray opacity-90 scale-95",
                "shadow-2xl", // Modern shadow for depth
                className
            )}
            onClick={onFocus}
            style={style}
        >
            {/* Title Bar */}
            < div className={
                cn(
                    "window-title-bar flex items-center justify-between px-1 py-0.5 cursor-default select-none mb-1 transition-colors duration-300",
                    isActive ? "bg-retro-blue text-white" : "bg-retro-dark-gray text-retro-gray-light"
                )
            } >
                <div className="flex items-center gap-1 font-bold text-sm">
                    <span>{title}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button className="w-4 h-4 bg-retro-gray shadow-retro flex items-center justify-center active:shadow-retro-in text-black">
                        <Minus size={10} />
                    </button>
                    <button className="w-4 h-4 bg-retro-gray shadow-retro flex items-center justify-center active:shadow-retro-in text-black">
                        <Square size={8} />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-4 h-4 bg-retro-gray shadow-retro flex items-center justify-center active:shadow-retro-in text-black"
                    >
                        <X size={10} />
                    </button>
                </div>
            </div >

            {/* Content */}
            < div className="flex-1 bg-white border-2 border-retro-dark-gray border-b-retro-white border-r-retro-white p-2 overflow-auto" >
                {children}
            </div >
        </div >
    );
};
