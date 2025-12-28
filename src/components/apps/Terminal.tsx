import React, { useState, useRef, useEffect } from 'react';
import type { WindowId, WindowState, RiceConfigState, Theme } from '@/config';

interface TerminalProps {
    onOpenWindow: (id: string) => void;
    onCloseWindow: (id: string) => void;
    windows: Record<WindowId, WindowState>;
    config: RiceConfigState;
    onUpdateConfig: (newConfig: Partial<RiceConfigState>) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onOpenWindow, onCloseWindow, windows, config, onUpdateConfig }) => {
    const [history, setHistory] = useState<string[]>([
        "Microsoft(R) Windows 95",
        "   (C)Copyright Microsoft Corp 1981-1996.",
        "",
        "Type 'help' for available commands."
    ]);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input on click
    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const rawCmd = input.trim();
        const cmdParts = rawCmd.split(' ');
        const cmd = cmdParts[0].toLowerCase();
        const args = cmdParts.slice(1);

        let output: string[] = [`C:\\USERS\\GUEST> ${input}`];

        switch (cmd) {
            case 'help':
                output.push("Available commands:");
                output.push("  HELP                 - Show this list");
                output.push("  LS / DIR             - List applications");
                output.push("  OPEN [name]          - Open an application");
                output.push("  CLOSE [name]         - Close an application");
                output.push("  CONFIG               - View current configuration");
                output.push("  SET [key] [value]    - Change config (theme, gap, glow, crt)");
                output.push("  CLEAR / CLS          - Clear screen");
                output.push("  WHOAMI               - Print current user");
                break;
            case 'ls':
            case 'dir':
                output.push(" Directory of C:\\USERS\\GUEST\\DESKTOP");
                output.push("");
                Object.values(windows).forEach(win => {
                    output.push(`${win.id.toUpperCase().padEnd(15)} <${win.isOpen ? 'OPEN' : 'CLOSED'}>  ${win.title}`);
                });
                output.push("");
                break;
            case 'open':
                if (args.length === 0) {
                    output.push("Usage: OPEN [application_name]");
                } else {
                    const target = args[0].toLowerCase();
                    const winId = Object.keys(windows).find(k => k === target) as WindowId | undefined;

                    if (winId) {
                        if (!windows[winId].isOpen) {
                            onOpenWindow(winId);
                            output.push(`Opening ${winId}...`);
                        } else {
                            output.push(`${winId} is already open.`);
                        }
                    } else {
                        output.push(`Application '${target}' not found.`);
                    }
                }
                break;
            case 'close':
                if (args.length === 0) {
                    output.push("Usage: CLOSE [application_name]");
                } else {
                    const target = args[0].toLowerCase();
                    const winId = Object.keys(windows).find(k => k === target) as WindowId | undefined;

                    if (winId) {
                        if (windows[winId].isOpen) {
                            onCloseWindow(winId);
                            output.push(`Closing ${winId}...`);
                        } else {
                            output.push(`${winId} is not open.`);
                        }
                    } else {
                        output.push(`Application '${target}' not found.`);
                    }
                }
                break;
            case 'config':
                output.push("Current Configuration:");
                output.push(JSON.stringify(config, null, 2));
                break;
            case 'set':
                if (args.length < 2) {
                    output.push("Usage: SET [key] [value]");
                    output.push("Keys: theme, gap, glow, crt");
                } else {
                    const key = args[0].toLowerCase();
                    const val = args[1].toLowerCase();

                    if (key === 'theme') {
                        if (['retro', 'cyberpunk', 'vaporwave'].includes(val)) {
                            onUpdateConfig({ theme: val as Theme });
                            output.push(`Theme set to ${val}`);
                        } else {
                            output.push("Invalid theme. Options: retro, cyberpunk, vaporwave");
                        }
                    } else if (key === 'gap') {
                        const num = parseInt(val);
                        if (!isNaN(num)) {
                            onUpdateConfig({ gap: num });
                            output.push(`Gap set to ${num}px`);
                        } else {
                            output.push("Invalid number for gap.");
                        }
                    } else if (key === 'glow') {
                        const bool = val === 'true';
                        onUpdateConfig({ showGlow: bool });
                        output.push(`Glow effect ${bool ? 'enabled' : 'disabled'}`);
                    } else if (key === 'crt') {
                        const bool = val === 'true';
                        onUpdateConfig({ showCrt: bool });
                        output.push(`CRT effect ${bool ? 'enabled' : 'disabled'}`);
                    } else {
                        output.push(`Unknown config key: ${key}`);
                    }
                }
                break;
            case 'whoami':
                output.push("guest");
                break;
            case 'clear':
            case 'cls':
                setHistory([]);
                setInput("");
                return;
            case '':
                break;
            default:
                output.push(`'${cmd}' is not recognized as an internal or external command.`);
                break;
        }

        setHistory(prev => [...prev, ...output, ""]);
        setInput("");
    };

    return (
        <div
            className="bg-black text-green-500 font-mono p-2 h-full overflow-y-auto text-sm"
            onClick={handleContainerClick}
        >
            {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap min-h-[1.2em]">{line}</div>
            ))}

            <form onSubmit={handleCommand} className="flex">
                <span className="mr-2">C:\USERS\GUEST&gt;</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-green-500 font-mono caret-green-500"
                    autoFocus
                />
            </form>
            <div ref={bottomRef} />
        </div>
    );
};
