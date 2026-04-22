import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api, { API_URL } from '../utils/api';
import { LogOut, Trash2, Play, Download, Search, Mic, BookOpen, Plus, X, Image as ImageIcon, Edit2 } from 'lucide-react';

export default function AdminDashboard() {
    const [recordings, setRecordings] = useState([]);
    const [stories, setStories] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('recordings'); // 'recordings' or 'stories'
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStoryId, setEditingStoryId] = useState(null);

    // New/Edit Story State
    const [newStory, setNewStory] = useState({ title: '', summary: '', images: [''] });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }
        fetchData();
    }, [navigate, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'recordings') {
                const res = await api.get('/recordings');
                setRecordings(res.data);
            } else {
                const res = await api.get('/stories');
                setStories(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    const filteredRecordings = recordings.filter(r =>
        r.childName.toLowerCase().includes(search.toLowerCase()) ||
        r.storyName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 p-8 pb-20 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-4xl font-black text-blue-600 drop-shadow-sm">
                            Dashboard
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Manage platform content and recordings</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-2xl">
                            <button
                                onClick={() => setActiveTab('recordings')}
                                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'recordings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Recordings
                            </button>
                            <button
                                onClick={() => setActiveTab('stories')}
                                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'stories' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Stories
                            </button>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold transition-colors shadow-sm"
                        >
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                    </div>
                </div>

                {activeTab === 'recordings' ? (
                    <>
                        {/* Stats & Search for Recordings */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                                <Mic className="absolute right-[-20%] bottom-[-20%] w-64 h-64 text-white/10" />
                                <span className="text-xl font-bold opacity-90 relative z-10 mb-2">Total Recordings</span>
                                <span className="text-6xl font-black relative z-10 drop-shadow-md">{recordings.length}</span>
                            </div>

                            <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center gap-4">
                                <h2 className="text-xl font-bold text-slate-700 mb-2">Search Library</h2>
                                <div className="relative w-full">
                                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
                                    <input
                                        type="text"
                                        placeholder="Search by child's name or story title..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-lg shadow-inner font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recordings List */}
                        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-2xl font-bold text-slate-800">Recent Recordings</h2>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 text-sm uppercase font-black tracking-wider border-b border-slate-200">
                                        <tr>
                                            <th className="p-6">Author</th>
                                            <th className="p-6">Story</th>
                                            <th className="p-6">Recorded On</th>
                                            <th className="p-6">Playback</th>
                                            <th className="p-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="p-10 text-center text-slate-500 font-bold text-xl animate-pulse">Loading amazing stories...</td>
                                            </tr>
                                        ) : filteredRecordings.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-10 text-center text-slate-500 font-bold text-xl">No recordings found.</td>
                                            </tr>
                                        ) : (
                                            filteredRecordings.map(recording => (
                                                <tr key={recording._id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="p-6 font-black text-slate-800 text-lg">{recording.childName}</td>
                                                    <td className="p-6 text-slate-600 font-bold">{recording.storyName}</td>
                                                    <td className="p-6 text-slate-500 font-medium">
                                                        {new Date(recording.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        <span className="text-slate-400 ml-2">{new Date(recording.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </td>
                                                    <td className="p-6">
                                                        <audio
                                                            controls
                                                            src={`${API_URL}/recordings/audio/${recording.fileId}`}
                                                            className="h-10 w-64 outline-none filter drop-shadow hover:drop-shadow-md transition-all rounded-full"
                                                        />
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex justify-end gap-3">
                                                            <a
                                                                href={`${API_URL}/recordings/audio/${recording.fileId}`}
                                                                download={`${recording.childName}_${recording.storyName}.webm`}
                                                                className="bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white p-3 rounded-xl transition-colors shadow-sm"
                                                                title="Download Audio"
                                                            >
                                                                <Download className="w-5 h-5" />
                                                            </a>
                                                            <button
                                                                onClick={() => handleDeleteRecording(recording._id)}
                                                                className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-colors shadow-sm"
                                                                title="Delete Recording"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
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
                        {/* Stories Management Header */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black text-slate-800">Library</h2>
                            <button
                                onClick={() => {
                                    if (showAddForm) handleCancelEdit();
                                    else setShowAddForm(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95"
                            >
                                {showAddForm ? <><X className="w-6 h-6" /> Cancel</> : <><Plus className="w-6 h-6" /> Add New Story</>}
                            </button>
                        </div>

                        {showAddForm && (
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-4 border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
                                <h3 className="text-2xl font-black text-blue-600 mb-6 flex items-center gap-2">
                                    {editingStoryId ? <><Edit2 className="w-6 h-6" /> Editing Story</> : <><Plus className="w-6 h-6" /> Create New Story</>}
                                </h3>
                                <form onSubmit={handleSubmitStory} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="block text-xl font-black text-slate-700 ml-2">Story Title</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g., The Brave Little Goat"
                                                value={newStory.title}
                                                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-lg font-bold"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-xl font-black text-slate-700 ml-2">Short Summary</label>
                                            <input
                                                type="text"
                                                placeholder="What's this story about?"
                                                value={newStory.summary}
                                                onChange={(e) => setNewStory({ ...newStory, summary: e.target.value })}
                                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-lg font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center ml-2">
                                            <label className="block text-xl font-black text-slate-700">Image URLs</label>
                                            <button
                                                type="button"
                                                onClick={handleAddImageField}
                                                className="text-blue-600 hover:text-blue-700 font-black flex items-center gap-2 text-lg"
                                            >
                                                <Plus className="w-5 h-5" /> Add Scene
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {newStory.images.map((img, idx) => (
                                                <div key={idx} className="flex gap-4 animate-in slide-in-from-right-4">
                                                    <div className="flex-1 relative">
                                                        <ImageIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
                                                        <input
                                                            type="url"
                                                            required
                                                            placeholder={`Image URL for Scene ${idx + 1}`}
                                                            value={img}
                                                            onChange={(e) => handleImageChange(idx, e.target.value)}
                                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-lg font-medium"
                                                        />
                                                    </div>
                                                    {newStory.images.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImageField(idx)}
                                                            className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                                                        >
                                                            <X className="w-6 h-6" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-black py-6 rounded-3xl shadow-2xl transition-all text-2xl hover:scale-[1.01] active:scale-[0.99] mt-4"
                                    >
                                        {editingStoryId ? 'Update Story' : 'Save New Story'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stories.map(story => (
                                <div key={story._id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                    <div className="h-48 bg-slate-200 relative overflow-hidden">
                                        {story.images?.[0] ? (
                                            <img src={story.images[0]} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <BookOpen className="w-16 h-16" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-lg px-4 py-2 rounded-full font-black text-blue-600">
                                            {story.images?.length || 0} Scenes
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{story.title}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditStory(story)}
                                                    className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit Story"
                                                >
                                                    <Edit2 className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteStory(story._id)}
                                                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Story"
                                                >
                                                    <Trash2 className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 font-medium line-clamp-2">{story.summary || "No summary provided."}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
