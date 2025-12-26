import React, { useState, useEffect } from 'react';


export const Taskbar: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed bottom-0 left-0 right-0 h-10 bg-retro-gray border-t-2 border-retro-white shadow-retro flex items-center px-1 z-50">
            <button className="flex items-center gap-1 px-2 py-1 bg-retro-gray shadow-retro active:shadow-retro-in font-bold text-sm mr-2">
                <img
                    src="https://win98icons.alexmeub.com/icons/png/windows-0.png"
                    alt="Start"
                    className="w-5 h-5"
                />
                Start
            </button>

            <div className="flex-1">
                {/* Active windows will go here */}
            </div>

            <div className="px-3 py-1 bg-retro-gray shadow-retro-in text-xs flex items-center gap-2">
                <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};
