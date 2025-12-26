import React, { useState, useRef, useEffect } from 'react';

interface TerminalProps {
    onOpenWindow: (id: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onOpenWindow }) => {
    const [history, setHistory] = useState<string[]>([
        "Microsoft(R) Windows 95",
        "   (C)Copyright Microsoft Corp 1981-1996.",
        ""
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
        const cmd = input.trim().toLowerCase();

        let output: string[] = [`C:\\USERS\\GUEST> ${input}`];

        switch (cmd) {
            case 'help':
                output.push("Available commands:");
                output.push("  HELP     - Show this list");
                output.push("  LS       - List applications");
                output.push("  OPEN [name] - Open an application (e.g., 'open projects')");
                output.push("  CLEAR    - Clear screen");
                output.push("  WHOAMI   - Print current user");
                break;
            case 'ls':
            case 'dir':
                output.push(" Directory of C:\\USERS\\GUEST\\DESKTOP");
                output.push("");
                output.push("ABOUT          <DIR>");
                output.push("PROJECTS       <DIR>");
                output.push("CONTACT        <DIR>");
                output.push("SKILLS.TXT     124 bytes");
                output.push("");
                break;
            case 'whoami':
                output.push("guest");
                break;
            case 'clear':
            case 'cls':
                setHistory([]);
                setInput("");
                return; // Early return to avoid adding history
            default:
                if (cmd.startsWith('open ')) {
                    const appName = cmd.replace('open ', '').trim();
                    if (['about', 'projects', 'contact'].includes(appName)) {
                        onOpenWindow(appName);
                        output.push(`Opening ${appName}...`);
                    } else {
                        output.push(`Application '${appName}' not found.`);
                    }
                } else if (cmd === '') {
                    // Do nothing for empty input
                } else {
                    output.push(`'${cmd}' is not recognized as an internal or external command.`);
                }
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
