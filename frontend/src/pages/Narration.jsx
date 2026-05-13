import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchStoryById } from '../utils/storyLoader';
import { ChevronLeft, ChevronRight, Home, Star, BookOpen, Maximize2, X as CloseIcon } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';

function NarrationView({ storyId }) {
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const childName = typeof window !== 'undefined' ? localStorage.getItem('childName') || 'Friend' : 'Friend';
    const [isSuccess, setIsSuccess] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const [recordingSavedToServer, setRecordingSavedToServer] = useState(false);

    useEffect(() => {
        fetchStoryById(storyId)
            .then(({ story: s }) => {
                setStory(s);
                setCurrentIndex(0);
                setRecordingSavedToServer(false);
            })
            .catch((err) => {
                console.error(err);
                setLoadError(
                    err.code === 'NOT_FOUND' ? 'This story was not found.' : 'Could not load this story.',
                );
                setStory(null);
            });

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [storyId]);

    useEffect(() => {
        if (!isZoomed) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setIsZoomed(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isZoomed]);

    if (loadError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 p-8 text-center text-white">
                <p className="max-w-md text-xl font-bold text-slate-200">{loadError}</p>
                <button
                    type="button"
                    onClick={() => navigate('/stories')}
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-black shadow-lg transition hover:from-cyan-400 hover:to-blue-500"
                >
                    Back to stories
                </button>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-8">
                <div className="animate-pulse bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                    Loading your story…
                </div>
            </div>
        );
    }

    const images = Array.isArray(story.images) ? story.images.filter(Boolean) : [];
    const hasImages = images.length > 0;
    const lastImageIndex = Math.max(0, images.length - 1);

    const nextSlide = () => {
        if (currentIndex < lastImageIndex) setCurrentIndex((p) => p + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex((p) => p - 1);
    };

    const setFixedImageIndex = (idx) => {
        setCurrentIndex(idx);
    };

    const handleUploadSuccess = (result) => {
        setRecordingSavedToServer(Boolean(result?.savedToServer));
        setShowSummaryModal(true);
    };

    if (isSuccess) {
        return (
            <div className="safe-pb safe-pt flex min-h-[100dvh] flex-col items-center justify-center overflow-y-auto bg-slate-900 p-4 text-center text-white sm:p-8">
                <Star className="pointer-events-none absolute left-4 top-16 h-12 w-12 text-yellow-300 opacity-20 animate-spin-slow sm:left-10 sm:top-10 sm:h-20 sm:w-20" aria-hidden />
                <Star className="pointer-events-none absolute bottom-16 right-4 h-20 w-20 text-yellow-300 opacity-20 animate-pulse sm:bottom-20 sm:right-10 sm:h-32 sm:w-32" aria-hidden />

                <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_0_80px_rgba(34,211,238,0.15)] backdrop-blur-3xl sm:rounded-[3rem] sm:p-10 md:p-14">
                    <h1 className="mb-3 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 sm:mb-4 sm:text-5xl md:text-6xl lg:text-7xl">
                        Nice work!
                    </h1>
                    <p className="mb-3 text-lg font-bold text-slate-200 sm:mb-4 sm:text-2xl md:text-3xl">
                        Great job, {childName}!
                    </p>
                    <p className="mb-8 text-sm leading-relaxed text-slate-400 sm:mb-10 sm:text-lg md:text-xl">
                        {recordingSavedToServer
                            ? 'Your recording is saved in the admin library for grown-ups to listen back anytime.'
                            : 'Wonderful telling! We could not add this clip to the shared library just yet—it is only on this device. Try Continue again after a moment, or record another take.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/stories')}
                        className="mx-auto flex min-h-[48px] w-full max-w-md items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-base font-black text-white shadow-2xl transition-all hover:from-green-400 hover:to-emerald-500 active:scale-[0.98] sm:gap-3 sm:py-5 sm:text-xl md:py-6 md:text-2xl"
                    >
                        <Home className="h-5 w-5 shrink-0 sm:h-8 sm:w-8" aria-hidden />
                        Explore other stories
                    </button>
                </div>
            </div>
        );
    }

    if (showSummaryModal) {
        return (
            <div className="safe-pb safe-pt fixed inset-0 z-[100] flex min-h-0 flex-col justify-end bg-black/60 p-2 backdrop-blur-3xl animate-in fade-in duration-300 sm:justify-center sm:p-4 md:p-8">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute right-[-10%] top-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-cyan-500/20 blur-[120px]" />
                    <div className="animation-delay-2000 absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-emerald-500/20 blur-[120px]" />
                </div>

                <div className="relative mx-auto flex max-h-[calc(100dvh-0.75rem)] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-white/20 bg-white/10 text-white shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-2xl sm:max-h-[92dvh] sm:rounded-[2.5rem]">
                    <div className="shrink-0 space-y-3 px-4 pb-3 pt-5 text-center sm:space-y-4 sm:px-8 sm:pb-4 sm:pt-8">
                        <div className="mx-auto inline-block rounded-2xl border border-white/20 bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 p-3 sm:rounded-3xl sm:p-4">
                            <BookOpen className="h-8 w-8 animate-pulse text-cyan-400 sm:h-12 sm:w-12" aria-hidden />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 sm:text-4xl md:text-5xl">
                            Adventure summary
                        </h2>
                        <p className="text-sm font-medium italic text-slate-400 sm:text-lg">&ldquo;Every story has a heart…&rdquo;</p>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-8">
                        <div className="rounded-2xl border border-white/5 bg-black/20 p-4 shadow-inner sm:rounded-[2rem] sm:p-6 md:p-8">
                            <p className="text-center text-base font-bold leading-relaxed text-slate-100 sm:text-2xl md:text-3xl">
                                {story.summary?.trim()
                                    ? story.summary
                                    : 'What a wonderful story adventure—thanks for sharing it together!'}
                            </p>
                        </div>
                    </div>

                    <div className="shrink-0 border-t border-white/10 p-3 sm:p-5">
                        <button
                            type="button"
                            onClick={() => {
                                setShowSummaryModal(false);
                                setIsSuccess(true);
                            }}
                            className="group relative flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3.5 text-base font-black text-white shadow-2xl transition-all hover:from-cyan-400 hover:to-emerald-400 active:scale-[0.99] sm:gap-3 sm:rounded-3xl sm:py-5 sm:text-xl md:py-6 md:text-2xl"
                        >
                            <span className="relative z-10 text-balance">Done — explore more stories</span>
                            <ChevronRight className="relative z-10 h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 sm:h-9 sm:w-9 sm:group-hover:translate-x-2" aria-hidden />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[100dvh] max-h-[100dvh] min-h-0 flex-col overflow-hidden bg-slate-950 font-sans">
            {/* Header */}
            <div className="safe-pt z-20 flex shrink-0 items-center justify-between gap-2 border-b border-white/5 bg-slate-900/90 px-2 py-2 text-white shadow-2xl backdrop-blur-xl sm:gap-3 sm:px-4 sm:py-3 md:px-5">
                <button
                    type="button"
                    onClick={() => navigate('/stories')}
                    className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 px-3 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10 sm:px-5 sm:py-3 sm:text-base"
                >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center text-center">
                    <h1 className="max-w-[min(100%,28rem)] truncate text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 sm:text-xl lg:text-2xl">
                        {story.title}
                    </h1>
                    {hasImages && (
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-cyan-200/80 sm:text-xs">
                            Page{' '}
                            <span className="tabular-nums text-white">{currentIndex + 1}</span>
                            <span className="text-slate-500"> / </span>
                            <span className="tabular-nums text-white">{images.length}</span>
                        </p>
                    )}
                </div>
                <div className="w-12 shrink-0 sm:w-[100px]" aria-hidden />
            </div>

            {/* Main Content Area */}
            <div className="flex min-h-0 flex-1 flex-col gap-2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 p-2 sm:gap-4 sm:p-4 lg:flex-row lg:gap-5 lg:p-5">

                {/* Left/Center: Image Viewer */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-sm sm:rounded-3xl lg:rounded-[2rem]">
                        {hasImages ? (
                            <img
                                src={images[currentIndex]}
                                alt=""
                                aria-hidden
                                onClick={() => hasImages && setIsZoomed(true)}
                                className="max-h-[min(72vh,520px)] max-w-[min(96%,520px)] cursor-zoom-in rounded-xl object-contain p-2 drop-shadow-[0_0_40px_rgba(0,0,0,0.55)] transition-transform duration-300 active:scale-[0.99] sm:max-h-[80%] sm:max-w-[90%] sm:rounded-2xl sm:p-4 sm:hover:scale-[1.02] lg:max-h-[85%] lg:max-w-[85%] lg:rounded-[2rem]"
                            />
                        ) : (
                            <div className="flex max-w-md flex-col items-center gap-4 p-8 text-center text-slate-400">
                                <BookOpen className="h-20 w-20 text-slate-600" aria-hidden />
                                <p className="text-xl font-bold text-slate-300">No pictures for this story yet.</p>
                                <p className="text-slate-500">You can still record narration—an admin can add image URLs later.</p>
                            </div>
                        )}

                        {/* Zoom Button */}
                        <button
                            type="button"
                            onClick={() => hasImages && setIsZoomed(true)}
                            disabled={!hasImages}
                            className="absolute left-2 top-2 z-20 flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/90 px-2.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-xl transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-40 sm:left-4 sm:top-4 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-sm md:left-6 md:top-6 lg:min-h-0"
                        >
                            <Maximize2 className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden />
                            <span className="hidden sm:inline">Full screen</span>
                        </button>

                        {/* Navigation Controls over image */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-1 sm:pl-4 lg:pl-6">
                            <button
                                type="button"
                                onClick={prevSlide}
                                disabled={!hasImages || currentIndex === 0}
                                className={`rounded-full border border-white/10 bg-slate-900/70 p-2.5 text-white shadow-lg backdrop-blur-md transition-all sm:p-4 sm:shadow-2xl lg:hover:scale-110 lg:hover:bg-slate-800 ${!hasImages || currentIndex === 0 ? 'pointer-events-none scale-90 opacity-0' : 'opacity-100'}`}
                            >
                                <ChevronLeft className="h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10" aria-hidden />
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-4 lg:pr-6">
                            <button
                                type="button"
                                onClick={nextSlide}
                                disabled={!hasImages || currentIndex >= lastImageIndex}
                                className={`rounded-full border border-white/10 bg-slate-900/70 p-2.5 text-white shadow-lg backdrop-blur-md transition-all sm:p-4 sm:shadow-2xl lg:hover:scale-110 lg:hover:bg-slate-800 ${!hasImages || currentIndex >= lastImageIndex ? 'pointer-events-none scale-90 opacity-0' : 'opacity-100'}`}
                            >
                                <ChevronRight className="h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10" aria-hidden />
                            </button>
                        </div>

                        {/* Picture Counter */}
                        <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-slate-900/90 px-3 py-1 text-xs font-black text-white shadow-xl backdrop-blur-xl tabular-nums sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:translate-x-0 sm:px-4 sm:py-1.5 sm:text-sm md:right-6 md:top-6 md:px-5 md:py-2 md:text-base">
                            {hasImages ? (
                                <>
                                    <span className="text-white">{currentIndex + 1}</span>
                                    <span className="mx-1.5 text-slate-500">/</span>
                                    <span className="text-slate-300">{images.length}</span>
                                </>
                            ) : (
                                <span className="text-slate-400">—</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Scene selection thumbnails */}
                <div className="custom-scrollbar-slim flex max-h-[22vh] w-full shrink-0 items-center gap-3 overflow-x-auto overflow-y-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-2 shadow-xl sm:max-h-[24vh] sm:gap-4 sm:rounded-3xl sm:p-4 lg:max-h-none lg:w-44 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden xl:w-56">
                    {hasImages ? (
                        images.map((img, idx) => (
                            <button
                                key={`thumb-${idx}-${typeof img === 'string' ? img.slice(-24) : idx}`}
                                type="button"
                                onClick={() => setFixedImageIndex(idx)}
                                aria-label={`Go to page ${idx + 1} of ${images.length}`}
                                aria-current={currentIndex === idx ? 'true' : undefined}
                                className={`relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border-[3px] transition-all duration-200 sm:h-24 sm:w-24 sm:rounded-2xl sm:border-4 sm:duration-300 lg:aspect-video lg:h-auto lg:w-full ${currentIndex === idx
                                    ? 'z-10 scale-105 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                    : 'border-white/5 opacity-40 hover:scale-[1.02] hover:opacity-80'
                                    }`}
                            >
                                <img src={img} alt="" className="h-full w-full object-cover" />
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
                                <div
                                    className="pointer-events-none absolute bottom-2 right-2 flex h-8 min-w-8 items-center justify-center rounded-full bg-black/70 px-2 text-sm font-black text-white tabular-nums ring-2 ring-white/20"
                                    aria-hidden
                                >
                                    {idx + 1}
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="px-4 py-8 text-center text-sm font-bold text-slate-500">Scenes will appear here when images are added.</p>
                    )}
                </div>
            </div>

            {/* Footer: Modern Recorder Sticky at bottom */}
            <div className="safe-pb z-30 shrink-0 border-t border-white/5 bg-slate-900/95 p-2 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-3 md:p-4">
                <AudioRecorder
                    storyId={story._id}
                    storyName={story.title}
                    childName={childName}
                    onUploadSuccess={handleUploadSuccess}
                />
            </div>

            {/* Overlays (Rendered last to be on top) */}
            {isZoomed && hasImages && (
                <div className="fixed inset-0 z-[200] flex min-h-0 flex-col bg-black/95 backdrop-blur-3xl duration-500 animate-in fade-in">
                    <button
                        type="button"
                        onClick={() => setIsZoomed(false)}
                        className="safe-pt absolute right-3 top-3 z-[210] flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-2xl transition-all hover:bg-white/20 active:scale-95 sm:right-6 sm:top-6 sm:p-4 md:right-8 md:top-8 md:p-5"
                        aria-label="Close full screen picture"
                    >
                        <CloseIcon className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10" aria-hidden />
                    </button>

                    <div
                        className="flex min-h-0 flex-1 cursor-zoom-out items-center justify-center overflow-auto p-3 pt-14 sm:p-10 md:p-20"
                        onClick={() => setIsZoomed(false)}
                        role="presentation"
                    >
                        <img
                            src={images[currentIndex]}
                            alt=""
                            className="max-h-full max-w-full animate-in rounded-2xl object-contain shadow-[0_0_80px_rgba(255,255,255,0.08)] duration-500 zoom-in-95 sm:rounded-[2.5rem]"
                        />
                    </div>

                    <div className="safe-pb shrink-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-4 text-center sm:p-6 md:p-8">
                        <p className="flex flex-wrap items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-white/85 sm:gap-3 sm:text-xl md:text-2xl">
                            <Star className="h-4 w-4 text-yellow-400 sm:h-6 sm:w-6" aria-hidden />
                            Page {currentIndex + 1} of {images.length}
                            <Star className="h-4 w-4 text-yellow-400 sm:h-6 sm:w-6" aria-hidden />
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-400 sm:mt-2 sm:text-base">Tap the picture or close to go back</p>
                    </div>
                </div>
            )}

            {showInstructions && (
                <div className="safe-pb safe-pt fixed inset-0 z-[100] flex min-h-0 flex-col justify-end bg-black/60 p-2 backdrop-blur-3xl animate-in fade-in duration-300 sm:justify-center sm:p-4 md:p-8">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-blue-500/20 blur-[120px]" />
                        <div className="animation-delay-2000 absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-purple-500/20 blur-[120px]" />
                    </div>

                    <div className="relative mx-auto flex max-h-[calc(100dvh-0.75rem)] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-white/20 bg-white/10 text-white shadow-[0_0_80px_rgba(34,211,238,0.12)] backdrop-blur-2xl sm:max-h-[92dvh] sm:rounded-[2.5rem]">
                        <div className="shrink-0 space-y-2 px-4 pb-3 pt-5 text-center sm:space-y-3 sm:px-8 sm:pb-4 sm:pt-8">
                            <div className="mx-auto inline-block rounded-2xl border border-white/20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 p-3 sm:rounded-3xl sm:p-4">
                                <Star className="h-8 w-8 text-yellow-300 animate-spin-slow sm:h-12 sm:w-12" aria-hidden />
                            </div>
                            <h2 className="text-balance text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 sm:text-4xl md:text-5xl">
                                Recording instructions
                            </h2>
                            <p className="text-pretty text-sm font-medium text-slate-300 sm:text-lg md:text-xl">
                                Please read these steps before you start the story adventure.
                            </p>
                        </div>

                        <div className="custom-scrollbar-slim min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-8">
                            <ul className="space-y-4 pb-2 text-left sm:space-y-5 sm:pb-4">
                                {[
                                    "Sit opposite the child. Start recording. Ask the child to tell the story by looking at the picture.",
                                    "If the child is finding it difficult to start the story, you can point to the picture and say: “Can you tell me the story in this picture?”",
                                    "If the child pauses in the middle of the story, you can say: “then?”, “tell me the rest”, “let’s see what happens next.”",
                                    "If the child stops talking without indicating that he/she has finished, you can say: “tell me when the story has finished.”",
                                    "When the child is finished, praise the child, then ask the comprehension questions. Stop recording after the child has answered all the questions.",
                                ].map((step, i) => (
                                    <li key={i} className="group flex items-start gap-3 sm:gap-5">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-black shadow-lg transition-transform group-hover:scale-105 sm:h-10 sm:w-10 sm:text-lg">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm font-semibold leading-relaxed text-slate-100 sm:text-lg md:text-xl">
                                            {step ===
                                            'When the child is finished, praise the child, then ask the comprehension questions. Stop recording after the child has answered all the questions.' ? (
                                                <>
                                                    When the child is finished, praise the child, then ask the{' '}
                                                    <span className="font-black text-cyan-400">comprehension questions</span>. Stop recording after the child has answered all the questions.
                                                </>
                                            ) : (
                                                step
                                            )}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="shrink-0 border-t border-white/10 p-3 sm:p-5">
                            <button
                                type="button"
                                onClick={() => setShowInstructions(false)}
                                className="group relative flex min-h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 py-3.5 text-base font-black text-white shadow-2xl transition-all hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 active:scale-[0.99] sm:gap-3 sm:rounded-3xl sm:py-4 sm:text-xl md:py-5 md:text-2xl"
                            >
                                <div className="pointer-events-none absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
                                <span className="relative z-10">Start story adventure</span>
                                <ChevronRight className="relative z-10 h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 sm:h-9 sm:w-9 sm:group-hover:translate-x-2" aria-hidden />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Narration() {
    const { id } = useParams();
    if (!id) return null;
    return <NarrationView key={id} storyId={id} />;
}
