import { useState } from 'react';
import { Desktop } from '@/components/layout/Desktop';
import { Taskbar } from '@/components/layout/Taskbar';
import { Window } from '@/components/ui/Window';
import { DesktopIcon } from '@/components/ui/DesktopIcon';
import hdBackground from '@/assets/hd.png';

export type WindowId = 'about' | 'projects' | 'contact';

interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
}

const INITIAL_WINDOWS: Record<WindowId, WindowState> = {
  about: { id: 'about', title: 'About Me', isOpen: true, isMinimized: false },
  projects: { id: 'projects', title: 'Projects', isOpen: false, isMinimized: false },
  contact: { id: 'contact', title: 'Contact', isOpen: false, isMinimized: false },
};

function App() {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('about');
  const [isHdBackground, setIsHdBackground] = useState(false);

  const focusWindow = (id: WindowId) => {
    setActiveWindowId(id);
  };

  const toggleWindow = (id: WindowId) => {
    setWindows(prev => {
      const isOpen = !prev[id].isOpen;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          isOpen,
          isMinimized: false
        }
      };
    });
    if (!windows[id].isOpen) setActiveWindowId(id);
  };

  const traverseWindow = (id: WindowId) => {
    // Toggle minimize/restore
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: !prev[id].isMinimized
      }
    }));
    if (!windows[id].isMinimized) setActiveWindowId(id);
  };

  // Get visible windows for tiling
  const visibleWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized);

  return (
    <Desktop backgroundImage={isHdBackground ? hdBackground : undefined}>
      {/* Sidebar - Persistent Desktop Icons (Stage Manager) */}
      <div className="flex flex-col gap-6 w-[100px] h-full pt-4">
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

      {/* Workspace - Tiling Area */}
      <div className="flex-1 flex gap-4 overflow-hidden h-full">
        {visibleWindows.length > 0 && visibleWindows.map(win => (
          <Window
            key={win.id}
            title={win.title}
            isOpen={true} // Always open if in this list
            onClose={() => toggleWindow(win.id)}
            isActive={activeWindowId === win.id}
            onFocus={() => focusWindow(win.id)}
            className="animate-in fade-in zoom-in duration-300"
          >
            {/* Custom Content based on ID */}
            {win.id === 'about' && (
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
                  </ul>
                </fieldset>
              </div>
            )}
            {win.id === 'projects' && (
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
            )}
            {win.id === 'contact' && (
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col">
                  <label className="text-sm">Email:</label>
                  <input type="email" className="border-2 border-retro-in px-1" />
                </div>
                <button className="px-4 py-1 bg-retro-gray shadow-retro active:shadow-retro-in">Send</button>
              </form>
            )}
          </Window>
        ))}
      </div>

      <Taskbar
        windows={Object.values(windows).filter(w => w.isOpen)}
        activeWindowId={activeWindowId}
        onToggleWindow={traverseWindow}
        onToggleTheme={() => setIsHdBackground(!isHdBackground)}
      />
    </Desktop>
  );
}

export default App;
