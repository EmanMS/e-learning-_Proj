import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { MessageCircle, Send, User } from 'lucide-react';

const Discussion = () => {
    const { courseId } = useParams();
    const [discussions, setDiscussions] = useState([]);
    const [newThread, setNewThread] = useState({ title: '', content: '' });
    const [replyContent, setReplyContent] = useState({});
    const [showNewThread, setShowNewThread] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDiscussions();
    }, [courseId]);

    const fetchDiscussions = async () => {
        try {
            const response = await api.get('/communication/discussions/', {
                params: { course: courseId }
            });
            setDiscussions(response.data.filter(d => d.course === parseInt(courseId)));
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch discussions', error);
            setLoading(false);
        }
    };

    const handleCreateThread = async (e) => {
        e.preventDefault();
        if (!newThread.title.trim() || !newThread.content.trim()) return;

        try {
            await api.post('/communication/discussions/', {
                course: courseId,
                title: newThread.title,
                content: newThread.content,
                parent: null
            });
            setNewThread({ title: '', content: '' });
            setShowNewThread(false);
            fetchDiscussions();
        } catch (error) {
            console.error('Failed to create thread', error);
            alert('Failed to create thread. Please try again.');
        }
    };

    const handleReply = async (parentId) => {
        const content = replyContent[parentId];
        if (!content || !content.trim()) return;

        try {
            await api.post('/communication/discussions/', {
                course: courseId,
                title: '',
                content: content,
                parent: parentId
            });
            setReplyContent({ ...replyContent, [parentId]: '' });
            fetchDiscussions();
        } catch (error) {
            console.error('Failed to post reply', error);
            alert('Failed to post reply. Please try again.');
        }
    };

    if (loading) return <div className="p-8">Loading discussions...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Course Discussions</h1>
                    <button
                        onClick={() => setShowNewThread(!showNewThread)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {showNewThread ? 'Cancel' : 'New Thread'}
                    </button>
                </div>

                {showNewThread && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Create New Thread</h2>
                        <form onSubmit={handleCreateThread}>
                            <input
                                type="text"
                                value={newThread.title}
                                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                                placeholder="Thread title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <textarea
                                value={newThread.content}
                                onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                                placeholder="What would you like to discuss?"
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Post Thread
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {discussions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                            <MessageCircle size={48} className="mx-auto mb-4 text-gray-400" />
                            <p>No discussions yet. Start the conversation!</p>
                        </div>
                    ) : (
                        discussions.map((thread) => (
                            <div key={thread.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-1">{thread.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3">
                                            Posted by {thread.user?.username || 'Unknown'} on{' '}
                                            {new Date(thread.created_at).toLocaleString()}
                                        </p>
                                        <p className="text-gray-700 whitespace-pre-wrap">{thread.content}</p>
                                    </div>
                                </div>

                                {thread.replies && thread.replies.length > 0 && (
                                    <div className="ml-14 space-y-4 mb-4 border-l-2 border-gray-200 pl-6">
                                        {thread.replies.map((reply) => (
                                            <div key={reply.id} className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <User size={16} className="text-gray-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-500 mb-1">
                                                        {reply.user?.username || 'Unknown'} •{' '}
                                                        {new Date(reply.created_at).toLocaleString()}
                                                    </p>
                                                    <p className="text-gray-700">{reply.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="ml-14 flex gap-3">
                                    <input
                                        type="text"
                                        value={replyContent[thread.id] || ''}
                                        onChange={(e) =>
                                            setReplyContent({ ...replyContent, [thread.id]: e.target.value })
                                        }
                                        placeholder="Write a reply..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleReply(thread.id);
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => handleReply(thread.id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Send size={16} />
                                        Reply
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discussion;
