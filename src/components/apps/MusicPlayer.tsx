import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

// Mock Playlist
const TRACKS = [
    { title: "Resonance", artist: "Home", duration: 212 },
    { title: "Macintosh Plus", artist: "Vektroid", duration: 420 },
    { title: "Sunset", artist: "The Midnight", duration: 315 },
    { title: "Plastic Love", artist: "Mariya Takeuchi", duration: 290 },
];

export const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const currentTrack = TRACKS[currentTrackIndex];

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= currentTrack.duration) {
                        // Auto skip
                        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % TRACKS.length);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentTrack]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
        setProgress(0);
    };
    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setProgress(0);
    };

    return (
        <div className="flex flex-col h-full bg-black/20 text-vapor-blue font-sans select-none relative overflow-hidden p-4 gap-4">

            {/* Background ambiance */}
            <div className="absolute inset-0 bg-gradient-to-br from-vapor-purple/10 to-vapor-blue/10 pointer-events-none" />

            {/* Visualizer / Album Art Area */}
            <div className="flex-1 rounded-lg bg-black/30 border border-white/10 relative flex items-center justify-center overflow-hidden shadow-inner">
                {/* Spinning Vinyl/CD */}
                <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                    className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white/10 shadow-[0_0_30px_rgba(244,184,228,0.2)] flex items-center justify-center bg-zinc-900"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900" />
                    {/* Label */}
                    <div className="w-1/3 h-1/3 rounded-full bg-vapor-pink/80 flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                </motion.div>

                {/* Simulated Visualizer Bars */}
                <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-1 px-4 opacity-50">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 bg-gradient-to-t from-vapor-blue to-vapor-purple rounded-t-sm"
                            animate={{
                                height: isPlaying ? [10, Math.random() * 80 + 10, 10] : 10
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: i * 0.05
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Track Info */}
            <div className="flex flex-col items-center gap-1 z-10">
                <motion.h2
                    key={currentTrack.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold tracking-wider text-vapor-pink drop-shadow-[0_0_5px_rgba(244,184,228,0.5)]"
                >
                    {currentTrack.title}
                </motion.h2>
                <motion.p
                    key={currentTrack.artist}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-vapor-blue/80 uppercase tracking-widest"
                >
                    {currentTrack.artist}
                </motion.p>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-2 z-10 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                {/* Progress Bar */}
                <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                    <span>{formatTime(progress)}</span>
                    <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden relative group cursor-pointer">
                        <motion.div
                            className="h-full bg-vapor-mint shadow-[0_0_8px_rgba(129,236,157,0.5)]"
                            style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
                            layoutId="progress"
                        />
                    </div>
                    <span>{formatTime(currentTrack.duration)}</span>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-6 mt-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={prevTrack}
                    >
                        <SkipBack size={24} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(244,184,228,0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-vapor-pink to-vapor-purple text-black flex items-center justify-center shadow-lg shadow-vapor-pink/20"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={nextTrack}
                    >
                        <SkipForward size={24} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
