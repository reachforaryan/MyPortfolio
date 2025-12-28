import React from 'react';
import { motion } from 'framer-motion';
import { User, Code, Heart, Sparkles } from 'lucide-react';

export const AboutMe: React.FC = () => {
    return (
        <div className="h-full p-6 text-vapor-blue font-sans overflow-y-auto custom-scrollbar">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-6"
            >
                {/* Header Profile */}
                <div className="flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg">
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.05 }}
                        className="w-24 h-24 rounded-full bg-gradient-to-tr from-vapor-purple to-vapor-pink p-[2px] shadow-[0_0_15px_rgba(244,184,228,0.4)]"
                    >
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                            {/* Placeholder Avatar or Icon */}
                            <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" className="w-16 h-16 drop-shadow-md z-10" alt="Avatar" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                        </div>
                    </motion.div>

                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vapor-pink to-vapor-purple drop-shadow"
                        >
                            Hello, I'm Batak!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-vapor-blue/80 text-sm mt-1 flex items-center gap-2"
                        >
                            <Sparkles size={14} className="text-vapor-mint" />
                            <span>Digital Artisan & Full Stack Developer</span>
                        </motion.p>
                    </div>
                </div>

                {/* Content Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bio */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-vapor-purple/30 transition-colors"
                    >
                        <h3 className="flex items-center gap-2 text-lg font-bold text-vapor-pink mb-2">
                            <User size={18} /> About
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-300">
                            I craft aesthetic digital experiences that blend retro nostalgia with modern performance.
                            My passion lies in building interactive interfaces that feel alive and responsive.
                        </p>
                    </motion.div>

                    {/* Stack */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-vapor-mint/30 transition-colors"
                    >
                        <h3 className="flex items-center gap-2 text-lg font-bold text-vapor-mint mb-2">
                            <Code size={18} /> Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'TypeScript', 'Tailwind', 'Node.js', 'Framer Motion', 'Vite'].map((tech, i) => (
                                <motion.span
                                    key={tech}
                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
                                    className="px-2 py-1 bg-white/5 text-xs rounded border border-white/10 text-vapor-blue cursor-default"
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Footer/Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-4 rounded-lg bg-gradient-to-r from-vapor-purple/10 to-transparent border-l-2 border-vapor-purple"
                >
                    <p className="italic text-sm text-gray-400 flex items-center gap-2">
                        <Heart size={14} className="text-rose-400 animate-pulse" />
                        "Design is not just what it looks like and feels like. Design is how it works."
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};
