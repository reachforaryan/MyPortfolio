import React from 'react';

export const AboutMe: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" className="w-16 h-16" alt="About Me" />
                <div>
                    <h2 className="text-xl font-bold mb-2">Welcome to my Portfolio!</h2>
                    <p className="mb-2">I am a passionate developer who loves retro aesthetics and modern web technologies.</p>
                    <p>This site is built with React, Tailwind CSS, and Shadcn UI, styled to look like Windows 95.</p>
                </div>
            </div>
            <fieldset className="border-2 border-retro-white border-t-retro-dark-gray border-l-retro-dark-gray p-2">
                <legend className="px-1">Skills</legend>
                <ul className="list-disc list-inside">
                    <li>React & TypeScript</li>
                    <li>Tailwind CSS</li>
                    <li>Node.js</li>
                </ul>
            </fieldset>
        </div>
    );
};
