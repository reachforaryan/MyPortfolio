import type { WindowId, RiceConfigState } from '@/config';
import { Monitor, Power, Settings, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

export interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenWindow?: (id: WindowId) => void;
    config?: RiceConfigState;
    onUpdateConfig?: (updates: Partial<RiceConfigState>) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onOpenWindow, config, onUpdateConfig }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Click overlay to close menu */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            <div className="absolute bottom-10 left-0 w-72 bg-retro-gray border-2 border-retro-out shadow-retro z-50 flex flex-col p-1 animate-in zoom-in-95 duration-100 origin-bottom-left">
                <div className="flex bg-retro-blue text-white p-2 items-center gap-2 mb-2">
                    <Settings className="w-5 h-5" />
                    <span className="font-bold tracking-wider">SYSTEM CONFIG</span>
                </div>

                {config && onUpdateConfig ? (
                    <div className="flex flex-col gap-2 p-2 bg-white border border-retro-gray-dark shadow-inner text-sm">
                        {/* Theme Section */}
                        <div className="space-y-1">
                            <label className="font-bold flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
                                <Monitor className="w-3 h-3" /> Visual Style
                            </label>
                            <div className="grid grid-cols-3 gap-1">
                                {[
                                    { id: 'retro', label: 'Classic' },
                                    { id: 'cyberpunk', label: 'Cyber' },
                                    { id: 'vaporwave', label: 'Vapor' }
                                ].map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => onUpdateConfig({ theme: theme.id as any })}
                                        className={cn(
                                            "px-1 py-1 text-xs border border-transparent hover:bg-retro-blue hover:text-white transition-colors text-center",
                                            config.theme === theme.id && "bg-retro-blue text-white font-bold"
                                        )}
                                    >
                                        {theme.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[1px] bg-gray-200 my-1" />

                        {/* Toggles */}
                        <div className="space-y-2">
                            <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1">
                                <span>CRT Effects</span>
                                <input
                                    type="checkbox"
                                    checked={config.showCrt}
                                    onChange={() => onUpdateConfig({ showCrt: !config.showCrt })}
                                    className="accent-retro-blue"
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1">
                                <span>Neon Glow</span>
                                <input
                                    type="checkbox"
                                    checked={config.showGlow}
                                    onChange={() => onUpdateConfig({ showGlow: !config.showGlow })}
                                    className="accent-retro-blue"
                                />
                            </label>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-500">Config not loaded</div>
                )}

                <div className="mt-2 flex flex-col gap-1">
                    <button
                        className="w-full text-left px-2 py-2 hover:bg-retro-blue hover:text-white flex items-center gap-2 group text-sm border border-transparent"
                        onClick={() => {
                            if (onOpenWindow) onOpenWindow('about');
                            onClose();
                        }}
                    >
                        <Info className="w-4 h-4" />
                        <span>About This Rice</span>
                    </button>
                    <div className="h-[1px] bg-retro-gray-dark border-b border-white my-1" />
                    <button
                        className="w-full text-left px-2 py-2 hover:bg-retro-blue hover:text-white flex items-center gap-2 group text-sm border border-transparent"
                        onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.reload();
                        }}
                    >
                        <Power className="w-4 h-4" />
                        <span>Shut Down...</span>
                    </button>
                </div>
            </div>
        </>
    );
};
