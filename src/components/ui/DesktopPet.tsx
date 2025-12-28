import React, { useState, useEffect, useRef } from 'react';
import { DESKTOP_PET_CONFIG } from '@/config';

const {
    SPRITE_SHEET,
    FRAME_WIDTH,
    FRAME_HEIGHT,
    WALK_FRAMES,
    IDLE_FRAMES,
    ANIMATION_SPEED,
    MOVE_SPEED,
    IDLE_CHANCE,
    JUMP_DISTANCE,
    JUMP_HEIGHT,
    JUMP_DURATION,
    THOUGHTS
} = DESKTOP_PET_CONFIG;

export const DesktopPet: React.FC = () => {
    // Position and State
    const [pos, setPos] = useState({ x: window.innerWidth / 2, targetX: window.innerWidth / 2, jumpY: 0 });
    const [isIdle, setIsIdle] = useState(true);
    const [isJumping, setIsJumping] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [frame, setFrame] = useState(0);
    const [thought, setThought] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    const lastUpdateRef = useRef(Date.now());
    const frameTimerRef = useRef(0);
    const jumpRef = useRef({ progress: 0, startX: 0, targetX: 0 });

    const handlePetClick = () => {
        if (thought) return; // Don't spam
        const randomThought = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
        setThought(randomThought);
        setTimeout(() => setThought(""), 3000);

        // Also make it jump on click sometimes? or just stop
        setIsIdle(true);
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
            } else if (isJumping) {
                // 1. Progress the jump (0 to 1)
                jumpRef.current.progress += delta / JUMP_DURATION;
                const p = jumpRef.current.progress;

                if (p >= 1) {
                    // Landed
                    setPos(prev => ({ ...prev, x: jumpRef.current.targetX, jumpY: 0 }));
                    setIsJumping(false);
                    setIsIdle(true);
                    jumpRef.current.progress = 0;
                    setFrame(0);
                } else {
                    // 2. Calculate X (Linear)
                    const currentX = jumpRef.current.startX + (jumpRef.current.targetX - jumpRef.current.startX) * p;

                    // 3. Calculate Y (Parabola: -4 * height * p * (1-p)) using specific JUMP_HEIGHT
                    // This creates a smooth arc that starts and ends at 0
                    const jumpY = -4 * JUMP_HEIGHT * p * (1 - p);

                    setPos(prev => ({ ...prev, x: currentX, jumpY }));

                    // Mid-air animation (walking fast or specific pose?)
                    // Let's cycle walk frames faster in air?
                    frameTimerRef.current += delta;
                    if (frameTimerRef.current >= ANIMATION_SPEED / 2) {
                        setFrame((prev) => (prev + 1) % WALK_FRAMES);
                        frameTimerRef.current = 0;
                    }
                }
            } else if (isIdle) {
                // 1. AI Decision: Should I move or jump?
                // Only move if not thinking
                if (!thought) {
                    const r = Math.random();

                    if (r < 0.002) {
                        // JUMP!
                        const jumpRight = Math.random() > 0.5; // Random direction for jump
                        const jumpDist = jumpRight ? JUMP_DISTANCE : -JUMP_DISTANCE;
                        const newTarget = Math.max(FRAME_WIDTH, Math.min(window.innerWidth - FRAME_WIDTH, pos.x + jumpDist));

                        setDirection(jumpRight ? 'right' : 'left'); // Face correct way

                        jumpRef.current = {
                            progress: 0,
                            startX: pos.x,
                            targetX: newTarget
                        };
                        setIsJumping(true);
                        setIsIdle(false);
                    } else if (r < IDLE_CHANCE) {
                        // WALK
                        const newTarget = Math.random() * (window.innerWidth - FRAME_WIDTH);
                        setPos(prev => ({ ...prev, targetX: newTarget }));
                        setDirection(newTarget > pos.x ? 'right' : 'left');
                        setIsIdle(false);
                        setFrame(0);
                    }
                }

                // Idle Animation Logic
                frameTimerRef.current += delta;
                if (frameTimerRef.current >= ANIMATION_SPEED) {
                    setFrame((prev) => (prev + 1) % IDLE_FRAMES);
                    frameTimerRef.current = 0;
                }
            } else {
                // 2. Movement Logic (Walking)
                const dist = pos.targetX - pos.x;
                const moveDist = MOVE_SPEED * delta;

                // Should we jump while walking?
                if (Math.random() < 0.002 && Math.abs(dist) > JUMP_DISTANCE) {
                    // Trigger jump in current direction
                    const jumpRight = direction === 'right';
                    const jumpDist = jumpRight ? JUMP_DISTANCE : -JUMP_DISTANCE;
                    jumpRef.current = {
                        progress: 0,
                        startX: pos.x,
                        targetX: Math.max(0, Math.min(window.innerWidth, pos.x + jumpDist))
                    };
                    setIsJumping(true);
                }

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
    }, [isIdle, isJumping, pos.targetX, pos.x, thought, isHovered, direction]);

    // --- Sprite Mapping Logic ---
    // Row 2: Walk Left, Row 3: Walk Right
    // Row 6: Idle Left, Row 7: Idle Right
    const getRow = () => {
        // If mouse is over sheep, use Idle rows (6 or 7) to look like sniffing
        if ((isHovered || isIdle) && !isJumping) {
            return direction === 'right' ? 7 : 6;
        }
        return direction === 'right' ? 3 : 2;
    };

    const spriteX = -(frame * FRAME_WIDTH);
    const spriteY = -(getRow() * FRAME_HEIGHT);

    return (
        <div
            className="fixed bottom-20 z-[40] transition-none will-change-transform"
            style={{
                transform: `translate3d(${pos.x}px, ${pos.jumpY}px, 0) translateX(-50%)`,
                width: 0,
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
                        backgroundSize: `192px 256px`,
                        imageRendering: 'pixelated',
                    }}
                />
            </div>
        </div>
    );
};