import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { PlayCircle, FileText, CheckCircle, HelpCircle, ClipboardList } from 'lucide-react';
import QuizViewer from '../components/QuizViewer';
import AssignmentViewer from '../components/AssignmentViewer';
import DiscussionViewer from '../components/DiscussionViewer';
import PaymentModal from '../components/PaymentModal';

const CoursePlayer = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeModule, setActiveModule] = useState(null);
    const [activeContent, setActiveContent] = useState(null);
    const [activeTab, setActiveTab] = useState('content'); // 'content' or 'discussions'
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [completedContent, setCompletedContent] = useState(new Set());

    useEffect(() => {
        fetchCourse();
        fetchProgress();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await api.get(`courses/${id}/`);
            setCourse(response.data);
            if (response.data.modules.length > 0) {
                setActiveModule(response.data.modules[0]);
                if (response.data.modules[0].contents.length > 0) {
                    setActiveContent(response.data.modules[0].contents[0]);
                } else if (response.data.modules[0].quiz) {
                    setActiveContent({ type: 'QUIZ', data: response.data.modules[0].quiz });
                } else if (response.data.modules[0].assignment) {
                    setActiveContent({ type: 'ASSIGNMENT', data: response.data.modules[0].assignment });
                }
            }
        } catch (error) {
            console.error("Failed to fetch course", error);
        }
    };

    const fetchProgress = async () => {
        try {
            const response = await api.get('/progress/');
            const completed = new Set(response.data.map(p => p.content_id));
            setCompletedContent(completed);
        } catch (error) {
            console.error("Failed to fetch progress", error);
        }
    };

    const handleMarkComplete = async () => {
        if (!activeContent || !activeContent.id) return;

        try {
            await api.post('/progress/mark_complete/', {
                content_id: activeContent.id
            });
            setCompletedContent(prev => new Set([...prev, activeContent.id]));
            // Refresh course to update progress percentage
            fetchCourse();
        } catch (error) {
            console.error("Failed to mark as complete", error);
        }
    };

    const handleEnroll = async () => {
        try {
            await api.post(`courses/${id}/enroll/`);
            fetchCourse(); // Refresh to update enrollment status
        } catch (error) {
            console.error("Failed to enroll", error);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        fetchCourse(); // Refresh to update enrollment status
    };

    const handleContentSelect = (content) => {
        setActiveContent(content);
        setActiveTab('content');
    };

    const handleQuizSelect = (quiz) => {
        setActiveContent({ type: 'QUIZ', data: quiz });
        setActiveTab('content');
    };

    const handleAssignmentSelect = (assignment) => {
        setActiveContent({ type: 'ASSIGNMENT', data: assignment });
        setActiveTab('content');
    };

    if (!course) return <div>Loading...</div>;

    if (!course.is_enrolled) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md mt-10 text-center">
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.description}</p>

                {course.price > 0 ? (
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg text-xl hover:bg-green-700"
                    >
                        Buy Now for ${course.price}
                    </button>
                ) : (
                    <button
                        onClick={handleEnroll}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-xl hover:bg-blue-700"
                    >
                        Enroll for Free
                    </button>
                )}

                {showPaymentModal && (
                    <PaymentModal
                        course={course}
                        onClose={() => setShowPaymentModal(false)}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
            </div>
        );
    }

    const isContentCompleted = activeContent && activeContent.id && completedContent.has(activeContent.id);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-80 bg-white shadow-md overflow-y-auto flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{ width: `${course.progress || 0}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{Math.round(course.progress || 0)}% Complete</p>
                </div>

                <div className="flex border-b">
                    <button
                        className={`flex-1 p-3 font-semibold ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('content')}
                    >
                        Course Content
                    </button>
                    <button
                        className={`flex-1 p-3 font-semibold ${activeTab === 'discussions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('discussions')}
                    >
                        Discussions
                    </button>
                </div>

                {activeTab === 'content' && (
                    <div className="flex-1 overflow-y-auto">
                        {course.modules.map(module => (
                            <div key={module.id}>
                                <div className="p-3 bg-gray-50 font-semibold border-b">{module.title}</div>
                                <ul>
                                    {module.contents.map(content => (
                                        <li
                                            key={content.id}
                                            className={`p-3 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${activeContent?.id === content.id ? 'bg-blue-100 text-blue-700' : ''}`}
                                            onClick={() => handleContentSelect(content)}
                                        >
                                            {completedContent.has(content.id) ? (
                                                <CheckCircle size={16} className="text-green-600" />
                                            ) : content.content_type === 'VIDEO' ? (
                                                <PlayCircle size={16} />
                                            ) : (
                                                <FileText size={16} />
                                            )}
                                            <span className="text-sm">{content.title}</span>
                                        </li>
                                    ))}
                                    {module.quiz && (
                                        <li
                                            className={`p-3 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${activeContent?.data?.id === module.quiz.id ? 'bg-blue-100 text-blue-700' : ''}`}
                                            onClick={() => handleQuizSelect(module.quiz)}
                                        >
                                            <HelpCircle size={16} />
                                            <span className="text-sm">Quiz: {module.quiz.title}</span>
                                        </li>
                                    )}
                                    {module.assignment && (
                                        <li
                                            className={`p-3 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${activeContent?.data?.id === module.assignment.id ? 'bg-blue-100 text-blue-700' : ''}`}
                                            onClick={() => handleAssignmentSelect(module.assignment)}
                                        >
                                            <ClipboardList size={16} />
                                            <span className="text-sm">Assignment: {module.assignment.title}</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'discussions' ? (
                    <DiscussionViewer courseId={course.id} />
                ) : activeContent ? (
                    <div>
                        {activeContent.type === 'QUIZ' ? (
                            <QuizViewer quiz={activeContent.data} />
                        ) : activeContent.type === 'ASSIGNMENT' ? (
                            <AssignmentViewer assignment={activeContent.data} />
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold mb-4">{activeContent.title}</h2>
                                {activeContent.content_type === 'VIDEO' && activeContent.url && (
                                    <div className="aspect-video bg-black mb-4">
                                        <iframe
                                            src={activeContent.url.replace('watch?v=', 'embed/')}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title={activeContent.title}
                                        />
                                    </div>
                                )}
                                {activeContent.content_type === 'TEXT' && (
                                    <div className="prose max-w-none bg-white p-6 rounded shadow-sm">
                                        {activeContent.text_content}
                                    </div>
                                )}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={handleMarkComplete}
                                        disabled={isContentCompleted}
                                        className={`flex items-center gap-2 px-4 py-2 rounded ${isContentCompleted
                                                ? 'bg-green-100 text-green-700 border border-green-300 cursor-not-allowed'
                                                : 'text-green-600 border border-green-600 hover:bg-green-50'
                                            }`}
                                    >
                                        <CheckCircle size={20} />
                                        {isContentCompleted ? 'Completed' : 'Mark as Complete'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-20">Select a lesson to start learning</div>
                )}
            </div>
        </div>
    );
};

export default CoursePlayer;
