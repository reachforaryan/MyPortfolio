import React, { useState, useEffect } from 'react';
import { DESKTOP_PET_CONFIG } from '@/config';

interface SystemBootLoaderProps {
    onComplete: () => void;
}

export const SystemBootLoader: React.FC<SystemBootLoaderProps> = ({ onComplete }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        // Data derived from Aryan Singh's profile
        const bootSequence = [
            "> INITIALIZING BATAK_OS KERNEL...",
            "> CONNECTING TO NODE: VIT_VELLORE_CAMPUS...",
            "> DOWNLOADING_MORE_RAM... 100%",
            "> DELETING_PRODUCTION_DB... JUST KIDDING",
            "> COPYING_CODE_FROM_STACKOVERFLOW... SUCCESS",
            "> LOADING_MODULE: VISION_LANGUAGE_SENTIMENT...",
            "> STARTING_AGENT: CREW_AI_DISCORD_BOT...",
            "> VERIFYING_CREDENTIALS: OCI_GEN_AI_2025...",
            "> SYNCING_SHEEP_MASCOT_ASSETS...",
            "> READY."
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < bootSequence.length) {
                setLogs(prev => [...prev, bootSequence[index]]);
                setProgress(((index + 1) / bootSequence.length) * 100);
                index++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 800); // Brief pause on "READY"
            }
        }, 450);

        return () => clearInterval(interval);
    }, [onComplete]);

    // Animation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(prev => (prev + 1) % DESKTOP_PET_CONFIG.WALK_FRAMES);
        }, DESKTOP_PET_CONFIG.ANIMATION_SPEED);
        return () => clearInterval(interval);
    }, []);

    const spriteX = -(frame * DESKTOP_PET_CONFIG.FRAME_WIDTH);
    const spriteY = -(3 * DESKTOP_PET_CONFIG.FRAME_HEIGHT); // Row 3 is Walk Right

    return (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col p-6 font-mono text-[#00ff00]">
            {/* BIOS Header */}
            <div className="flex justify-between border-b border-[#00ff00] pb-2 text-xs opacity-70">
                <span>BATAK_SYSTEMS_V2.5</span>
                <span>DEC_2025_BUILD</span>
            </div>

            {/* Terminal Logs */}
            <div className="flex-1 pt-4 space-y-1 overflow-hidden text-sm">
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                        <span className={i === logs.length - 1 ? "animate-pulse" : ""}>{log}</span>
                    </div>
                ))}
            </div>

            {/* Progress Bar & Mascot */}
            <div className="relative w-full max-w-lg mx-auto pb-10">
                {/* The Sheep Mascot walking on the bar */}
                <div
                    className="absolute -top-8 transition-all duration-300 ease-linear"
                    style={{ left: `${progress}%`, transform: 'translateX(-100%)' }}
                >
                    <div
                        style={{
                            width: DESKTOP_PET_CONFIG.FRAME_WIDTH,
                            height: DESKTOP_PET_CONFIG.FRAME_HEIGHT,
                            backgroundImage: `url(${DESKTOP_PET_CONFIG.SPRITE_SHEET})`,
                            backgroundPosition: `${spriteX}px ${spriteY}px`,
                            backgroundSize: `192px 256px`, // Based on the original sprite sheet dimensions logic
                            imageRendering: 'pixelated',
                            transform: 'scale(1.5)',
                            transformOrigin: 'bottom center'
                        }}
                    />
                </div>

                <div className="h-4 w-full border border-[#00ff00] p-0.5">
                    <div
                        className="h-full bg-[#00ff00] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-center mt-2 text-[10px] uppercase tracking-widest opacity-60">
                    Aryan Singh | Computer Science Undergrad @ VIT
                </div>
            </div>

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />
        </div>
    );
};
