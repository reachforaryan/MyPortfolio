import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { WindowId } from '@/App';
import { StartMenu } from './StartMenu';

interface TaskbarProps {
    windows?: Array<{ id: WindowId; title: string; isOpen: boolean; isMinimized: boolean }>;
    activeWindowId?: WindowId | null;
    onToggleWindow?: (id: WindowId) => void;
    onToggleTheme?: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ windows = [], activeWindowId, onToggleWindow, onToggleTheme }) => {
    const [time, setTime] = useState(new Date());
    const [startOpen, setStartOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />

            <div className="fixed bottom-0 left-0 right-0 h-10 bg-retro-gray border-t-2 border-retro-white shadow-retro flex items-center px-1 z-50">
                <button
                    className={cn(
                        "flex items-center gap-1 px-2 py-1 bg-retro-gray font-bold text-sm mr-2 select-none",
                        startOpen
                            ? "shadow-retro-in border-dotted border-[1.5px] border-black active:shadow-retro-in"
                            : "shadow-retro active:shadow-retro-in"
                    )}
                    onClick={() => setStartOpen(!startOpen)}
                >
                    <img
                        src="https://win98icons.alexmeub.com/icons/png/windows-0.png"
                        alt="Start"
                        className="w-5 h-5"
                    />
                    Start
                </button>
                {/* Window List */}
                <div className="flex-1 flex items-center gap-1 overflow-x-auto px-2">
                    {windows.map(win => (
                        <button
                            key={win.id}
                            className={cn(
                                "flex items-center gap-2 px-2 py-1 min-w-[150px] max-w-[200px] text-left truncate text-sm select-none",
                                activeWindowId === win.id && !win.isMinimized
                                    ? "bg-retro-gray-light shadow-retro-in font-bold border-dotted border-[1.5px] border-black" // Active
                                    : "bg-retro-gray shadow-retro active:shadow-retro-in" // Inactive
                            )}
                            onClick={() => onToggleWindow && onToggleWindow(win.id)}
                        >
                            <img
                                src={
                                    win.id === 'about' ? "https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" :
                                        win.id === 'projects' ? "https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" :
                                            "https://win98icons.alexmeub.com/icons/png/envelope_closed-0.png"
                                }
                                className="w-4 h-4"
                            />
                            <span className="truncate">{win.title}</span>
                        </button>
                    ))}
                </div>

                <div className="px-3 py-1 bg-retro-gray shadow-retro-in text-xs flex items-center gap-2 cursor-default select-none">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={onToggleTheme}
                        className="hover:bg-retro-blue/20 p-0.5 rounded cursor-pointer active:translate-y-[1px]"
                        title="Toggle Background"
                    >
                        <img src="https://win98icons.alexmeub.com/icons/png/display_properties-3.png" className="w-4 h-4" alt="Theme" />
                    </button>
                    <div className="w-[1px] h-4 bg-retro-dark-gray mx-1" />
                    <img src="https://win98icons.alexmeub.com/icons/png/audio_std-0.png" className="w-4 h-4" />
                    <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </>
    );
};
