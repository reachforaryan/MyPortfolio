import React, { useState, useEffect, useRef } from 'react';

// Sprite configuration based on 32x32 grid
const SPRITE_SHEET = '/sheep.png'; // Ensure this path is correct in your public folder
const FRAME_WIDTH = 32;
const FRAME_HEIGHT = 32;
const WALK_FRAMES = 6;
const IDLE_FRAMES = 4;
const ANIMATION_SPEED = 150;

// Movement configuration
const MOVE_SPEED = 0.1; // Pixels per ms (0.1 is roughly 100px/sec)
const IDLE_CHANCE = 0.005; // Slightly lower chance for more natural behavior

const thoughts = ["No cap, nice wallpaper.", "Searching for grass...", "Is that a virus?", "404: Grass not found", "Can I eat your RAM?", "baaa.", "I'm watching you...", "Click me again!"];

export const DesktopPet: React.FC = () => {
    // Position and State
    const [pos, setPos] = useState({ x: window.innerWidth / 2, targetX: window.innerWidth / 2 });
    const [isIdle, setIsIdle] = useState(true);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [frame, setFrame] = useState(0);
    const [thought, setThought] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    const lastUpdateRef = useRef(Date.now());
    const frameTimerRef = useRef(0);

    const handlePetClick = () => {
        if (thought) return; // Don't spam
        const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
        setThought(randomThought);
        setTimeout(() => setThought(""), 3000);

        // Also make it jump or pause? For now just talk.
        setIsIdle(true); // Stop to talk
    };

    useEffect(() => {
        let animationId: number;

        const updateLoop = () => {
            const now = Date.now();
            const delta = now - lastUpdateRef.current;
            lastUpdateRef.current = now;

            if (isHovered) {
                // Just play the idle/sniffing animation, don't update X position
                frameTimerRef.current += delta;
                if (frameTimerRef.current >= ANIMATION_SPEED) {
                    setFrame((prev) => (prev + 1) % IDLE_FRAMES);
                    frameTimerRef.current = 0;
                }
            } else if (isIdle) {
                // 1. AI Decision: Should I move?
                // Only move if not thinking
                if (!thought && Math.random() < IDLE_CHANCE) {
                    const newTarget = Math.random() * (window.innerWidth - FRAME_WIDTH);
                    setPos(prev => ({ ...prev, targetX: newTarget }));
                    setDirection(newTarget > pos.x ? 'right' : 'left');
                    setIsIdle(false);
                    setFrame(0); // Reset animation to start of walk
                }

                // Idle Animation Logic
                frameTimerRef.current += delta;
                if (frameTimerRef.current >= ANIMATION_SPEED) {
                    setFrame((prev) => (prev + 1) % IDLE_FRAMES);
                    frameTimerRef.current = 0;
                }
            } else {
                // 2. Movement Logic
                const dist = pos.targetX - pos.x;
                const moveDist = MOVE_SPEED * delta;

                if (Math.abs(dist) < moveDist) {
                    // Arrived at destination
                    setPos(prev => ({ ...prev, x: prev.targetX }));
                    setIsIdle(true);
                    setFrame(0); // Reset animation to start of idle
                } else {
                    // Move sheep
                    const directionMultiplier = dist > 0 ? 1 : -1;
                    setPos(prev => ({ ...prev, x: prev.x + (moveDist * directionMultiplier) }));

                    // Walking Animation Logic
                    frameTimerRef.current += delta;
                    if (frameTimerRef.current >= ANIMATION_SPEED) {
                        setFrame((prev) => (prev + 1) % WALK_FRAMES);
                        frameTimerRef.current = 0;
                    }
                }
            }
            animationId = requestAnimationFrame(updateLoop);
        };

        animationId = requestAnimationFrame(updateLoop);
        return () => cancelAnimationFrame(animationId);
    }, [isIdle, pos.targetX, pos.x, thought, isHovered]); // Added isHovered dependency

    // --- Sprite Mapping Logic ---
    // Row 2: Walk Left, Row 3: Walk Right
    // Row 6: Idle Left, Row 7: Idle Right
    const getRow = () => {
        // If mouse is over sheep, use Idle rows (6 or 7) to look like sniffing
        if (isHovered || isIdle) {
            return direction === 'right' ? 7 : 6;
        }
        return direction === 'right' ? 3 : 2;
    };

    const spriteX = -(frame * FRAME_WIDTH);
    const spriteY = -(getRow() * FRAME_HEIGHT);

    return (
        <div
            className="fixed bottom-20 z-[40] transition-none" // Removed pointer-events-none from container to allow children events if needed, but safer to keep it and enable on child.
            style={{
                left: `${pos.x}px`,
                transform: `translateX(-50%)`, // Removing scale from container to handle bubble scaling separately or just apply to inner
                width: 0, // Zero width container to avoid blocking clicks around it
                height: 0,
                overflow: 'visible'
            }}
        >
            {/* Wrapper for scale and interaction */}
            <div
                className="relative cursor-help pointer-events-auto group"
                onClick={handlePetClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    transform: `scale(2)`,
                    transformOrigin: 'bottom center',
                    width: FRAME_WIDTH,
                    height: FRAME_HEIGHT,
                }}
            >
                {/* Thought Bubble */}
                {thought && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border-2 border-black px-2 py-1 rounded-lg text-[8px] whitespace-nowrap shadow-lg z-50 font-bold animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                        {thought}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b-2 border-r-2 border-black rotate-45 transform"></div>
                    </div>
                )}

                {/* Sniff Sniff Text */}
                {isHovered && !thought && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] bg-black text-white px-1 uppercase pixel-font whitespace-nowrap z-50 animate-bounce">
                        *Sniff Sniff*
                    </div>
                )}

                <div
                    style={{
                        width: FRAME_WIDTH,
                        height: FRAME_HEIGHT,
                        backgroundImage: `url(${SPRITE_SHEET})`,
                        backgroundPosition: `${spriteX}px ${spriteY}px`,
                        backgroundSize: `192px 256px`, // Total sheet size
                        imageRendering: 'pixelated',
                    }}
                />
            </div>
        </div>
    );
};