import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/api';
import { BookOpen } from 'lucide-react';

export default function StorySelection() {
    const [stories, setStories] = useState([]);
    const navigate = useNavigate();
    const childName = localStorage.getItem('childName') || 'Friend';

    useEffect(() => {
        api.get('/stories')
            .then(res => setStories(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Dark premium background with dynamic colorful orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>

            <div className="w-full px-12 relative z-10 flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-12 rounded-[3rem] shadow-2xl mb-12 text-center w-full max-w-4xl">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-4 tracking-tight drop-shadow-sm">
                        Hi {childName}!
                    </h1>
                    <p className="text-2xl text-slate-300 font-bold">
                        Which amazing story do you want to tell today?
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-10">
                    {stories.map(story => (
                        <div
                            key={story._id}
                            onClick={() => navigate(`/narration/${story._id}`)}
                            className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[0_20px_50px_rgba(251,_146,_60,_0.3)] hover:-translate-y-4 transition-all duration-300 cursor-pointer border border-white/10 hover:border-orange-400/50 group w-80 flex flex-col items-center transform will-change-transform"
                        >
                            <div className="w-full h-56 relative overflow-hidden bg-slate-800 flex items-center justify-center">
                                {story.images && story.images.length > 0 ? (
                                    <img
                                        src={story.images[0]}
                                        alt={story.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out opacity-80 group-hover:opacity-100"
                                    />
                                ) : (
                                    <BookOpen className="w-24 h-24 text-slate-600 group-hover:scale-110 transition-transform" />
                                )}
                                {/* Play overlay */}
                                <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-500/20 transition-colors flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-orange-600 opacity-0 group-hover:opacity-100 transition-all shadow-2xl transform translate-y-8 group-hover:translate-y-0 duration-300 font-black text-2xl ring-8 ring-white/20">
                                        GO!
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 text-center w-full bg-slate-800/50 border-t border-white/5">
                                <h2 className="text-2xl font-black text-white tracking-tight group-hover:text-orange-400 transition-colors">{story.title}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
