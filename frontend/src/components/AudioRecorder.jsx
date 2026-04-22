import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Mic, Square, Play, Pause, UploadCloud, RotateCcw, Info, BookOpen } from 'lucide-react';

export default function AudioRecorder({ storyId, storyName, childName, onUploadSuccess, summary }) {
    const [recordingState, setRecordingState] = useState('inactive'); // 'inactive', 'recording', 'paused'
    const [audioBlob, setAudioBlob] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [timer, setTimer] = useState(0);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        if (recordingState === 'recording') {
            timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [recordingState]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setRecordingState('recording');
            setAudioBlob(null);
            setTimer(0);
        } catch (err) {
            console.error("Error accessing mic:", err);
            alert("Microphone access is required to record stories.");
        }
    };

    const pauseRecording = () => {
        try {
            if (mediaRecorderRef.current && recordingState === 'recording' && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.pause();
                setRecordingState('paused');
            }
        } catch (err) {
            console.error("Failed to pause", err);
        }
    };

    const resumeRecording = () => {
        try {
            if (mediaRecorderRef.current && recordingState === 'paused' && mediaRecorderRef.current.state === 'paused') {
                mediaRecorderRef.current.resume();
                setRecordingState('recording');
            }
        } catch (err) {
            console.error("Failed to resume", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recordingState !== 'inactive') {
            try {
                if (mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                }
                const tracks = mediaRecorderRef.current.stream?.getTracks() || [];
                tracks.forEach(track => track.stop());
            } catch (err) {
                console.error("Error stopping recorder:", err);
            }
            setRecordingState('inactive');
        }
    };

    const submitRecording = async () => {
        if (!audioBlob) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('audio', audioBlob, `recording-${Date.now()}.webm`);
        formData.append('childName', childName);
        formData.append('storyId', storyId);
        formData.append('storyName', storyName);
        formData.append('duration', timer);

        try {
            await axios.post('http://localhost:5000/api/recordings/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsUploading(false);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            console.error("Upload error", err);
            alert("Failed to save recording.");
            setIsUploading(false);
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setTimer(0);
    };

    return (
        <div className="bg-white/10 backdrop-blur-3xl max-w-5xl mx-auto rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-4 flex flex-col items-center border border-white/10 ring-1 ring-white/5 relative group">
            {!audioBlob ? (
                <div className="flex flex-col items-center gap-6 w-full">
                    <p className="text-2xl font-black text-slate-300 mb-2 tracking-tight">Tell your story!</p>

                    {recordingState === 'inactive' && (
                        <button
                            onClick={startRecording}
                            type="button"
                            className="flex items-center gap-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-black py-4 px-10 rounded-full shadow-[0_0_50px_rgba(239,_68,_68,_0.4)] hover:shadow-[0_0_70px_rgba(239,_68,_68,_0.6)] hover:scale-105 transition-all text-2xl animate-pulse ring-8 ring-red-500/20"
                        >
                            <Mic className="w-10 h-10" />
                            START
                        </button>
                    )}

                    {recordingState !== 'inactive' && (
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center bg-black/40 p-4 rounded-[2rem] border border-white/5 shadow-inner">

                            {/* Recording Timer & Status Indicator */}
                            <div className="flex items-center gap-4 bg-slate-900 text-white font-black py-3 px-6 rounded-full shadow-2xl text-xl min-w-[180px] justify-center border border-white/5 ring-4 ring-slate-800">
                                {recordingState === 'recording' ? (
                                    <div className="w-4 h-4 rounded-full bg-red-500 animate-ping mr-2"></div>
                                ) : (
                                    <Pause className="w-5 h-5 text-yellow-400 mr-2" />
                                )}
                                <span className={recordingState === 'paused' ? 'text-slate-500' : 'text-white'}>
                                    {formatTime(timer)}
                                </span>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-4">
                                {recordingState === 'recording' ? (
                                    <button
                                        onClick={pauseRecording}
                                        type="button"
                                        className="flex items-center gap-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-black py-3 px-6 rounded-full transition-all text-lg shadow-xl border border-yellow-500/30"
                                    >
                                        <Pause className="w-6 h-6" /> <span className="hidden sm:inline">Pause</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={resumeRecording}
                                        type="button"
                                        className="flex items-center gap-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 font-black py-3 px-6 rounded-full transition-all text-lg shadow-xl border border-green-500/30"
                                    >
                                        <Play className="w-6 h-6" /> <span className="hidden sm:inline">Resume</span>
                                    </button>
                                )}

                                <button
                                    onClick={stopRecording}
                                    type="button"
                                    className="flex items-center gap-3 bg-slate-100 hover:bg-white text-slate-900 font-black py-3 px-8 rounded-full shadow-2xl transition-all text-lg hover:scale-105"
                                >
                                    <Square className="w-6 h-6 text-red-600" />
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full gap-6">
                    <p className="font-black text-2xl text-slate-100 tracking-tight">Great job! Listen to it! 🎨</p>
                    <audio src={URL.createObjectURL(audioBlob)} controls className="w-full max-w-lg h-12 outline-none rounded-full shadow-2xl border-4 border-white/5" />

                    <div className="flex items-center gap-5">
                        <button
                            onClick={resetRecording}
                            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-slate-300 font-black py-3 px-6 rounded-full transition-all border border-white/10 text-lg"
                        >
                            <RotateCcw className="w-6 h-6" />
                            Try Again
                        </button>
                        <button
                            onClick={submitRecording}
                            disabled={isUploading}
                            className={`flex items-center gap-3 font-black py-3 px-10 rounded-full transition-all text-white shadow-[0_0_50px_rgba(34,_197,_94,_0.3)] text-xl ${isUploading ? 'bg-green-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:scale-105 ring-8 ring-green-500/10'
                                }`}
                        >
                            <UploadCloud className="w-7 h-7" />
                            {isUploading ? 'Saving...' : 'Save Story'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
