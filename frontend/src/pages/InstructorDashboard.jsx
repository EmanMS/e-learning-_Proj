import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash } from 'lucide-react';

const InstructorDashboard = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('courses/?mine=true');
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`courses/${id}/`);
                fetchCourses();
            } catch (error) {
                console.error("Failed to delete course", error);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
                <Link to="/courses/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                    <PlusCircle size={20} /> Create New Course
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {course.image && <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />}
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-green-600">${course.price}</span>
                                <div className="flex gap-2">
                                    <Link to={`/courses/${course.id}/edit`} className="text-blue-500 hover:text-blue-700">
                                        <Edit size={20} />
                                    </Link>
                                    <button onClick={() => handleDelete(course.id)} className="text-red-500 hover:text-red-700">
                                        <Trash size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstructorDashboard;
