import React, { useState, useEffect } from 'react';
import { Folder, FileText, ArrowLeft, RefreshCw, Star, GitFork } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types for GitHub API
interface Repo {
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    html_url: string;
}

const GITHUB_USERNAME = 'reachforaryan'; // Default placeholder

export const HubExplorer = () => {
    const [currentPath, setCurrentPath] = useState<string>(`C:\\GITHUB\\${GITHUB_USERNAME.toUpperCase()}`);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRepos();
    }, []);

    const fetchRepos = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`);
            if (!res.ok) throw new Error('Failed to fetch repositories');
            const data = await res.json();
            setRepos(data);
        } catch (err) {
            setError('Connection to GitHub API failed.');
        } finally {
            setLoading(false);
        }
    };

    const openRepo = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <div className="flex flex-col h-full bg-retro-white text-black font-pixel">
            {/* Menu Bar */}
            <div className="flex items-center space-x-4 px-2 py-1 bg-retro-gray border-b-2 border-retro-gray-dark shadow-sm text-sm">
                <button className="hover:bg-retro-blue hover:text-white px-2">File</button>
                <button className="hover:bg-retro-blue hover:text-white px-2">Edit</button>
                <button className="hover:bg-retro-blue hover:text-white px-2">View</button>
                <button className="hover:bg-retro-blue hover:text-white px-2">Help</button>
            </div>

            {/* Address Bar */}
            <div className="flex items-center space-x-2 px-2 py-2 bg-retro-gray border-b-2 border-white">
                <span className="text-gray-600 text-xs uppercase">Address</span>
                <div className="flex-1 bg-white border-2 border-retro-gray-dark inset-shadow p-1 flex items-center">
                    <span className="text-sm">{currentPath}</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white p-4 overflow-y-auto border-2 border-retro-gray-dark inset-shadow relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center animate-pulse">
                            <RefreshCw className="w-8 h-8 mb-2 animate-spin" />
                            <p>Connecting to GitHub...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-600">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {repos.map((repo) => (
                            <div
                                key={repo.id}
                                className="group flex flex-col items-center p-2 cursor-pointer hover:bg-blue-100 border border-transparent hover:border-blue-300 hover:border-dashed rounded-sm"
                                onDoubleClick={() => openRepo(repo.html_url)}
                            >
                                <Folder className="w-12 h-12 text-yellow-500 fill-yellow-500 mb-1" />
                                <span className="text-xs text-center truncate w-full font-bold group-hover:text-blue-700">
                                    {repo.name}
                                </span>
                                <div className="flex space-x-2 mt-1 opacity-60 text-[10px]">
                                    <span className="flex items-center"><Star className="w-3 h-3 mr-0.5" />{repo.stargazers_count}</span>
                                    <span className="flex items-center"><GitFork className="w-3 h-3 mr-0.5" />{repo.forks_count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="bg-retro-gray px-2 py-1 text-xs border-t-2 border-white flex justify-between">
                <span>{repos.length} object(s)</span>
                <span>Online</span>
            </div>
        </div>
    );
};
