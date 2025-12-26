import { useState } from 'react';
import { cn } from '@/lib/utils';
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

  const renderWindowContent = (id: WindowId) => {
    switch (id) {
      case 'about':
        return (
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
        );
      case 'projects':
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
      case 'contact':
        return (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col">
              <label className="text-sm">Email:</label>
              <input type="email" className="border-2 border-retro-in px-1" />
            </div>
            <button className="px-4 py-1 bg-retro-gray shadow-retro active:shadow-retro-in">Send</button>
          </form>
        );
      default:
        return null;
    }
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
        {visibleWindows.length > 0 && (
          <>
            {/* Master Column (First Window) */}
            <div className={cn("flex flex-col gap-4 h-full transition-all duration-300", visibleWindows.length > 1 ? "w-1/2" : "w-full")}>
              <Window
                key={visibleWindows[0].id}
                title={visibleWindows[0].title}
                isOpen={true}
                onClose={() => toggleWindow(visibleWindows[0].id)}
                isActive={activeWindowId === visibleWindows[0].id}
                onFocus={() => focusWindow(visibleWindows[0].id)}
                className="h-full"
              >
                {/* Content Logic (Duplicated for now, should extract to component ideally) */}
                {renderWindowContent(visibleWindows[0].id)}
              </Window>
            </div>

            {/* Stack Column (Remaining Windows) */}
            {visibleWindows.length > 1 && (
              <div className="flex flex-col gap-4 h-full w-1/2 transition-all duration-300">
                {visibleWindows.slice(1).map(win => (
                  <Window
                    key={win.id}
                    title={win.title}
                    isOpen={true}
                    onClose={() => toggleWindow(win.id)}
                    isActive={activeWindowId === win.id}
                    onFocus={() => focusWindow(win.id)}
                    className="h-auto min-h-0" // Override h-full to allow vertical splitting
                  >
                    {renderWindowContent(win.id)}
                  </Window>
                ))}
              </div>
            )}
          </>
        )}
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
