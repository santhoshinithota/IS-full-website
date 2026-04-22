import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, ShieldCheck } from 'lucide-react';

export default function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleStart = (e) => {
        e.preventDefault();
        if (name.trim()) {
            localStorage.setItem('childName', name.trim());
            navigate('/stories');
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 overflow-hidden font-sans">
            {/* Dark premium background with dynamic colorful orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-pink-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-cyan-600 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob animation-delay-4000"></div>

            {/* Admin Button */}
            <button
                onClick={() => navigate('/admin')}
                className="absolute top-8 right-8 flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 px-5 py-3 rounded-full text-white shadow-lg transition-all text-sm font-bold"
            >
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>Admin Login</span>
            </button>

            {/* Main Premium Card */}
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-16 rounded-[4rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] max-w-2xl w-full text-center z-10 box-border">
                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 mb-6 tracking-tighter drop-shadow-lg">
                    Story Time
                </h1>
                <p className="text-xl text-slate-300 mb-10 font-medium">
                    What is your child's name?
                </p>

                <form onSubmit={handleStart} className="space-y-6">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Type your name here..."
                        className="w-full text-center text-2xl p-5 rounded-2xl bg-black/40 border border-white/10 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition-all shadow-inner placeholder-slate-500 font-bold text-white tracking-wide"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-2xl font-black py-5 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transform hover:-translate-y-1 transition-all"
                    >
                        <PlayCircle className="w-8 h-8 mr-3" />
                        Let's Go!
                    </button>
                </form>
            </div>
        </div>
    );
}
