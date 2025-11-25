import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';
import { BookOpen, Clock, DollarSign, Star, TrendingUp, Award, Search, Code, Palette, Briefcase, Database, Layout, Terminal } from 'lucide-react';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/courses/');
            console.log('Courses fetched:', response.data);
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
            setError('Failed to load courses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const enrolledCourses = filteredCourses.filter(c => c.is_enrolled);
    const availableCourses = filteredCourses.filter(c => !c.is_enrolled);

    const categories = [
        { name: 'Development', icon: <Code size={24} />, color: 'bg-blue-100 text-blue-600' },
        { name: 'Design', icon: <Palette size={24} />, color: 'bg-purple-100 text-purple-600' },
        { name: 'Business', icon: <Briefcase size={24} />, color: 'bg-green-100 text-green-600' },
        { name: 'Data Science', icon: <Database size={24} />, color: 'bg-red-100 text-red-600' },
        { name: 'Marketing', icon: <TrendingUp size={24} />, color: 'bg-yellow-100 text-yellow-600' },
        { name: 'IT & Software', icon: <Terminal size={24} />, color: 'bg-indigo-100 text-indigo-600' },
    ];

    const testimonials = [
        { name: 'Sarah Johnson', role: 'Web Developer', text: "This platform transformed my career. The courses are top-notch and the instructors are amazing!", image: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { name: 'Michael Chen', role: 'Data Analyst', text: "I learned Python and SQL in just a few weeks. The hands-on projects made all the difference.", image: 'https://randomuser.me/api/portraits/men/32.jpg' },
        { name: 'Emily Davis', role: 'UX Designer', text: "The design courses are comprehensive and up-to-date. Highly recommended for anyone starting out.", image: 'https://randomuser.me/api/portraits/women/68.jpg' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                                Master New Skills <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                                    Unlock Your Potential
                                </span>
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                                Join thousands of learners worldwide. Access high-quality courses taught by industry experts and take your career to the next level.
                            </p>
                            <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-3 rounded-full border border-white/20">
                                    <BookOpen size={20} className="text-yellow-300" />
                                    <span className="font-medium">{courses.length}+ Courses</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-3 rounded-full border border-white/20">
                                    <Award size={20} className="text-yellow-300" />
                                    <span className="font-medium">Expert Instructors</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-3 rounded-full border border-white/20">
                                    <TrendingUp size={20} className="text-yellow-300" />
                                    <span className="font-medium">Lifetime Access</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 hidden md:block">
                            <div className="relative animate-float">
                                <div className="w-80 h-80 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-500">
                                    <BookOpen size={140} className="text-white drop-shadow-lg" />
                                </div>
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl animate-bounce-slow">
                                    <Star size={40} className="text-yellow-900" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                        <input
                            type="text"
                            placeholder="What do you want to learn today?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                    <button
                        onClick={fetchCourses}
                        className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg hover:shadow-blue-500/30 whitespace-nowrap w-full md:w-auto"
                    >
                        Search Courses
                    </button>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">

                {/* Categories Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Top Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((cat, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer group text-center border border-gray-50 hover:-translate-y-1">
                                <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                                    {cat.icon}
                                </div>
                                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                        <p className="mt-4 text-gray-600 text-lg">Loading courses...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
                        <p className="text-red-600 text-lg mb-4">{error}</p>
                        <button
                            onClick={fetchCourses}
                            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all font-semibold"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Courses Display */}
                {!loading && !error && (
                    <>
                        {/* My Courses Section */}
                        {user && enrolledCourses.length > 0 && (
                            <div className="mb-20">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1.5 h-10 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-gray-900">My Learning</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {enrolledCourses.map(course => (
                                        <div key={course.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
                                            <div className="h-52 bg-gray-200 relative overflow-hidden">
                                                {course.image ? (
                                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                                                        <BookOpen size={64} className="text-white/30" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                                                    Enrolled
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {course.title}
                                                </h3>
                                                <div className="mb-6 flex-1">
                                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                                        <span className="text-gray-500">Progress</span>
                                                        <span className="text-blue-600">{Math.round(course.progress || 0)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                                                            style={{ width: `${course.progress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/courses/${course.id}`}
                                                    className="block text-center bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all font-semibold shadow-md hover:shadow-lg"
                                                >
                                                    Continue Learning
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Courses Section */}
                        <div className="mb-20">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1.5 h-10 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {user && enrolledCourses.length > 0 ? 'Explore More Courses' : 'Featured Courses'}
                                </h2>
                            </div>

                            {availableCourses.length === 0 && courses.length > 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                    <Search size={64} className="mx-auto text-gray-300 mb-6" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No courses found</h3>
                                    <p className="text-gray-500">Try adjusting your search terms</p>
                                </div>
                            ) : availableCourses.length === 0 && courses.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                                    <BookOpen size={64} className="mx-auto text-gray-300 mb-6" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No courses available yet</h3>
                                    <p className="text-gray-500">Check back soon for new content!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {availableCourses.map(course => (
                                        <div key={course.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full hover:-translate-y-1">
                                            <div className="h-52 bg-gray-200 relative overflow-hidden">
                                                {course.image ? (
                                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                                                        <BookOpen size={64} className="text-white/30" />
                                                    </div>
                                                )}
                                                {course.price === 0 && (
                                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                                                        Free
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                                        <Clock size={14} />
                                                        <span>Self-paced</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-yellow-400">
                                                        <Star size={16} fill="currentColor" />
                                                        <span className="text-gray-700 font-bold text-sm">4.8</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {course.title}
                                                </h3>
                                                <p className="text-gray-500 mb-6 line-clamp-2 text-sm flex-1">{course.description}</p>

                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                                    {course.price > 0 ? (
                                                        <div className="flex items-center gap-1 text-gray-900 font-bold text-2xl">
                                                            <span className="text-lg text-gray-500 font-normal">$</span>
                                                            {course.price}
                                                        </div>
                                                    ) : (
                                                        <span className="text-green-600 font-bold text-xl">Free</span>
                                                    )}

                                                    <Link
                                                        to={`/courses/${course.id}`}
                                                        className="text-blue-600 font-bold hover:text-blue-800 transition-colors flex items-center gap-1"
                                                    >
                                                        View Details <TrendingUp size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Testimonials Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Students Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-50 relative">
                                <div className="absolute -top-6 left-8 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-serif">"</div>
                                <p className="text-gray-600 mb-6 italic leading-relaxed pt-4">{t.text}</p>
                                <div className="flex items-center gap-4">
                                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                                        <p className="text-sm text-blue-600">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
                        <p className="text-blue-100 mb-8 text-lg">Join our community today and get unlimited access to top-quality courses.</p>
                        {!user && (
                            <Link to="/register" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Get Started for Free
                            </Link>
                        )}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
};

export default StudentDashboard;
