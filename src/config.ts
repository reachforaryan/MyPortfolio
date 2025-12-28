export type WindowId = 'about' | 'projects' | 'contact' | 'terminal' | 'hub' | 'rice' | 'music';

export interface WindowState {
    id: WindowId;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
}

export const INITIAL_WINDOWS: Record<WindowId, WindowState> = {
    about: { id: 'about', title: 'About Me', isOpen: true, isMinimized: false },
    projects: { id: 'projects', title: 'Projects', isOpen: false, isMinimized: false },
    contact: { id: 'contact', title: 'Contact', isOpen: false, isMinimized: false },
    terminal: { id: 'terminal', title: 'Terminal', isOpen: false, isMinimized: false },
    hub: { id: 'hub', title: 'Hub Explorer', isOpen: false, isMinimized: false },
    rice: { id: 'rice', title: 'Rice Config', isOpen: false, isMinimized: false },
    music: { id: 'music', title: 'VaporWaves', isOpen: false, isMinimized: false },
};

export type Theme = 'retro' | 'cyberpunk' | 'vaporwave';

export interface RiceConfigState {
    gap: number;
    theme: Theme;
    showGlow: boolean;
    showCrt: boolean;
}

export const INITIAL_RICE_CONFIG: RiceConfigState = {
    gap: 16,
    theme: 'retro',
    showGlow: false,
    showCrt: true,
};

export const DESKTOP_PET_CONFIG = {
    SPRITE_SHEET: '/sheep.png',
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 32,
    WALK_FRAMES: 6,
    IDLE_FRAMES: 4,
    ANIMATION_SPEED: 150,
    MOVE_SPEED: 0.1,
    IDLE_CHANCE: 0.005,
    JUMP_DISTANCE: 120,
    JUMP_HEIGHT: 140,
    JUMP_DURATION: 800,
    THOUGHTS: [
        "No cap, nice wallpaper.",
        "Searching for grass...",
        "Is that a virus?",
        "404: Grass not found",
        "Can I eat your RAM?",
        "baaa.",
        "I'm watching you...",
        "Click me again!",
        "Parkour!",
        "Boing!"
    ]
};

export const ABOUT_ME_CONFIG = {
    GREETING: "Aryan Singh",
    AVATAR_URL: "https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png",
    TITLE: "Computer Science Undergrad @ VIT Vellore | OCI Certified GenAI Professional",
    BIO: "I am a Digital Artisan building software that feels alive. I bridge the gap between complex AI research and high-performance user experiences, focusing on systems that can see, reason, and adapt.",
    AI_FOCUS: [
        { title: "Agentic Frameworks", description: "Crafting collaborative AI workflows." },
        { title: "Visual Intelligence", description: "Developing models that understand human sentiment." },
        { title: "Healthcare AI", description: "Applying deep learning to biomedical signal analysis." }
    ],
    STACK: {
        logic: ["Python", "Java", "SQL"],
        intelligence: ["PyTorch", "Transformers", "LangChain", "CrewAI"],
        interface: ["React", "TypeScript", "Tailwind CSS"],
        cloud: ["Oracle Cloud (OCI)", "Azure", "AWS"]
    },
    SOCIAL_LINKS: [
        { label: "GitHub", url: "https://github.com/reachforaryan" },
        { label: "LinkedIn", url: "https://linkedin.com/in/reachforaryan" },
        { label: "Email", url: "mailto:reachforaryan@gmail.com" }
    ],
    QUOTE: "\"Design is not just what it looks like and feels like. Design is how it works.\""
};
