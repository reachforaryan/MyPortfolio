import React from 'react';

export const Contact: React.FC = () => {
    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col">
                <label className="text-sm">Email:</label>
                <input type="email" className="border-2 border-retro-in px-1" />
            </div>
            <button className="px-4 py-1 bg-retro-gray shadow-retro active:shadow-retro-in">Send</button>
        </form>
    );
};
