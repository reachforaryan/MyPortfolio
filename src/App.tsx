import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  type WindowId,
  type WindowState,
  type RiceConfigState,
  INITIAL_WINDOWS,
  INITIAL_RICE_CONFIG
} from '@/config';

import { Desktop } from '@/components/layout/Desktop';
import { Taskbar } from '@/components/layout/Taskbar';
import { Window } from '@/components/ui/Window';
import { DesktopIcon } from '@/components/ui/DesktopIcon';
import hdBackground from '@/assets/hd.png';

// App Components
import { AboutMe } from '@/components/apps/AboutMe';
import { Projects } from '@/components/apps/Projects';
import { Contact } from '@/components/apps/Contact';
import { Terminal } from '@/components/apps/Terminal';
import { HubExplorer } from '@/components/apps/HubExplorer';
import { RiceConfig } from '@/components/apps/RiceConfig';
import { MusicPlayer } from '@/components/apps/MusicPlayer';

function App() {
  const [windows, setWindows] = useLocalStorage<Record<WindowId, WindowState>>('desktop:windows', INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useLocalStorage<WindowId | null>('desktop:activeWindowId', 'about');
  const [isHdBackground, setIsHdBackground] = useLocalStorage('desktop:isHdBackground', false);
  const [riceConfig, setRiceConfig] = useLocalStorage<RiceConfigState>('desktop:riceConfig', INITIAL_RICE_CONFIG);

  const focusWindow = (id: WindowId) => {
    setActiveWindowId(id);
  };

  const toggleWindow = (id: string) => {
    const winId = id as WindowId;
    if (!windows[winId]) return; // Guard against invalid IDs from Terminal

    setWindows(prev => {
      const isOpen = !prev[winId].isOpen;
      return {
        ...prev,
        [winId]: {
          ...prev[winId],
          isOpen,
          isMinimized: false
        }
      };
    });
    if (!windows[winId].isOpen) setActiveWindowId(winId);
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
        return <AboutMe />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'terminal':
        return <Terminal onOpenWindow={toggleWindow} />;
      case 'hub':
        return <HubExplorer />;
      case 'rice':
        return <RiceConfig config={riceConfig} onUpdate={(updates) => setRiceConfig(prev => ({ ...prev, ...updates }))} />;
      case 'music':
        return <MusicPlayer />;
      default:
        return null;
    }
  };

  // Get visible windows for tiling
  const visibleWindows = Object.values(windows).filter(w => w.isOpen && !w.isMinimized);

  return (
    <Desktop backgroundImage={isHdBackground ? hdBackground : undefined} enableCrt={riceConfig.showCrt}>
      {/* Sidebar - Persistent Desktop Icons (Stage Manager) */}
      <div className="flex flex-col flex-wrap gap-x-2 gap-y-6 h-full pt-4 content-start w-auto max-w-[50vw]">
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
          label="Terminal"
          icon="https://win98icons.alexmeub.com/icons/png/console_prompt-0.png"
          onClick={() => toggleWindow('terminal')}
        />
        <DesktopIcon
          label="GitHub"
          icon="/github.png"
          onClick={() => toggleWindow('hub')}
        />
        <DesktopIcon
          label="Music"
          icon="https://win98icons.alexmeub.com/icons/png/cd_audio_cd-1.png"
          onClick={() => toggleWindow('music')}
        />
        <DesktopIcon
          label="Recycle Bin"
          icon="https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png"
          onClick={() => alert("Trash is empty!")}
        />
      </div>

      {/* Workspace - Tiling Area */}
      {/* Workspace - Grid Area */}
      <div
        className="flex-1 grid overflow-hidden h-full transition-all duration-300"
        style={{
          gap: `${riceConfig.gap}px`,
          gridTemplateColumns: visibleWindows.length > 0
            ? `repeat(${Math.ceil(Math.sqrt(visibleWindows.length))}, minmax(0, 1fr))`
            : '1fr',
          gridTemplateRows: visibleWindows.length > 0
            ? `repeat(${Math.ceil(visibleWindows.length / Math.ceil(Math.sqrt(visibleWindows.length)))}, minmax(0, 1fr))`
            : '1fr'
        }}
      >
        {visibleWindows.map((win) => (
          <Window
            key={win.id}
            title={win.title}
            isOpen={true}
            onClose={() => toggleWindow(win.id)}
            isActive={activeWindowId === win.id}
            onFocus={() => focusWindow(win.id)}
            className="w-full h-full transition-all duration-300 min-h-0"
            style={{
              borderColor: riceConfig.theme === 'cyberpunk' ? '#facc15' : riceConfig.theme === 'vaporwave' ? '#f472b6' : undefined,
              boxShadow: riceConfig.showGlow
                ? (riceConfig.theme === 'cyberpunk' ? '0 0 15px #facc15' : '0 0 15px #f472b6')
                : undefined
            }}
          >
            {renderWindowContent(win.id)}
          </Window>
        ))}
      </div>

      <Taskbar
        windows={Object.values(windows).filter(w => w.isOpen)}
        activeWindowId={activeWindowId}
        onToggleWindow={traverseWindow}
        onToggleTheme={() => setIsHdBackground(!isHdBackground)}
        config={riceConfig}
        onUpdateConfig={(updates) => setRiceConfig(prev => ({ ...prev, ...updates }))}
      />
    </Desktop>
  );
}

export default App;
