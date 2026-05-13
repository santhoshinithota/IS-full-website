import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PlayCircle,
    ShieldCheck,
    Sparkles,
    Mic,
    BookOpen,
    Heart,
    ChevronRight,
} from 'lucide-react';

export default function Home() {
    const [name, setName] = useState(() =>
        typeof window !== 'undefined' ? localStorage.getItem('childName') || '' : '',
    );
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const t = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(t);
    }, []);

    const handleStart = (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed) {
            localStorage.setItem('childName', trimmed);
        } else {
            localStorage.removeItem('childName');
        }
        navigate('/stories');
    };

    const handleGuest = () => {
        localStorage.removeItem('childName');
        navigate('/stories');
    };

    return (
        <div className="safe-pb relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#050816] font-sans text-white">
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.25), transparent 45%),
            radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.2), transparent 40%),
            radial-gradient(circle at 50% 90%, rgba(34, 211, 238, 0.12), transparent 50%)`,
                }}
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.2]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                    backgroundSize: '64px 64px',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 70%)',
                    maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 70%)',
                }}
            />

            <div className="absolute top-[-10%] left-[-10%] h-[min(500px,90vw)] w-[min(500px,90vw)] rounded-full bg-indigo-600/50 blur-[100px] mix-blend-screen animate-blob" />
            <div className="animation-delay-2000 absolute top-[15%] right-[-8%] h-[min(420px,80vw)] w-[min(420px,80vw)] rounded-full bg-fuchsia-600/40 blur-[100px] mix-blend-screen animate-blob" />
            <div className="animation-delay-4000 absolute bottom-[-15%] left-[15%] h-[min(560px,95vw)] w-[min(560px,95vw)] rounded-full bg-cyan-600/35 blur-[110px] mix-blend-screen animate-blob" />

            <header className="relative z-20 flex items-center justify-between gap-4 px-5 py-5 sm:px-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                        <Sparkles className="h-6 w-6 text-cyan-300" aria-hidden />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">Story time</p>
                        <p className="text-lg font-black tracking-tight">Interactive stories</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition hover:bg-white/12 sm:px-5 sm:py-3"
                >
                    <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-300" aria-hidden />
                    <span className="hidden sm:inline">Admin</span>
                </button>
            </header>

            <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-5 pb-16 pt-4 sm:px-10 lg:flex-row lg:items-center lg:gap-16 lg:pt-0">
                <section
                    className={`flex-1 space-y-6 text-left transition-all duration-700 lg:max-w-xl ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                    <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-100">
                        <Heart className="h-3.5 w-3.5 text-pink-300" aria-hidden />
                        Made for curious kids
                    </p>
                    <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                        Picture stories kids{' '}
                        <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                            tell out loud
                        </span>
                    </h1>
                    <p className="max-w-lg text-lg leading-relaxed text-slate-300 sm:text-xl">
                        Flip through illustrated scenes, record narration together, and keep every adventure in one
                        place—so grown-ups can listen back anytime.
                    </p>

                    <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
                        {[
                            { icon: BookOpen, label: 'Choose a story', sub: 'Curated picture books' },
                            { icon: Mic, label: 'Record together', sub: 'Pause, resume, save' },
                            { icon: Sparkles, label: 'Celebrate', sub: 'Summary & high-five screen' },
                        ].map((item) => (
                            <li
                                key={item.label}
                                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-600/30 ring-1 ring-white/10">
                                    {React.createElement(item.icon, {
                                        className: 'h-5 w-5 text-cyan-200',
                                        'aria-hidden': true,
                                    })}
                                </span>
                                <span className="text-left">
                                    <span className="block font-bold text-white">{item.label}</span>
                                    <span className="text-sm text-slate-400">{item.sub}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section
                    className={`flex w-full flex-1 justify-center transition-all delay-150 duration-700 lg:justify-end ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                >
                    <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/[0.07] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:rounded-[2.5rem] sm:p-10">
                        <h2 className="text-center text-2xl font-black text-white sm:text-3xl">Who is storytelling today?</h2>
                        <p className="mt-2 text-center text-slate-400">
                            Add a first name so we can cheer them on—or skip and go as a guest.
                        </p>

                        <form onSubmit={handleStart} className="mt-8 space-y-5">
                            <div className="text-left">
                                <label htmlFor="child-name" className="mb-2 block text-sm font-bold text-slate-300">
                                    Child&apos;s name <span className="font-medium text-slate-500">(optional)</span>
                                </label>
                                <input
                                    id="child-name"
                                    type="text"
                                    autoComplete="given-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Sam"
                                    maxLength={48}
                                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-5 py-4 text-center text-xl font-bold tracking-wide text-white shadow-inner outline-none ring-cyan-400/0 transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/20"
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-xl font-black text-white shadow-[0_0_40px_rgba(6,182,212,0.35)] transition hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_56px_rgba(6,182,212,0.45)] active:scale-[0.99] sm:py-5 sm:text-2xl"
                            >
                                <PlayCircle className="h-8 w-8 shrink-0" aria-hidden />
                                Start stories
                                <ChevronRight className="h-6 w-6 shrink-0 opacity-80" aria-hidden />
                            </button>
                            <button
                                type="button"
                                onClick={handleGuest}
                                className="w-full rounded-2xl border border-white/15 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
                            >
                                Continue as guest
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 border-t border-white/5 px-5 py-6 text-center text-xs text-slate-500 sm:px-10">
                Tip: use a quiet room and allow the microphone when you record—your clips save to the admin library.
            </footer>
        </div>
    );
}
