import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, User } from 'lucide-react';

const DiscussionViewer = ({ courseId }) => {
    const [discussions, setDiscussions] = useState([]);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadContent, setNewThreadContent] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchDiscussions();
    }, [courseId]);

    const fetchDiscussions = async () => {
        try {
            const response = await api.get('/communication/discussions/');
            const courseDiscussions = response.data.filter(d => d.course === parseInt(courseId));
            setDiscussions(courseDiscussions);
        } catch (error) {
            console.error("Failed to fetch discussions", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/communication/discussions/', {
                course: courseId,
                title: newThreadTitle,
                content: newThreadContent
            });
            setNewThreadTitle('');
            setNewThreadContent('');
            setShowForm(false);
            fetchDiscussions();
        } catch (error) {
            console.error("Failed to post discussion", error);
        }
    };

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare /> Course Discussions
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : 'New Discussion'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm mb-6">
                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Title</label>
                        <input
                            type="text"
                            value={newThreadTitle}
                            onChange={(e) => setNewThreadTitle(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Content</label>
                        <textarea
                            value={newThreadContent}
                            onChange={(e) => setNewThreadContent(e.target.value)}
                            className="w-full p-2 border rounded h-24"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                        Post
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {discussions.map(discussion => (
                    <div key={discussion.id} className="bg-white p-6 rounded shadow-sm">
                        <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <User size={16} /> <span>{discussion.user.username}</span>
                            <span>•</span>
                            <span>{new Date(discussion.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700 mb-4">{discussion.content}</p>
                        {/* Replies would go here - simplified for now */}
                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-sm text-gray-600 mb-2">Replies ({discussion.replies.length})</h4>
                            {discussion.replies.map(reply => (
                                <div key={reply.id} className="bg-gray-50 p-3 rounded mb-2">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span className="font-bold">{reply.user.username}</span>
                                        <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm">{reply.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {discussions.length === 0 && (
                    <p className="text-center text-gray-500">No discussions yet. Be the first to start one!</p>
                )}
            </div>
        </div>
    );
};

export default DiscussionViewer;
