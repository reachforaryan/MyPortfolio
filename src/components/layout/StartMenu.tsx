export interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const menuItems = [
        { label: "Programs", icon: "https://win98icons.alexmeub.com/icons/png/directory_program_group_small-4.png", hasSubmenu: true },
        { label: "Documents", icon: "https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png", hasSubmenu: true },
        { label: "Settings", icon: "https://win98icons.alexmeub.com/icons/png/settings_gear-4.png", hasSubmenu: true },
        { label: "Find", icon: "https://win98icons.alexmeub.com/icons/png/search_file-2.png", hasSubmenu: true },
        { label: "Help", icon: "https://win98icons.alexmeub.com/icons/png/help_book_small-4.png" },
        { label: "Run...", icon: "https://win98icons.alexmeub.com/icons/png/application_hourglass_small-4.png" },
        { type: "separator" },
        { label: "Shut Down...", icon: "https://win98icons.alexmeub.com/icons/png/shut_down_normal-4.png", onClick: () => alert("It's now safe to turn off your computer.") },
    ];

    return (
        <>
            {/* Click overlay to close menu */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            <div className="absolute bottom-10 left-0 w-64 bg-retro-gray border-2 border-retro-out shadow-retro z-50 flex flex-col">
                <div className="flex">
                    {/* Vertical Side Bar */}
                    <div className="w-8 bg-retro-blue text-white flex items-end justify-center pb-2">
                        <span className="-rotate-90 text-xl font-bold tracking-widest whitespace-nowrap mb-4">WINDOWS 95</span>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 p-1">
                        {menuItems.map((item, index) => (
                            item.type === "separator" ? (
                                <div key={index} className="h-[2px] bg-retro-gray-dark border-b border-white my-1 mx-1" />
                            ) : (
                                <button
                                    key={index}
                                    className="w-full text-left px-2 py-2 hover:bg-retro-blue hover:text-white flex items-center gap-2 group text-sm"
                                    onClick={item.onClick}
                                >
                                    <img src={item.icon} alt={item.label} className="w-6 h-6" />
                                    <span className="flex-1">{item.label}</span>
                                    {item.hasSubmenu && <span className="text-black group-hover:text-white">▶</span>}
                                </button>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
