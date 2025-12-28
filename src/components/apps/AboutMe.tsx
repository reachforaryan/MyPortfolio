import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Code, Sparkles, Brain, Cpu, Cloud, Laptop, ExternalLink, Github, Linkedin, Mail, Download } from 'lucide-react';
import { ABOUT_ME_CONFIG } from '@/config';

export const AboutMe: React.FC = () => {
    const { GREETING, AVATAR_URL, TITLE, BIO, STACK, AI_FOCUS, SOCIAL_LINKS, RESUME_URL, RESUME_FILENAME } = ABOUT_ME_CONFIG;

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 20, scale: 0.98, filter: "blur(4px)" },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 20
            }
        }
    };

    return (
        <div className="h-full p-6 text-vapor-blue font-sans overflow-y-auto custom-scrollbar">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-6 max-w-4xl mx-auto"
            >
                {/* Header Profile */}
                <motion.div variants={item} className="relative flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg text-center md:text-left shadow-vapor-pink/10">
                    {/* Socials - Top Right */}

                    <div className="absolute top-4 right-4 flex gap-2">
                        {SOCIAL_LINKS.map((link, i) => {
                            const Icon = link.label === "GitHub" ? Github : link.label === "LinkedIn" ? Linkedin : link.label === "Email" ? Mail : ExternalLink;
                            return (
                                <motion.a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + (i * 0.1), type: "spring", stiffness: 200, damping: 15 }}
                                    whileHover={{ scale: 1.1, rotate: 10, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                                    className="flex items-center justify-center w-8 h-8 bg-white/5 hover:bg-white/20 rounded-full text-vapor-blue transition-all border border-white/10 hover:border-vapor-blue/50"
                                    title={link.label}
                                >
                                    <Icon size={14} />
                                </motion.a>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.2 }}
                        whileHover={{ rotate: 10, scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                        className="w-24 h-24 rounded-full bg-gradient-to-tr from-vapor-purple to-vapor-pink p-[2px] shadow-[0_0_20px_rgba(244,184,228,0.4)] shrink-0"
                    >
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                            <img src={AVATAR_URL} className="w-16 h-16 drop-shadow-md z-10" alt="Avatar" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                        </div>
                    </motion.div>

                    <div className="w-fit pr-12"> {/* Padding right to avoid overlap with socials */}
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h1 className="text-4xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vapor-pink to-vapor-purple drop-shadow break-words w-fit">
                                {GREETING}
                            </h1>
                            <a
                                href={RESUME_URL}
                                download={RESUME_FILENAME}
                                className="flex items-center gap-2 px-3 py-1.5 bg-vapor-purple/10 hover:bg-vapor-purple/20 border border-vapor-purple/30 rounded-full text-xs font-bold text-vapor-purple transition-all hover:scale-105 active:scale-95 w-fit h-fit"
                            >
                                <Download size={14} />
                                <span>Resume</span>
                            </a>
                        </div>
                        <p className="text-vapor-blue/80 text-sm md:text-base font-medium flex flex-col md:flex-row items-center gap-2 justify-center md:justify-start">
                            <Sparkles size={16} className="text-vapor-mint" />
                            <span>{TITLE}</span>
                        </p>
                        <p className="mt-4 text-gray-300 leading-relaxed text-sm md:text-base max-w-2xl">
                            {BIO}
                        </p>
                    </div>
                </motion.div>

                {/* AI Focus Section */}
                <motion.div variants={item}>
                    <h3 className="flex items-center gap-2 text-xl font-bold text-vapor-pink mb-4">
                        <Brain size={20} /> AI Focus
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {AI_FOCUS.map((focus, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05, y: -5, backgroundColor: "rgba(255,255,255,0.08)", transition: { type: "spring", stiffness: 300, damping: 20 } }}
                                className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-vapor-purple/50 transition-all duration-300 group"
                            >
                                <h4 className="font-bold text-vapor-mint mb-1 group-hover:text-vapor-pink transition-colors">{focus.title}</h4>
                                <p className="text-xs text-gray-400 leading-snug">{focus.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* The Stack Section */}
                <motion.div variants={item} className="mb-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-vapor-mint mb-4">
                        <Cpu size={20} /> The Stack
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Logic */}
                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors">
                            <h4 className="flex items-center gap-2 font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">
                                <Code size={14} /> Logic
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {STACK.logic.map((tech, i) => (
                                    <motion.span
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + (i * 0.05) }}
                                        whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                                        className="px-2 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded text-xs cursor-default"
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Intelligence */}
                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors">
                            <h4 className="flex items-center gap-2 font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">
                                <Brain size={14} /> Intelligence
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {STACK.intelligence.map((tech, i) => (
                                    <motion.span
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + (i * 0.05) }}
                                        whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                                        className="px-2 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded text-xs cursor-default"
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Interface */}
                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-pink-500/30 transition-colors">
                            <h4 className="flex items-center gap-2 font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">
                                <Laptop size={14} /> Interface
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {STACK.interface.map((tech, i) => (
                                    <motion.span
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + (i * 0.05) }}
                                        whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                                        className="px-2 py-1 bg-pink-500/10 text-pink-300 border border-pink-500/20 rounded text-xs cursor-default"
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Cloud */}
                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-yellow-500/30 transition-colors">
                            <h4 className="flex items-center gap-2 font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">
                                <Cloud size={14} /> Cloud
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {STACK.cloud.map((tech, i) => (
                                    <motion.span
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.6 + (i * 0.05) }}
                                        whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                                        className="px-2 py-1 bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 rounded text-xs cursor-default"
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
