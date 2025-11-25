import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Quiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const response = await api.get(`/quizzes/${quizId}/`);
            setQuiz(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch quiz', error);
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, optionIndex) => {
        setAnswers({ ...answers, [questionId]: optionIndex });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const response = await api.post('/quiz-attempts/', {
                quiz: quizId,
                answers: answers
            });
            navigate(`/quiz-results/${response.data.id}`);
        } catch (error) {
            console.error('Failed to submit quiz', error);
            alert('Failed to submit quiz. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Loading quiz...</div>;
    if (!quiz) return <div className="p-8">Quiz not found</div>;

    const questions = quiz.questions || [];
    const question = questions[currentQuestion];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
                    {quiz.description && <p className="text-gray-600 mb-6">{quiz.description}</p>}

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-500">
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                            <div className="flex gap-2">
                                {questions.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-3 h-3 rounded-full ${answers[questions[idx].id] !== undefined
                                                ? 'bg-green-500'
                                                : idx === currentQuestion
                                                    ? 'bg-blue-500'
                                                    : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {question && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
                            <div className="space-y-3">
                                {question.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSelect(question.id, idx)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[question.id] === idx
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[question.id] === idx
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300'
                                                    }`}
                                            >
                                                {answers[question.id] === idx && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            <span>{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <button
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {currentQuestion < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || Object.keys(answers).length < questions.length}
                                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit Quiz'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
