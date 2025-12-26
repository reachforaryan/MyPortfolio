import { useState } from 'react';
import { Desktop } from '@/components/layout/Desktop';
import { Taskbar } from '@/components/layout/Taskbar';
import { Window } from '@/components/ui/Window';
import { DesktopIcon } from '@/components/ui/DesktopIcon';

function App() {
  const [windows, setWindows] = useState({
    about: true,
    projects: false,
    contact: false,
  });

  const toggleWindow = (key: keyof typeof windows) => {
    setWindows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Desktop>
      <div className="p-4 flex flex-col gap-4 flex-wrap h-[calc(100vh-40px)] content-start">
        <DesktopIcon
          label="About Me"
          icon="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png"
          onClick={() => toggleWindow('about')}
        />
        <DesktopIcon
          label="Projects"
          icon="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png"
          onClick={() => toggleWindow('projects')}
        />
        <DesktopIcon
          label="Contact"
          icon="https://win98icons.alexmeub.com/icons/png/envelope_closed-0.png"
          onClick={() => toggleWindow('contact')}
        />
        <DesktopIcon
          label="Recycle Bin"
          icon="https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png"
          onClick={() => alert("Trash is empty!")}
        />
      </div>

      <Window
        title="About Me"
        isOpen={windows.about}
        onClose={() => toggleWindow('about')}
        defaultPosition={{ x: 100, y: 50 }}
        className="w-[400px]"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" className="w-16 h-16" />
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
              <li>UI/UX Design</li>
            </ul>
          </fieldset>
        </div>
      </Window>

      <Window
        title="Projects"
        isOpen={windows.projects}
        onClose={() => toggleWindow('projects')}
        defaultPosition={{ x: 150, y: 100 }}
        className="w-[500px]"
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="border-2 border-retro-in p-2 bg-white">
            <h3 className="font-bold">Retro Portfolio</h3>
            <p className="text-sm text-gray-600">This very website!</p>
            <button className="mt-2 px-2 py-1 bg-retro-gray shadow-retro active:shadow-retro-in text-sm">View Code</button>
          </div>
          <div className="border-2 border-retro-in p-2 bg-white">
            <h3 className="font-bold">E-Commerce App</h3>
            <p className="text-sm text-gray-600">A modern shopping experience.</p>
            <button className="mt-2 px-2 py-1 bg-retro-gray shadow-retro active:shadow-retro-in text-sm">View Code</button>
          </div>
        </div>
      </Window>

      <Window
        title="Contact"
        isOpen={windows.contact}
        onClose={() => toggleWindow('contact')}
        defaultPosition={{ x: 200, y: 150 }}
        className="w-[300px]"
      >
        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col">
            <label className="text-sm">Name:</label>
            <input type="text" className="border-2 border-retro-in px-1" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm">Email:</label>
            <input type="email" className="border-2 border-retro-in px-1" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm">Message:</label>
            <textarea className="border-2 border-retro-in px-1 h-20" />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-1 bg-retro-gray shadow-retro active:shadow-retro-in">Send</button>
          </div>
        </form>
      </Window>

      <Taskbar />
    </Desktop>
  );
}

export default App;
