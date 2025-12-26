import React from 'react';
import { Sliders, Monitor, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Theme = 'retro' | 'cyberpunk' | 'vaporwave';

export interface RiceConfigState {
    gap: number;
    theme: Theme;
    showGlow: boolean;
}

interface RiceConfigProps {
    config: RiceConfigState;
    onUpdate: (newConfig: Partial<RiceConfigState>) => void;
}

export const RiceConfig: React.FC<RiceConfigProps> = ({ config, onUpdate }) => {
    return (
        <div className="flex flex-col h-full bg-retro-gray p-4 gap-6 font-pixel select-none">

            {/* Layout Section */}
            <section className="bg-white p-4 border-2 border-retro-gray-dark shadow-sm">
                <h3 className="flex items-center gap-2 font-bold mb-4 border-b-2 border-retro-gray-dark pb-2">
                    <Layout className="w-5 h-5" /> Tiling Layout
                </h3>
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm">Window Gap: {config.gap}px</label>
                        <input
                            type="range"
                            min="0"
                            max="32"
                            value={config.gap}
                            onChange={(e) => onUpdate({ gap: parseInt(e.target.value) })}
                            className="w-full accent-retro-blue cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>Tight (0px)</span>
                            <span>Airy (32px)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Theme Section */}
            <section className="bg-white p-4 border-2 border-retro-gray-dark shadow-sm">
                <h3 className="flex items-center gap-2 font-bold mb-4 border-b-2 border-retro-gray-dark pb-2">
                    <Monitor className="w-5 h-5" /> Visual Style
                </h3>

                <div className="grid grid-cols-1 gap-3">
                    {/* Theme Selector */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm">Color Scheme</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onUpdate({ theme: 'retro' })}
                                className={cn(
                                    "flex-1 py-2 px-1 border-2 text-xs font-bold transition-all",
                                    config.theme === 'retro'
                                        ? "bg-retro-blue text-white border-retro-blue inset-shadow-active"
                                        : "bg-retro-gray border-white hover:bg-gray-200"
                                )}
                            >
                                Classic
                            </button>
                            <button
                                onClick={() => onUpdate({ theme: 'cyberpunk' })}
                                className={cn(
                                    "flex-1 py-2 px-1 border-2 text-xs font-bold transition-all",
                                    config.theme === 'cyberpunk'
                                        ? "bg-yellow-400 text-black border-yellow-600 inset-shadow-active"
                                        : "bg-gray-900 text-yellow-500 border-gray-700 hover:bg-gray-800"
                                )}
                            >
                                Cyber
                            </button>
                            <button
                                onClick={() => onUpdate({ theme: 'vaporwave' })}
                                className={cn(
                                    "flex-1 py-2 px-1 border-2 text-xs font-bold transition-all",
                                    config.theme === 'vaporwave'
                                        ? "bg-pink-400 text-white border-pink-600 inset-shadow-active"
                                        : "bg-purple-900 text-pink-400 border-purple-700 hover:bg-purple-800"
                                )}
                            >
                                Vapor
                            </button>
                        </div>
                    </div>

                    {/* Glow Toggle */}
                    <div className="flex items-center justify-between mt-2">
                        <label className="text-sm">Neon Glow</label>
                        <button
                            onClick={() => onUpdate({ showGlow: !config.showGlow })}
                            className={cn(
                                "w-12 h-6 border-2 relative transition-all",
                                config.showGlow ? "bg-green-500 border-green-700" : "bg-gray-300 border-gray-500"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0.5 w-4 h-4 bg-white border border-black transition-all",
                                config.showGlow ? "left-6" : "left-0.5"
                            )} />
                        </button>
                    </div>
                </div>
            </section>

            <div className="text-center text-xs text-gray-400 mt-auto">
                Changes apply instantly.
            </div>
        </div>
    );
};
