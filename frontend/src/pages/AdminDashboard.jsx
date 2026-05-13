import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { API_URL } from '../utils/api';
import {
    LogOut,
    Trash2,
    Download,
    Search,
    Mic,
    BookOpen,
    Plus,
    X,
    Image as ImageIcon,
    Edit2,
    ArrowDownWideNarrow,
    Home,
    LayoutDashboard,
} from 'lucide-react';

export default function AdminDashboard() {
    const [recordings, setRecordings] = useState([]);
    const [stories, setStories] = useState([]);
    const [search, setSearch] = useState('');
    const [recordingSort, setRecordingSort] = useState('date_desc');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('recordings'); // 'recordings' or 'stories'
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStoryId, setEditingStoryId] = useState(null);

    // New/Edit Story State
    const [newStory, setNewStory] = useState({ title: '', summary: '', images: [''] });

    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === 'recordings') {
                const res = await api.get('/recordings');
                const sortedRec = [...(res.data || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
                setRecordings(sortedRec);
            } else {
                const res = await api.get('/stories');
                const sorted = [...(res.data || [])].sort((a, b) =>
                    (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' }),
                );
                setStories(sorted);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin');
            } else {
                alert('Could not load data. Check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [activeTab, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        fetchData();
    }, [navigate, fetchData]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const handleDeleteRecording = async (id) => {
        if (window.confirm('Delete this recording permanently?')) {
            try {
                await api.delete(`/recordings/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
                alert('Failed to delete recording.');
            }
        }
    };

    const handleDeleteStory = async (id) => {
        if (window.confirm('Delete this story? It will no longer be available for children.')) {
            try {
                await api.delete(`/stories/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
                alert('Failed to delete story.');
            }
        }
    };

    const handleAddImageField = () => {
        setNewStory(prev => ({ ...prev, images: [...prev.images, ''] }));
    };

    const handleImageChange = (index, value) => {
        const updatedImages = [...newStory.images];
        updatedImages[index] = value;
        setNewStory(prev => ({ ...prev, images: updatedImages }));
    };

    const handleRemoveImageField = (index) => {
        if (newStory.images.length > 1) {
            const updatedImages = newStory.images.filter((_, i) => i !== index);
            setNewStory(prev => ({ ...prev, images: updatedImages }));
        }
    };

    const handleEditStory = (story) => {
        setEditingStoryId(story._id);
        setNewStory({
            title: story.title,
            summary: story.summary || '',
            images: story.images && story.images.length > 0 ? story.images : ['']
        });
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingStoryId(null);
        setNewStory({ title: '', summary: '', images: [''] });
        setShowAddForm(false);
    };

    const handleSubmitStory = async (e) => {
        e.preventDefault();
        const filteredImages = newStory.images.filter(img => img && typeof img === 'string' && img.trim() !== '');

        if (!newStory.title || filteredImages.length === 0) {
            alert('Please provide a title and at least one image URL.');
            return;
        }

        try {
            if (editingStoryId) {
                await api.put(`/stories/${editingStoryId}`, {
                    ...newStory,
                    images: filteredImages
                });
                alert('Story updated successfully!');
            } else {
                await api.post('/stories', {
                    ...newStory,
                    images: filteredImages
                });
                alert('Story added successfully!');
            }
            setNewStory({ title: '', summary: '', images: [''] });
            setEditingStoryId(null);
            setShowAddForm(false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert(editingStoryId ? 'Failed to update story.' : 'Failed to add story.');
        }
    };

    const filteredRecordings = recordings.filter((r) => {
        const child = (r.childName || '').toLowerCase();
        const story = (r.storyName || '').toLowerCase();
        const q = search.toLowerCase();
        return child.includes(q) || story.includes(q);
    });

    const sortedRecordings = useMemo(() => {
        const arr = [...filteredRecordings];
        const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);
        const byDateAsc = (a, b) => new Date(a.date) - new Date(b.date);
        const byChild = (a, b) => (a.childName || '').localeCompare(b.childName || '', undefined, { sensitivity: 'base' });
        const byStory = (a, b) => (a.storyName || '').localeCompare(b.storyName || '', undefined, { sensitivity: 'base' });
        switch (recordingSort) {
            case 'date_asc':
                arr.sort(byDateAsc);
                break;
            case 'child':
                arr.sort(byChild);
                break;
            case 'story':
                arr.sort(byStory);
                break;
            default:
                arr.sort(byDateDesc);
        }
        return arr;
    }, [filteredRecordings, recordingSort]);

    return (
        <div className="min-h-screen bg-slate-950 pb-16 font-sans text-slate-100">
            <div className="mx-auto max-w-7xl space-y-8 px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-400/30">
                            <LayoutDashboard className="h-7 w-7 text-cyan-300" aria-hidden />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Admin dashboard</h1>
                            <p className="mt-1 text-sm text-slate-400 sm:text-base">Recordings, story library, and uploads</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
                        >
                            <Home className="h-4 w-4" aria-hidden />
                            Site home
                        </button>
                        <div className="flex rounded-xl border border-white/10 bg-slate-950/80 p-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('recordings')}
                                className={`rounded-lg px-4 py-2 text-sm font-bold transition sm:px-5 ${activeTab === 'recordings' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Recordings
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('stories')}
                                className={`rounded-lg px-4 py-2 text-sm font-bold transition sm:px-5 ${activeTab === 'stories' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Stories
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
                        >
                            <LogOut className="h-4 w-4" aria-hidden />
                            Sign out
                        </button>
                    </div>
                </div>

                {activeTab === 'recordings' ? (
                    <>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-600/30 to-indigo-900/60 p-6 shadow-lg md:col-span-1">
                                <Mic className="absolute -bottom-6 -right-2 h-32 w-32 text-white/10" aria-hidden />
                                <p className="text-sm font-bold uppercase tracking-wider text-cyan-100/90">Total</p>
                                <p className="mt-1 text-5xl font-black tabular-nums text-white">{recordings.length}</p>
                                <p className="mt-2 text-sm text-cyan-100/80">Saved narrations</p>
                            </div>

                            <div className="flex flex-col justify-center gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur md:col-span-2 md:flex-row md:items-end md:p-6">
                                <div className="relative min-w-0 flex-1">
                                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden />
                                    <input
                                        type="search"
                                        placeholder="Search by child or story…"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 sm:text-base"
                                    />
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <ArrowDownWideNarrow className="h-5 w-5 text-slate-500" aria-hidden />
                                    <label htmlFor="rec-sort" className="sr-only">
                                        Sort recordings
                                    </label>
                                    <select
                                        id="rec-sort"
                                        value={recordingSort}
                                        onChange={(e) => setRecordingSort(e.target.value)}
                                        className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-3 text-sm font-bold text-white focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    >
                                        <option value="date_desc">Newest first</option>
                                        <option value="date_asc">Oldest first</option>
                                        <option value="child">By child name</option>
                                        <option value="story">By story title</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 shadow-xl">
                            <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                                <h2 className="text-lg font-black text-white sm:text-xl">Recordings</h2>
                                <p className="text-sm text-slate-400">Table on large screens; cards on small screens.</p>
                            </div>

                            <div className="lg:hidden">
                                {loading ? (
                                    <p className="p-8 text-center font-bold text-slate-500 animate-pulse">Loading…</p>
                                ) : sortedRecordings.length === 0 ? (
                                    <p className="p-8 text-center font-bold text-slate-500">No recordings match.</p>
                                ) : (
                                    <ul className="divide-y divide-white/10 p-3">
                                        {sortedRecordings.map((recording) => (
                                            <li
                                                key={recording._id}
                                                className="flex flex-col gap-3 rounded-xl p-4 hover:bg-white/5"
                                            >
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wide text-cyan-300/90">
                                                        Child
                                                    </p>
                                                    <p className="text-lg font-black text-white">{recording.childName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                        Story
                                                    </p>
                                                    <p className="font-bold text-slate-200">{recording.storyName}</p>
                                                </div>
                                                <p className="text-sm text-slate-400">
                                                    {new Date(recording.date).toLocaleString()}
                                                </p>
                                                <audio
                                                    controls
                                                    src={`${API_URL}/recordings/audio/${recording.fileId}`}
                                                    className="h-10 w-full max-w-full rounded-lg"
                                                />
                                                <div className="flex gap-2">
                                                    <a
                                                        href={`${API_URL}/recordings/audio/${recording.fileId}`}
                                                        download={`${recording.childName}_${recording.storyName}.webm`}
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500/15 py-2.5 text-sm font-bold text-cyan-200 ring-1 ring-cyan-500/30"
                                                    >
                                                        <Download className="h-4 w-4" aria-hidden />
                                                        Download
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteRecording(recording._id)}
                                                        className="rounded-xl bg-red-500/15 px-4 py-2.5 text-sm font-bold text-red-300 ring-1 ring-red-500/30"
                                                    >
                                                        <Trash2 className="mx-auto h-4 w-4" aria-hidden />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-[720px] text-left text-sm">
                                    <thead className="border-b border-white/10 bg-slate-950/50 text-xs font-black uppercase tracking-wider text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4">Child</th>
                                            <th className="px-6 py-4">Story</th>
                                            <th className="px-6 py-4">Recorded</th>
                                            <th className="px-6 py-4">Audio</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center font-bold text-slate-500 animate-pulse">
                                                    Loading…
                                                </td>
                                            </tr>
                                        ) : sortedRecordings.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center font-bold text-slate-500">
                                                    No recordings found.
                                                </td>
                                            </tr>
                                        ) : (
                                            sortedRecordings.map((recording) => (
                                                <tr key={recording._id} className="hover:bg-white/[0.04]">
                                                    <td className="px-6 py-4 text-base font-black text-white">
                                                        {recording.childName}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-300">{recording.storyName}</td>
                                                    <td className="px-6 py-4 text-slate-400">
                                                        {new Date(recording.date).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                        <span className="ml-2 text-slate-500">
                                                            {new Date(recording.date).toLocaleTimeString(undefined, {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <audio
                                                            controls
                                                            src={`${API_URL}/recordings/audio/${recording.fileId}`}
                                                            className="h-9 w-56 max-w-[14rem] rounded-full"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <a
                                                                href={`${API_URL}/recordings/audio/${recording.fileId}`}
                                                                download={`${recording.childName}_${recording.storyName}.webm`}
                                                                className="inline-flex rounded-xl bg-cyan-500/15 p-2.5 text-cyan-200 ring-1 ring-cyan-500/30 hover:bg-cyan-500/25"
                                                                title="Download"
                                                            >
                                                                <Download className="h-5 w-5" />
                                                            </a>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteRecording(recording._id)}
                                                                className="inline-flex rounded-xl bg-red-500/15 p-2.5 text-red-300 ring-1 ring-red-500/30 hover:bg-red-500/25"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-white sm:text-3xl">Story library</h2>
                                <p className="mt-1 text-sm text-slate-400">Titles are sorted A–Z. Edit or add scenes as image URLs.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (showAddForm) handleCancelEdit();
                                    else setShowAddForm(true);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg transition hover:bg-cyan-400 sm:text-base"
                            >
                                {showAddForm ? (
                                    <>
                                        <X className="h-5 w-5" aria-hidden />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-5 w-5" aria-hidden />
                                        New story
                                    </>
                                )}
                            </button>
                        </div>

                        {showAddForm && (
                            <div className="rounded-2xl border border-cyan-500/25 bg-slate-900/70 p-6 shadow-xl backdrop-blur sm:p-8">
                                <h3 className="mb-6 flex items-center gap-2 text-xl font-black text-cyan-200 sm:text-2xl">
                                    {editingStoryId ? (
                                        <>
                                            <Edit2 className="h-6 w-6" aria-hidden />
                                            Edit story
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-6 w-6" aria-hidden />
                                            Create story
                                        </>
                                    )}
                                </h3>
                                <form onSubmit={handleSubmitStory} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="ml-1 text-sm font-bold text-slate-300">Title</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. The Brave Little Goat"
                                                value={newStory.title}
                                                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                                                className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-4 text-base font-bold text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/25"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="ml-1 text-sm font-bold text-slate-300">Summary</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Short description for the wrap-up screen"
                                                value={newStory.summary}
                                                onChange={(e) => setNewStory({ ...newStory, summary: e.target.value })}
                                                className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/80 p-4 text-base font-semibold text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/25"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <label className="text-sm font-bold text-slate-300">Image URLs (one per scene)</label>
                                            <button
                                                type="button"
                                                onClick={handleAddImageField}
                                                className="inline-flex items-center gap-2 text-sm font-black text-cyan-300 hover:text-cyan-200"
                                            >
                                                <Plus className="h-4 w-4" aria-hidden />
                                                Add scene
                                            </button>
                                        </div>
                                        <div className="grid gap-3">
                                            {newStory.images.map((img, idx) => (
                                                <div key={idx} className="flex gap-3">
                                                    <div className="relative min-w-0 flex-1">
                                                        <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                                                        <input
                                                            type="url"
                                                            required
                                                            placeholder={`Scene ${idx + 1} image URL`}
                                                            value={img}
                                                            onChange={(e) => handleImageChange(idx, e.target.value)}
                                                            className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/25"
                                                        />
                                                    </div>
                                                    {newStory.images.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImageField(idx)}
                                                            className="shrink-0 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300 hover:bg-red-500/20"
                                                            aria-label="Remove scene"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 py-4 text-lg font-black text-slate-950 shadow-lg transition hover:from-cyan-400 hover:to-teal-500"
                                    >
                                        {editingStoryId ? 'Save changes' : 'Publish story'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {stories.map((story) => (
                                <article
                                    key={story._id}
                                    className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg transition hover:border-cyan-500/30 hover:shadow-cyan-500/10"
                                >
                                    <div className="relative h-44 overflow-hidden bg-slate-800 sm:h-48">
                                        {story.images?.[0] ? (
                                            <img
                                                src={story.images[0]}
                                                alt=""
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-slate-600">
                                                <BookOpen className="h-14 w-14" aria-hidden />
                                            </div>
                                        )}
                                        <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-black text-white ring-1 ring-white/20 backdrop-blur">
                                            {story.images?.length || 0} scenes
                                        </div>
                                    </div>
                                    <div className="space-y-3 p-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-lg font-black leading-snug text-white sm:text-xl">{story.title}</h3>
                                            <div className="flex shrink-0 gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditStory(story)}
                                                    className="rounded-lg p-2 text-cyan-300 transition hover:bg-white/10"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteStory(story._id)}
                                                    className="rounded-lg p-2 text-red-300 transition hover:bg-red-500/15"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="line-clamp-2 text-sm text-slate-400">
                                            {story.summary || 'No summary yet.'}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
