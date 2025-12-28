import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft, Calendar, Tag, BookOpen } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    content: string; // Markdown supported ideally, but plain text/HTML for now
    tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: 'The Future of Agentic AI',
        date: '2024-12-25',
        excerpt: 'How multi-agent systems are reshaping the landscape of automation and creativity.',
        content: `
# The Future of Agentic AI

As we move beyond simple chatbots, the era of **Agentic AI** is dawnng. These are not just responders; they are doers.

## What is Agentic AI?
Agentic AI refers to systems that can autonomously pursue complex goals, breaking them down into sub-tasks, and executing them with tools.

### Key Characteristics:
- **Autonomy**: Ability to work without constant human oversight.
- **Tool Use**: Leveraging APIs, filesystems, and browsers.
- **Planning**: Breaking down high-level goals.

The future is collaborative, where humans set the strategy and AI agents execute the tactics.
        `,
        tags: ['AI', 'Future', 'Tech']
    },
    {
        id: '2',
        title: 'Designing Retro Interfaces in 2024',
        date: '2024-11-15',
        excerpt: 'Why nostalgia works: A deep dive into the psychology of retro aesthetics in modern web design.',
        content: `
# Designing Retro Interfaces in 2024

Why do we love the aesthetics of Windows 95 or the neon glow of Cyberpunk?

## The Power of Nostalgia
It's not just about looks. It's about a feeling of tangibility. Old interfaces had depth, they had clear affordances. A button looked like a button.

## Making it Modern
We don't just copy; we enhance.
- **Glassmorphism**: Adding depth with blur.
- **Micro-interactions**: Subtle animations that make the "old" feel alive.
- **Performance**: Building these with React and Tailwind ensures 60fps smoothness.
        `,
        tags: ['Design', 'UI/UX', 'Retro']
    },
    {
        id: '3',
        title: 'Building a Portfolio that Lives',
        date: '2024-10-30',
        excerpt: 'Static sites are boring. Here is how I built a portfolio that acts like a functional OS.',
        content: `
# Building a Portfolio that Lives

Most portfolios are single-page scrolls. I wanted mine to be an experience.

## The Concept
A web-based Operating System. It tells the user: "I can build complex systems."

## The Stack
- **React**: For component-based UI.
- **Tailwind CSS**: For rapid styling.
- **Framer Motion**: For shared layout animations.

The result is what you see now. A playground for my projects and ideas.
        `,
        tags: ['Portfolio', 'DevLog', 'React']
    }
];

export const Blog: React.FC = () => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    return (
        <div className="h-full flex flex-col font-sans text-retro-black">
            {/* Header / Navigation */}
            <div className="p-4 border-b border-black/10 flex items-center bg-white/40 sticky top-0 backdrop-blur-sm z-10">
                {selectedPost ? (
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/40 border border-black/5 rounded transition-colors text-sm font-bold"
                    >
                        <ArrowLeft size={16} />
                        Back to Posts
                    </button>
                ) : (
                    <div className="flex items-center gap-2 font-bold text-lg text-vapor-purple">
                        <BookOpen className="w-6 h-6" />
                        <span>Aryan's Blog (Placeholders)</span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {selectedPost ? (
                    // Detail View
                    <article className="max-w-3xl mx-auto bg-white/5 p-6 rounded-lg border border-black/5 animate-in slide-in-from-right-4 duration-300">
                        <div className="mb-6 border-b border-black/10 pb-4">
                            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-vapor-purple to-vapor-blue">
                                {selectedPost.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {selectedPost.date}
                                </span>
                                <div className="flex gap-2">
                                    {selectedPost.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-vapor-blue/10 text-vapor-blue rounded-full text-xs border border-vapor-blue/20">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-gray-200">
                            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                                {selectedPost.content}
                            </pre>
                        </div>
                    </article>
                ) : (
                    // List View
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        {BLOG_POSTS.map(post => (
                            <div
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className={cn(
                                    "group cursor-pointer p-5 bg-white/5 hover:bg-white/10 border border-black/5 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                                    "flex flex-col h-full"
                                )}
                            >
                                <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-vapor-blue transition-colors">
                                    {post.title}
                                </h3>
                                <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                                    <Calendar size={12} /> {post.date}
                                </div>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="flex items-center gap-1 text-xs text-xs px-2 py-1 bg-black/20 rounded text-gray-400">
                                            <Tag size={10} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
