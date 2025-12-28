import React, { useState, useEffect } from 'react';
import { SYSTEM_CONFIG } from '@/config';

interface TVFrameProps {
    children: React.ReactNode;
    isPoweringOff: boolean;
    startOn?: boolean;
}

export const TVFrame: React.FC<TVFrameProps> = ({ children, isPoweringOff, startOn = false }) => {
    const [isBooted, setIsBooted] = useState(startOn);

    useEffect(() => {
        if (!startOn) {
            // Trigger power-on animation slightly after mount
            const timer = setTimeout(() => setIsBooted(true), SYSTEM_CONFIG.BOOT_DELAY);
            return () => clearTimeout(timer);
        }
    }, [startOn]);

    return (
        <div className="relative w-screen h-screen bg-black overflow-hidden z-[99999]" style={{ pointerEvents: isPoweringOff ? 'none' : 'auto' }}>
            <div
                className={`w-full h-full transition-all duration-300
          ${isPoweringOff
                        ? 'crt-turn-off'
                        : startOn
                            ? 'opacity-100 scale-100'
                            : isBooted
                                ? 'crt-turn-on'
                                : 'opacity-0 scale-0'}`}
            >
                {children}
            </div>

            {/* The actual "White Line" effect during transition */}
            {(isPoweringOff || (!isBooted && !startOn)) && (
                <div className={`absolute top-1/2 left-0 w-full h-[2px] bg-white shadow-[0_0_10px_white] pointer-events-none transform -translate-y-1/2 
                    ${isPoweringOff ? 'opacity-100 delay-[200ms]' : 'opacity-50'}
                    transition-opacity duration-300`}
                />
            )}
        </div>
    );
};
