import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';

const QuizViewer = ({ quiz }) => {
    if (!quiz) {
        return <div className="p-4 text-gray-500">No quiz available.</div>;
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle size={32} className="text-blue-600" />
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{quiz.title}</h2>
                    {quiz.description && (
                        <p className="text-gray-600 mb-4">{quiz.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{quiz.questions?.length || 0} Questions</span>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Quiz Instructions</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    <li>Answer all questions to complete the quiz</li>
                    <li>You can navigate between questions</li>
                    <li>Your score will be calculated automatically</li>
                    <li>You can retake the quiz to improve your score</li>
                </ul>

                <Link
                    to={`/quiz/${quiz.id}`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Start Quiz
                    <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default QuizViewer;
