import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStoriesList } from '../utils/storyLoader';
import { BookOpen, ChevronLeft, Loader2, RefreshCw, Sparkles } from 'lucide-react';

export default function StorySelection() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataSource, setDataSource] = useState(null);
    const navigate = useNavigate();
    const childName = localStorage.getItem('childName') || 'Friend';

    const loadStories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { stories: list, source } = await fetchStoriesList();
            setStories(list);
            setDataSource(source);
            if (source === 'local' || source === 'mixed') {
                setError(null);
            }
        } catch (err) {
            console.error(err);
            setError('We could not load stories. No API and no local fallback matched.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStories();
    }, [loadStories]);

    return (
        <div className="safe-pb relative flex min-h-[100dvh] flex-col overflow-hidden bg-slate-950 p-4 sm:p-8">
            <div className="pointer-events-none absolute top-[-10%] right-[-10%] h-[min(500px,90vw)] w-[min(500px,90vw)] rounded-full bg-orange-600/25 blur-[120px] mix-blend-screen animate-blob" />
            <div className="animation-delay-2000 pointer-events-none absolute bottom-[-10%] left-[-10%] h-[min(400px,85vw)] w-[min(400px,85vw)] rounded-full bg-purple-600/25 blur-[100px] mix-blend-screen animate-blob" />

            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="mb-6 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 backdrop-blur-md transition hover:bg-white/10"
                >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                    Home
                </button>

                <div className="mb-6 w-full rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-center shadow-2xl backdrop-blur-2xl sm:mb-10 sm:rounded-[2rem] sm:p-10">
                    {dataSource === 'mixed' && (
                        <p className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm font-bold leading-snug text-amber-100">
                            Cloud stories plus the built-in BB folder story are merged below (A–Z). Offline stories save in the browser only until the API is running.
                        </p>
                    )}
                    <p className="mb-2 inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-200/90">
                        <Sparkles className="h-4 w-4" aria-hidden />
                        Story library
                    </p>
                    <h1 className="mb-3 text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-400 sm:text-5xl">
                        Hi {childName}!
                    </h1>
                    <p className="text-lg font-semibold text-slate-300 sm:text-xl">
                        Pick a story—tap a card to open the picture adventure.
                    </p>
                </div>

                {loading && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-slate-300">
                        <Loader2 className="h-14 w-14 animate-spin text-orange-400" aria-hidden />
                        <p className="text-lg font-bold">Loading stories…</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="mx-auto max-w-lg rounded-3xl border border-red-500/30 bg-red-950/40 p-8 text-center text-red-100">
                        <p className="mb-6 text-lg font-bold">{error}</p>
                        <button
                            type="button"
                            onClick={loadStories}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-slate-900 transition hover:bg-orange-100"
                        >
                            <RefreshCw className="h-5 w-5" aria-hidden />
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && stories.length === 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-300">
                        <BookOpen className="mx-auto mb-4 h-16 w-16 text-slate-500" aria-hidden />
                        <p className="text-xl font-bold">No stories yet.</p>
                        <p className="mt-2 text-slate-400">Ask an admin to add stories from the dashboard.</p>
                    </div>
                )}

                {!loading && !error && stories.length > 0 && (
                    <div className="flex flex-wrap items-stretch justify-center gap-8 pb-12">
                        {stories.map((story) => (
                            <button
                                key={story._id}
                                type="button"
                                onClick={() => navigate(`/narration/${story._id}`)}
                                className="group flex w-full max-w-sm flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] text-left shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-orange-400/40 hover:shadow-[0_24px_60px_rgba(251,146,60,0.2)] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/50"
                            >
                                <div className="relative flex h-56 w-full items-center justify-center overflow-hidden bg-slate-900">
                                    {story.images && story.images.length > 0 ? (
                                        <img
                                            src={story.images[0]}
                                            alt=""
                                            className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <BookOpen className="h-24 w-24 text-slate-600 transition group-hover:scale-105" aria-hidden />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-orange-600/0 transition group-hover:bg-orange-500/15">
                                        <span className="flex h-16 w-16 translate-y-4 items-center justify-center rounded-full bg-white text-lg font-black text-orange-600 opacity-0 shadow-2xl ring-8 ring-white/20 transition group-hover:translate-y-0 group-hover:opacity-100">
                                            Go
                                        </span>
                                    </div>
                                </div>
                                <div className="border-t border-white/5 bg-slate-900/60 p-6">
                                    <h2 className="text-2xl font-black tracking-tight text-white transition group-hover:text-orange-300">
                                        {story.title}
                                    </h2>
                                    {story.summary ? (
                                        <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-400">{story.summary}</p>
                                    ) : null}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
