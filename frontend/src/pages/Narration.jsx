import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/api';
import { ChevronLeft, ChevronRight, Home, Star, BookOpen, ZoomIn, ZoomOut, X as CloseIcon } from 'lucide-react';
import AudioRecorder from '../components/AudioRecorder';

export default function Narration() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [childName, setChildName] = useState('Friend');
    const [isSuccess, setIsSuccess] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        setChildName(localStorage.getItem('childName') || 'Friend');
        api.get(`/stories/${id}`)
            .then(res => setStory(res.data))
            .catch(err => console.error(err));

        // Disable body scroll when narration is active
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [id]);

    if (!story) return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
                Loading your story...
            </div>
        </div>
    );

    const nextSlide = () => {
        if (currentIndex < story.images.length - 1) setCurrentIndex(p => p + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex(p => p - 1);
    };

    const setFixedImageIndex = (idx) => {
        setCurrentIndex(idx);
    };

    const handleUploadSuccess = () => {
        setShowSummaryModal(true);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-center text-white relative overflow-hidden">
                <Star className="absolute top-10 left-10 w-20 h-20 text-yellow-300 animate-spin-slow opacity-20" />
                <Star className="absolute bottom-20 right-10 w-32 h-32 text-yellow-300 animate-pulse opacity-20" />

                <div className="bg-white/10 backdrop-blur-3xl p-16 rounded-[4rem] shadow-[0_0_100px_rgba(34,211,238,0.2)] z-10 border border-white/20 max-w-2xl w-full">
                    <h1 className="text-7xl font-black mb-6 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                        YAY! 🎉
                    </h1>
                    <p className="text-3xl font-bold mb-10 text-slate-200">
                        Great job, {childName}!<br />Your story has been saved safely.
                    </p>
                    <button
                        onClick={() => navigate('/stories')}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 font-black py-6 px-12 rounded-full shadow-2xl hover:scale-105 transition-all text-2xl flex items-center justify-center gap-3 mx-auto"
                    >
                        <Home className="w-8 h-8" />
                        Explore Other Stories
                    </button>
                </div>
            </div>
        );
    }

    if (showSummaryModal) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 bg-black/60 backdrop-blur-3xl animate-in zoom-in duration-500">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_0_100px_rgba(34,211,238,0.15)] max-w-4xl w-full text-white space-y-8 transform transition-all duration-500 hover:shadow-[0_0_120px_rgba(34,211,238,0.25)]">
                    <div className="text-center space-y-4">
                        <div className="inline-block p-4 bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 rounded-3xl border border-white/20 mb-2">
                            <BookOpen className="w-12 h-12 text-cyan-400 animate-pulse" />
                        </div>
                        <h2 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                            Adventure Summary
                        </h2>
                        <p className="text-slate-400 text-xl font-medium italic">"Every story has a heart..."</p>
                    </div>

                    <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                        <p className="text-3xl font-bold leading-relaxed text-slate-100 text-center">
                            {story.summary}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setShowSummaryModal(false);
                            setIsSuccess(true);
                        }}
                        className="group relative w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-black py-7 rounded-3xl shadow-2xl transition-all text-3xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 overflow-hidden"
                    >
                        <span className="relative z-10">Done! Explore more stories</span>
                        <ChevronRight className="w-10 h-10 relative z-10 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900/80 backdrop-blur-xl p-4 flex justify-between items-center text-white shadow-2xl z-20 border-b border-white/5">
                <button
                    onClick={() => navigate('/stories')}
                    className="flex items-center gap-2 hover:bg-white/10 px-5 py-3 rounded-2xl transition-all font-bold text-slate-300 hover:text-white border border-white/5"
                >
                    <ChevronLeft className="w-6 h-6" /> Back
                </button>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 tracking-tight">
                    {story.title}
                </h1>
                <div className="w-[120px]"></div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 min-h-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">

                {/* Left/Center: Image Viewer */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    <div className="flex-1 relative bg-black/40 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center backdrop-blur-sm overflow-hidden">
                        {story.images && story.images.length > 0 && (
                            <img
                                src={story.images[currentIndex]}
                                alt={`Scene ${currentIndex + 1}`}
                                onClick={() => setIsZoomed(true)}
                                className="max-h-[85%] max-w-[85%] object-contain p-4 drop-shadow-[0_0_60px_rgba(0,0,0,0.6)] rounded-[2rem] transform transition-transform duration-300 cursor-zoom-in hover:scale-[1.02]"
                            />
                        )}

                        {/* Zoom Button */}
                        <button
                            onClick={() => setIsZoomed(true)}
                            className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-xl text-white p-4 rounded-full shadow-2xl border border-white/10 hover:bg-slate-800 transition-all hover:scale-110 z-20 group/zoom flex items-center gap-2 pr-6"
                        >
                            <ZoomIn className="w-8 h-8 group-hover/zoom:scale-110 transition-transform" />
                            <span className="font-black text-lg tracking-tight">See Closer</span>
                        </button>

                        {/* Navigation Controls over image */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-6">
                            <button
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                className={`p-5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white backdrop-blur-xl transition-all shadow-2xl hover:scale-110 border border-white/10 ${currentIndex === 0 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}
                            >
                                <ChevronLeft className="w-10 h-10" />
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                            <button
                                onClick={nextSlide}
                                disabled={currentIndex === (story.images?.length || 1) - 1}
                                className={`p-5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-white backdrop-blur-xl transition-all shadow-2xl hover:scale-110 border border-white/10 ${currentIndex === (story.images?.length || 1) - 1 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}
                            >
                                <ChevronRight className="w-10 h-10" />
                            </button>
                        </div>

                        {/* Picture Counter */}
                        <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-xl text-white font-black px-6 py-2 rounded-full text-xl shadow-2xl border border-white/10">
                            {currentIndex + 1} <span className="text-slate-500 mx-1">/</span> {story.images?.length || 1}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Scene selection thumbnails */}
                <div className="w-full lg:w-48 xl:w-64 flex lg:flex-col gap-5 overflow-x-auto lg:overflow-y-auto bg-slate-900/50 p-5 rounded-[3rem] border border-white/5 shadow-2xl custom-scrollbar-slim items-center max-h-[20vh] lg:max-h-full">
                    {story.images?.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setFixedImageIndex(idx)}
                            className={`relative flex-shrink-0 w-24 h-24 lg:w-full lg:h-auto lg:aspect-video rounded-2xl overflow-hidden border-4 transition-all duration-300 transform ${currentIndex === idx
                                ? 'border-cyan-400 scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)] z-10'
                                : 'border-white/5 opacity-40 hover:opacity-80 hover:scale-[1.02]'
                                }`}
                        >
                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 h-full bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-2 right-3 text-white font-black text-xl drop-shadow-md">
                                {idx + 1}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer: Modern Recorder Sticky at bottom */}
            <div className="bg-slate-900/90 backdrop-blur-2xl p-4 border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.4)] z-30">
                <AudioRecorder
                    storyId={story._id}
                    storyName={story.title}
                    childName={childName}
                    onUploadSuccess={handleUploadSuccess}
                    summary={story.summary}
                />
            </div>

            {/* Overlays (Rendered last to be on top) */}
            {isZoomed && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col animate-in fade-in duration-500">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsZoomed(false)}
                        className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 text-white p-5 rounded-full transition-all hover:scale-110 border border-white/20 z-[210] shadow-2xl"
                    >
                        <CloseIcon className="w-10 h-10" />
                    </button>

                    {/* Big Image */}
                    <div className="flex-1 flex items-center justify-center p-6 sm:p-20 overflow-auto cursor-zoom-out" onClick={() => setIsZoomed(false)}>
                        <img
                            src={story.images[currentIndex]}
                            alt="Zoomed Scene"
                            className="max-h-full max-w-full object-contain rounded-[2.5rem] shadow-[0_0_120px_rgba(255,255,255,0.1)] animate-in zoom-in-95 duration-500"
                        />
                    </div>

                    {/* Counter & Instruction */}
                    <div className="p-8 text-center bg-gradient-to-t from-black/50 to-transparent">
                        <p className="text-white/80 text-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3">
                            <Star className="w-6 h-6 text-yellow-400" />
                            Page {currentIndex + 1} of {story.images.length}
                            <Star className="w-6 h-6 text-yellow-400" />
                        </p>
                        <p className="text-slate-400 font-bold mt-2">Click the X or the picture to go back</p>
                    </div>
                </div>
            )}

            {showInstructions && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 bg-black/60 backdrop-blur-3xl animate-in fade-in duration-700">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
                    </div>

                    <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_0_100px_rgba(34,211,238,0.15)] max-w-4xl w-full text-white space-y-8 transform transition-all duration-500 hover:shadow-[0_0_120px_rgba(34,211,238,0.25)]">
                        <div className="text-center space-y-4">
                            <div className="inline-block p-4 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl border border-white/20 mb-2">
                                <Star className="w-12 h-12 text-yellow-300 animate-spin-slow" />
                            </div>
                            <h2 className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                                Recording Instructions
                            </h2>
                            <p className="text-slate-400 text-xl font-medium">Please read these steps before you start the story adventure!</p>
                        </div>

                        <div className="space-y-4 bg-black/20 p-8 rounded-[2.5rem] border border-white/5 shadow-inner max-h-[50vh] overflow-y-auto custom-scrollbar-slim">
                            <ul className="space-y-6 text-xl text-left">
                                {[
                                    "Sit opposite the child. Start recording. Ask the child to tell the story by looking at the picture.",
                                    "If the child is finding it difficult to start the story, you can point to the picture and say: “Can you tell me the story in this picture?”",
                                    "If the child pauses in the middle of the story, you can say: “then?”, “tell me the rest”, “let’s see what happens next.”",
                                    "If the child stops talking without indicating that he/she has finished, you can say: “tell me when the story has finished.”",
                                    "When the child is finished, praise the child, then ask the comprehension questions. Stop recording after the child has answered all the questions."
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-5 group items-start">
                                        <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                                            {i + 1}
                                        </span>
                                        <p className="text-slate-200 leading-relaxed font-semibold">
                                            {step === "When the child is finished, praise the child, then ask the comprehension questions. Stop recording after the child has answered all the questions." ? (
                                                <>
                                                    When the child is finished, praise the child, then ask the <span className="text-cyan-400 font-black">comprehension questions</span>. Stop recording after the child has answered all the questions.
                                                </>
                                            ) : step}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={() => setShowInstructions(false)}
                            className="group relative w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-black py-7 rounded-3xl shadow-2xl transition-all text-3xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative z-10">Start Story Adventure!</span>
                            <ChevronRight className="w-10 h-10 relative z-10 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
