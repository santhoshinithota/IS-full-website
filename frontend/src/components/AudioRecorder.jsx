import React, { useState, useRef, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { Mic, Square, Play, Pause, RotateCcw, CheckCircle2, Headphones } from 'lucide-react';

function pickRecorderMimeType() {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/mp4;codecs=mp4a.40.2',
        'audio/ogg;codecs=opus',
    ];
    for (const t of candidates) {
        if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return '';
}

export default function AudioRecorder({ storyId, storyName, childName, onUploadSuccess }) {
    const [recordingState, setRecordingState] = useState('inactive');
    const [audioBlob, setAudioBlob] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [timer, setTimer] = useState(0);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioRef = useRef(null);

    const previewUrl = useMemo(() => {
        if (!audioBlob) return null;
        return URL.createObjectURL(audioBlob);
    }, [audioBlob]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        if (recordingState === 'recording') {
            timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [recordingState]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60)
            .toString()
            .padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = pickRecorderMimeType();
            const options = mimeType ? { mimeType } : undefined;
            mediaRecorderRef.current = new MediaRecorder(stream, options);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const type = mediaRecorderRef.current?.mimeType || 'audio/webm';
                const blob = new Blob(chunksRef.current, { type });
                chunksRef.current = [];
                setAudioBlob(blob);
            };

            mediaRecorderRef.current.start(250);
            setRecordingState('recording');
            setAudioBlob(null);
            setTimer(0);
        } catch (err) {
            console.error('Error accessing mic:', err);
            alert('Microphone access is required to record stories.');
        }
    };

    const pauseRecording = () => {
        try {
            if (
                mediaRecorderRef.current &&
                recordingState === 'recording' &&
                mediaRecorderRef.current.state === 'recording'
            ) {
                mediaRecorderRef.current.pause();
                setRecordingState('paused');
            }
        } catch (err) {
            console.error('Failed to pause', err);
        }
    };

    const resumeRecording = () => {
        try {
            if (
                mediaRecorderRef.current &&
                recordingState === 'paused' &&
                mediaRecorderRef.current.state === 'paused'
            ) {
                mediaRecorderRef.current.resume();
                setRecordingState('recording');
            }
        } catch (err) {
            console.error('Failed to resume', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recordingState !== 'inactive') {
            try {
                if (mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                }
                const tracks = mediaRecorderRef.current.stream?.getTracks() || [];
                tracks.forEach((track) => track.stop());
            } catch (err) {
                console.error('Error stopping recorder:', err);
            }
            setRecordingState('inactive');
        }
    };

    const submitRecording = async () => {
        if (!audioBlob) return;

        setIsUploading(true);
        const ext = audioBlob.type.includes('mp4') ? 'm4a' : 'webm';
        const formData = new FormData();
        formData.append('audio', audioBlob, `recording-${Date.now()}.${ext}`);
        formData.append('childName', childName);
        formData.append('storyId', storyId);
        formData.append('storyName', storyName);
        formData.append('duration', String(timer));

        try {
            await api.post('/recordings/upload', formData);
            setIsUploading(false);
            onUploadSuccess?.({ savedToServer: true });
        } catch (err) {
            console.error('Upload error', err);
            setIsUploading(false);
            onUploadSuccess?.({ savedToServer: false });
        }
    };

    const resetRecording = () => {
        if (audioRef.current) {
            try {
                audioRef.current.pause();
                audioRef.current.removeAttribute('src');
                audioRef.current.load();
            } catch {
                /* ignore */
            }
        }
        chunksRef.current = [];
        setAudioBlob(null);
        setTimer(0);
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/5 backdrop-blur-3xl sm:rounded-[2.5rem] sm:p-5">
            {!audioBlob ? (
                <div className="flex w-full flex-col items-center gap-5">
                    <p className="text-center text-lg font-black tracking-tight text-slate-200 sm:text-2xl">
                        Tell your story!
                    </p>

                    {recordingState === 'inactive' && (
                        <button
                            type="button"
                            onClick={startRecording}
                            className="flex items-center gap-3 rounded-full bg-gradient-to-r from-red-500 to-pink-600 px-8 py-3.5 text-lg font-black text-white shadow-[0_0_40px_rgba(239,68,68,0.35)] ring-8 ring-red-500/15 transition-all hover:scale-[1.02] hover:from-red-400 hover:to-pink-500 hover:shadow-[0_0_56px_rgba(239,68,68,0.45)] sm:gap-4 sm:px-10 sm:py-4 sm:text-2xl"
                        >
                            <Mic className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" aria-hidden />
                            Start recording
                        </button>
                    )}

                    {recordingState !== 'inactive' && (
                        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-white/10 bg-black/35 p-4 shadow-inner sm:flex-row sm:gap-6 sm:rounded-[2rem] sm:p-5">
                            <div className="flex min-w-[10rem] items-center justify-center gap-3 rounded-full border border-white/10 bg-slate-900 px-5 py-2.5 text-lg font-black text-white shadow-xl ring-4 ring-slate-800/80 sm:text-xl">
                                {recordingState === 'recording' ? (
                                    <span className="h-3 w-3 shrink-0 animate-ping rounded-full bg-red-500" aria-hidden />
                                ) : (
                                    <Pause className="h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                                )}
                                <span className={recordingState === 'paused' ? 'text-slate-400' : 'tabular-nums text-white'}>
                                    {formatTime(timer)}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {recordingState === 'recording' ? (
                                    <button
                                        type="button"
                                        onClick={pauseRecording}
                                        className="flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-500/10 px-5 py-2.5 text-sm font-black text-amber-200 transition hover:bg-amber-500/20 sm:text-base"
                                    >
                                        <Pause className="h-5 w-5" aria-hidden />
                                        Pause
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={resumeRecording}
                                        className="flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-5 py-2.5 text-sm font-black text-emerald-200 transition hover:bg-emerald-500/20 sm:text-base"
                                    >
                                        <Play className="h-5 w-5" aria-hidden />
                                        Resume
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={stopRecording}
                                    className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-black text-slate-900 shadow-xl transition hover:scale-[1.02] sm:text-base"
                                >
                                    <Square className="h-5 w-5 text-red-600" aria-hidden />
                                    Stop
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex w-full flex-col items-center gap-5">
                    <div className="flex items-center gap-2 text-center">
                        <Headphones className="h-6 w-6 shrink-0 text-cyan-300" aria-hidden />
                        <p className="text-lg font-black tracking-tight text-slate-100 sm:text-2xl">Listen back</p>
                    </div>
                    {previewUrl ? (
                        <audio
                            ref={audioRef}
                            key={previewUrl}
                            src={previewUrl}
                            controls
                            playsInline
                            preload="auto"
                            className="w-full max-w-lg rounded-2xl border-2 border-white/10 bg-black/30 py-1 shadow-xl outline-none [min-height:3.25rem]"
                        />
                    ) : null}

                    <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={resetRecording}
                            className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-black text-slate-200 transition hover:bg-white/10 sm:text-base"
                        >
                            <RotateCcw className="h-5 w-5" aria-hidden />
                            Re-record
                        </button>
                        <button
                            type="button"
                            onClick={submitRecording}
                            disabled={isUploading}
                            className={`flex min-h-[48px] items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-black text-white shadow-lg transition sm:text-base ${isUploading ? 'cursor-not-allowed bg-emerald-600/50' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-500/25'}`}
                        >
                            <CheckCircle2 className="h-6 w-6 shrink-0" aria-hidden />
                            {isUploading ? 'Working…' : 'Continue'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
