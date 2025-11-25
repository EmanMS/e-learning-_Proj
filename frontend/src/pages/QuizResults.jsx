import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizResults = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, [attemptId]);

    const fetchResults = async () => {
        try {
            const attemptResponse = await api.get(`/quiz-attempts/${attemptId}/`);
            setAttempt(attemptResponse.data);

            const quizResponse = await api.get(`/quizzes/${attemptResponse.data.quiz}/`);
            setQuiz(quizResponse.data);

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch results', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading results...</div>;
    if (!attempt || !quiz) return <div className="p-8">Results not found</div>;

    const questions = quiz.questions || [];
    const score = attempt.score || 0;
    const passed = score >= 60;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
                        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${passed ? 'bg-green-100' : 'bg-red-100'
                            } mb-4`}>
                            <span className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {score.toFixed(0)}%
                            </span>
                        </div>
                        <p className={`text-xl font-semibold ${passed ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {passed ? 'Congratulations! You passed!' : 'Keep practicing!'}
                        </p>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-2xl font-bold mb-4">Answer Review</h2>
                        <div className="space-y-6">
                            {questions.map((question, idx) => {
                                const userAnswer = attempt.answers[question.id];
                                const isCorrect = userAnswer === question.correct_answer;

                                return (
                                    <div key={question.id} className="border rounded-lg p-6">
                                        <div className="flex items-start gap-3 mb-4">
                                            {isCorrect ? (
                                                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                                            ) : (
                                                <XCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-2">
                                                    Question {idx + 1}: {question.text}
                                                </h3>

                                                <div className="space-y-2">
                                                    {question.options.map((option, optIdx) => {
                                                        const isUserAnswer = userAnswer === optIdx;
                                                        const isCorrectAnswer = optIdx === question.correct_answer;

                                                        return (
                                                            <div
                                                                key={optIdx}
                                                                className={`p-3 rounded border-2 ${isCorrectAnswer
                                                                        ? 'border-green-500 bg-green-50'
                                                                        : isUserAnswer
                                                                            ? 'border-red-500 bg-red-50'
                                                                            : 'border-gray-200'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {isCorrectAnswer && (
                                                                        <CheckCircle className="text-green-500" size={16} />
                                                                    )}
                                                                    {isUserAnswer && !isCorrectAnswer && (
                                                                        <XCircle className="text-red-500" size={16} />
                                                                    )}
                                                                    <span className={
                                                                        isCorrectAnswer ? 'font-semibold text-green-700' :
                                                                            isUserAnswer ? 'font-semibold text-red-700' :
                                                                                ''
                                                                    }>
                                                                        {option}
                                                                    </span>
                                                                    {isUserAnswer && (
                                                                        <span className="text-sm text-gray-500 ml-auto">Your answer</span>
                                                                    )}
                                                                    {isCorrectAnswer && (
                                                                        <span className="text-sm text-gray-500 ml-auto">Correct answer</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Back to Course
                        </button>
                        <button
                            onClick={() => navigate(`/quiz/${quiz.id}`)}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Retake Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResults;
