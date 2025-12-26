import React from 'react';

export const Projects: React.FC = () => {
    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="border-2 border-retro-in p-2 bg-white">
                <h3 className="font-bold">Retro Portfolio</h3>
                <p className="text-sm text-gray-600">This very website!</p>
            </div>
            <div className="border-2 border-retro-in p-2 bg-white">
                <h3 className="font-bold">E-Commerce App</h3>
                <p className="text-sm text-gray-600">A modern shopping experience.</p>
            </div>
        </div>
    );
};
