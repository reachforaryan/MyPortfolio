import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Folder } from 'lucide-react';

import { PROJECTS_CONFIG } from '@/config';

export const Projects: React.FC = () => {
    return (
        <div className="h-full p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-6">
                {PROJECTS_CONFIG.map((project, i) => (
                    <motion.div
                        key={project.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        whileHover={{ scale: 1.02, translateX: 5 }}
                        className="group relative p-5 rounded-xl bg-black/40 border border-white/5 overflow-hidden hover:border-white/20 transition-colors"
                    >
                        {/* Glow Gradient Background on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                        <div className="relative z-10 flex flex-col gap-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${project.color} bg-opacity-20`}>
                                        <Folder size={20} className="text-white drop-shadow-md" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-vapor-blue transition-colors">
                                        {project.title}
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                        <Github size={16} />
                                    </button>
                                    <button className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 font-light leading-relaxed">
                                {project.desc}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded bg-white/5 text-gray-300 border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
