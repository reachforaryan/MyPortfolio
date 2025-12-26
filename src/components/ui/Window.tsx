import React from 'react';
import Draggable from 'react-draggable';
import { X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WindowProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    defaultPosition?: { x: number; y: number };
    className?: string;
}

export const Window: React.FC<WindowProps> = ({
    title,
    children,
    isOpen,
    onClose,
    defaultPosition = { x: 50, y: 50 },
    className
}) => {
    const nodeRef = React.useRef(null);

    if (!isOpen) return null;

    return (
        <Draggable handle=".window-title-bar" defaultPosition={defaultPosition} nodeRef={nodeRef}>
            <div ref={nodeRef} className={cn(
                "absolute flex flex-col bg-retro-gray shadow-retro p-1 min-w-[300px]",
                className
            )}>
                {/* Title Bar */}
                <div className="window-title-bar flex items-center justify-between bg-retro-blue px-1 py-0.5 cursor-default select-none mb-1">
                    <div className="flex items-center gap-1 text-white font-bold text-sm">
                        <span>{title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="w-4 h-4 bg-retro-gray shadow-retro flex items-center justify-center active:shadow-retro-in">
                            <Minus size={10} />
                        </button>
                        <button className="w-4 h-4 bg-retro-gray shadow-retro flex items-center justify-center active:shadow-retro-in">
                            <Square size={8} />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-4 h-4 bg-retro-gray shadow-retro flex items-center justify-center active:shadow-retro-in"
                        >
                            <X size={10} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white border-2 border-retro-dark-gray border-b-retro-white border-r-retro-white p-2 overflow-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </Draggable>
    );
};
