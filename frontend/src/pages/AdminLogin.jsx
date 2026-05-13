import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Shield, Lock, User } from 'lucide-react';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/login', { username, password });
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin/dashboard');
        } catch {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative gradient orb */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-600 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

            <div className="bg-slate-800/80 backdrop-blur-xl p-12 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-700 z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-sky-500/10 p-5 rounded-full mb-6 ring-1 ring-sky-500/30">
                        <Shield className="w-14 h-14 text-sky-400" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Login</h1>
                    <p className="text-sky-300/80 mt-3 text-lg">Platform Dashboard</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 font-bold p-4 rounded-xl mb-6 text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-sky-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900/50 text-white border-2 border-slate-700/50 rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:border-sky-500 focus:bg-slate-900 transition-all text-lg placeholder-slate-500"
                            required
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-sky-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 text-white border-2 border-slate-700/50 rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:border-sky-500 focus:bg-slate-900 transition-all text-lg placeholder-slate-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-sky-500/30 text-xl tracking-wide mt-4"
                    >
                        SIGN IN
                    </button>
                </form>
            </div>
        </div>
    );
}
