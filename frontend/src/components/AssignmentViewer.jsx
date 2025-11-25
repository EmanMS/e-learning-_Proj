import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ArrowRight, Calendar } from 'lucide-react';

const AssignmentViewer = ({ assignment }) => {
    if (!assignment) {
        return <div className="p-4 text-gray-500">No assignment available.</div>;
    }

    const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
    const isOverdue = dueDate && dueDate < new Date();

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ClipboardList size={32} className="text-purple-600" />
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{assignment.title}</h2>
                    {assignment.description && (
                        <p className="text-gray-600 mb-4 whitespace-pre-wrap">{assignment.description}</p>
                    )}
                    {dueDate && (
                        <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                            <Calendar size={16} />
                            <span>
                                Due: {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString()}
                                {isOverdue && ' (Overdue)'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Submission Instructions</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    <li>Upload your assignment file or provide a text answer</li>
                    <li>Accepted file formats: PDF, DOC, DOCX, TXT, ZIP</li>
                    <li>You can view your previous submissions</li>
                    <li>Grades will be posted by your instructor</li>
                </ul>

                <Link
                    to={`/assignment/${assignment.id}`}
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Submit Assignment
                    <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default AssignmentViewer;
