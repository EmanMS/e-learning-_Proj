import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, FileText, Calendar } from 'lucide-react';

const Assignment = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [file, setFile] = useState(null);
    const [textAnswer, setTextAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        fetchAssignment();
        fetchSubmissions();
    }, [assignmentId]);

    const fetchAssignment = async () => {
        try {
            const response = await api.get(`/assignments/${assignmentId}/`);
            setAssignment(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch assignment', error);
            setLoading(false);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const response = await api.get('/submissions/', {
                params: { assignment: assignmentId }
            });
            setSubmissions(response.data.filter(s => s.assignment === parseInt(assignmentId)));
        } catch (error) {
            console.error('Failed to fetch submissions', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file && !textAnswer.trim()) {
            alert('Please provide either a file or text answer');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('assignment', assignmentId);
            if (file) formData.append('file', file);
            if (textAnswer.trim()) formData.append('text_answer', textAnswer);

            await api.post('/submissions/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Assignment submitted successfully!');
            setFile(null);
            setTextAnswer('');
            fetchSubmissions();
        } catch (error) {
            console.error('Failed to submit assignment', error);
            alert('Failed to submit assignment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading assignment...</div>;
    if (!assignment) return <div className="p-8">Assignment not found</div>;

    const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
    const isOverdue = dueDate && dueDate < new Date();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
                            {dueDate && (
                                <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                                    <Calendar size={16} />
                                    <span className="text-sm">
                                        Due: {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString()}
                                        {isOverdue && ' (Overdue)'}
                                    </span>
                                </div>
                            )}
                        </div>
                        {submissions.length > 0 && (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                Submitted
                            </span>
                        )}
                    </div>

                    <div className="prose max-w-none mb-8">
                        <h2 className="text-xl font-semibold mb-3">Description</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{assignment.description}</p>
                    </div>

                    {submissions.length > 0 && (
                        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold mb-2">Your Submissions</h3>
                            <div className="space-y-2">
                                {submissions.map((submission) => (
                                    <div key={submission.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} />
                                            <span>Submitted on {new Date(submission.submitted_at).toLocaleString()}</span>
                                        </div>
                                        {submission.score !== null && (
                                            <span className="font-semibold text-blue-600">Score: {submission.score}%</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4">Submit Your Work</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload File (Optional)
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                                    <Upload size={20} />
                                    <span className="text-sm">{file ? file.name : 'Choose file'}</span>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt,.zip"
                                    />
                                </label>
                                {file && (
                                    <button
                                        type="button"
                                        onClick={() => setFile(null)}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Text Answer (Optional)
                            </label>
                            <textarea
                                value={textAnswer}
                                onChange={(e) => setTextAnswer(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Type your answer here..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={submitting || (!file && !textAnswer.trim())}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit Assignment'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Back to Course
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Assignment;
