import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { WindowId, RiceConfigState } from '@/config';
import { StartMenu } from './StartMenu';

interface TaskbarProps {
    windows?: Array<{ id: WindowId; title: string; isOpen: boolean; isMinimized: boolean }>;
    activeWindowId?: WindowId | null;
    onToggleWindow?: (id: WindowId) => void;
    onToggleTheme?: () => void;
    config?: RiceConfigState;
    onUpdateConfig?: (updates: Partial<RiceConfigState>) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ windows = [], activeWindowId, onToggleWindow, onToggleTheme, config, onUpdateConfig }) => {
    const [time, setTime] = useState(new Date());
    const [startOpen, setStartOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <StartMenu
                isOpen={startOpen}
                onClose={() => setStartOpen(false)}
                onOpenWindow={onToggleWindow}
                config={config}
                onUpdateConfig={onUpdateConfig}
            />

            <div className="fixed bottom-0 left-0 right-0 h-10 bg-black/60 backdrop-blur-md border-t border-white/20 shadow-lg flex items-center px-1 z-50">
                <button
                    className={cn(
                        "flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 font-bold text-sm mr-2 select-none text-white rounded transaction-colors duration-200 border border-white/5",
                        startOpen
                            ? "bg-vapor-pink/20 border-vapor-pink/50 text-vapor-pink shadow-[0_0_10px_rgba(244,184,228,0.3)]"
                            : "shadow-sm active:translate-y-[1px]"
                    )}
                    onClick={() => setStartOpen(!startOpen)}
                >
                    <img
                        src="https://win98icons.alexmeub.com/icons/png/windows-0.png"
                        alt="Start"
                        className="w-5 h-5 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                    />
                    <span className="hidden md:block">Start</span>
                </button>
                {/* Window List */}
                <div className="flex-1 flex items-center gap-1 overflow-x-auto px-2">
                    {windows.map(win => (
                        <button
                            key={win.id}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1 min-w-[150px] max-w-[200px] text-left truncate text-sm select-none rounded transition-all duration-200 border border-transparent",
                                activeWindowId === win.id && !win.isMinimized
                                    ? "bg-white/10 text-vapor-blue border-white/10 shadow-[0_0_10px_rgba(137,220,235,0.2)] font-semibold" // Active
                                    : "bg-transparent text-gray-300 hover:bg-white/5 hover:text-white" // Inactive
                            )}
                            onClick={() => onToggleWindow && onToggleWindow(win.id)}
                        >
                            <img
                                src={
                                    win.id === 'about' ? "https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" :
                                        win.id === 'projects' ? "https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" :
                                            "https://win98icons.alexmeub.com/icons/png/envelope_closed-0.png"
                                }
                                className="w-4 h-4 drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
                            />
                            <span className="truncate">{win.title}</span>
                        </button>
                    ))}
                </div>

                <div className="px-3 py-1 bg-white/5 rounded text-xs flex items-center gap-2 cursor-default select-none text-gray-300 border border-white/5">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={onToggleTheme}
                        className="hover:bg-white/10 p-1 rounded-sm cursor-pointer active:translate-y-[1px] transition-colors"
                        title="Toggle Background"
                    >
                        <img src="https://win98icons.alexmeub.com/icons/png/display_properties-3.png" className="w-4 h-4 invert opacity-80" alt="Theme" />
                    </button>
                    <div className="w-[1px] h-4 bg-white/20 mx-1" />
                    <img src="https://win98icons.alexmeub.com/icons/png/audio_std-0.png" className="w-4 h-4 invert opacity-80" />
                    <span className="font-mono">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </>
    );
};
