import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash, Edit, FileText, Video, File, ChevronDown, ChevronUp } from 'lucide-react';

const CourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;

    const [course, setCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        image: null
    });
    const [loading, setLoading] = useState(false);

    // Module & Content State
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [moduleData, setModuleData] = useState({ title: '', description: '' });
    const [expandedModules, setExpandedModules] = useState({});

    const [showContentForm, setShowContentForm] = useState(null); // module id
    const [contentData, setContentData] = useState({
        title: '',
        content_type: 'TEXT',
        text_content: '',
        url: '',
        file: null
    });

    useEffect(() => {
        if (!isNew) {
            fetchCourse();
        }
    }, [id]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const response = await api.get(`courses/${id}/`);
            setCourse(response.data);
            setFormData({
                title: response.data.title,
                description: response.data.description,
                price: response.data.price,
                image: null
            });
        } catch (error) {
            console.error("Failed to fetch course", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (isNew) {
                const response = await api.post('courses/', data);
                navigate(`/courses/${response.data.id}/edit`);
            } else {
                await api.patch(`courses/${id}/`, data);
                fetchCourse();
                alert('Course updated successfully!');
            }
        } catch (error) {
            console.error("Failed to save course", error);
        }
    };

    const handleModuleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('modules/', { ...moduleData, course: id });
            setModuleData({ title: '', description: '' });
            setShowModuleForm(false);
            fetchCourse();
        } catch (error) {
            console.error("Failed to create module", error);
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (window.confirm('Delete this module?')) {
            try {
                await api.delete(`modules/${moduleId}/`);
                fetchCourse();
            } catch (error) {
                console.error("Failed to delete module", error);
            }
        }
    };

    const handleContentSubmit = async (e, moduleId) => {
        e.preventDefault();
        const data = new FormData();
        data.append('module', moduleId);
        data.append('title', contentData.title);
        data.append('content_type', contentData.content_type);

        if (contentData.content_type === 'TEXT') {
            data.append('text_content', contentData.text_content);
        } else if (contentData.content_type === 'VIDEO') {
            data.append('url', contentData.url);
        } else if (contentData.content_type === 'FILE' && contentData.file) {
            data.append('file', contentData.file);
        }

        try {
            await api.post('contents/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setContentData({ title: '', content_type: 'TEXT', text_content: '', url: '', file: null });
            setShowContentForm(null);
            fetchCourse();
        } catch (error) {
            console.error("Failed to create content", error);
        }
    };

    const handleDeleteContent = async (contentId) => {
        if (window.confirm('Delete this content?')) {
            try {
                await api.delete(`contents/${contentId}/`);
                fetchCourse();
            } catch (error) {
                console.error("Failed to delete content", error);
            }
        }
    };

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isNew ? 'Create Course' : 'Edit Course'}</h1>
                {!isNew && (
                    <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
                        Back to Dashboard
                    </button>
                )}
            </div>

            {/* Course Details Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Course Details</h2>
                <form onSubmit={handleCourseSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-medium mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Cover Image</label>
                            <input
                                type="file"
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                        {isNew ? 'Create & Continue' : 'Update Details'}
                    </button>
                </form>
            </div>

            {/* Modules & Content Section (Only in Edit Mode) */}
            {!isNew && course && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Course Content</h2>
                        <button
                            onClick={() => setShowModuleForm(true)}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            <Plus size={20} /> Add Module
                        </button>
                    </div>

                    {/* Add Module Form */}
                    {showModuleForm && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-fade-in">
                            <h3 className="font-semibold mb-3">New Module</h3>
                            <form onSubmit={handleModuleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Module Title"
                                    value={moduleData.title}
                                    onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
                                    className="w-full p-2 border rounded mb-2"
                                    required
                                />
                                <textarea
                                    placeholder="Description (optional)"
                                    value={moduleData.description}
                                    onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
                                    className="w-full p-2 border rounded mb-3 h-20"
                                />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
                                    <button type="button" onClick={() => setShowModuleForm(false)} className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Modules List */}
                    <div className="space-y-4">
                        {course.modules && course.modules.map((module) => (
                            <div key={module.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleModule(module.id)}>
                                    <div className="flex items-center gap-3">
                                        {expandedModules[module.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        <h3 className="font-bold text-lg">{module.title}</h3>
                                        <span className="text-sm text-gray-500">({module.contents ? module.contents.length : 0} items)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.id); }} className="text-red-500 hover:text-red-700 p-1">
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </div>

                                {expandedModules[module.id] && (
                                    <div className="p-4 border-t border-gray-100">
                                        {/* Contents List */}
                                        <div className="space-y-2 mb-4">
                                            {module.contents && module.contents.map((content) => (
                                                <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        {content.content_type === 'VIDEO' && <Video size={18} className="text-blue-500" />}
                                                        {content.content_type === 'TEXT' && <FileText size={18} className="text-green-500" />}
                                                        {content.content_type === 'FILE' && <File size={18} className="text-orange-500" />}
                                                        <span>{content.title}</span>
                                                    </div>
                                                    <button onClick={() => handleDeleteContent(content.id)} className="text-red-400 hover:text-red-600">
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!module.contents || module.contents.length === 0) && (
                                                <p className="text-gray-400 italic text-sm">No content yet.</p>
                                            )}
                                        </div>

                                        {/* Add Content Button/Form */}
                                        {showContentForm === module.id ? (
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <h4 className="font-semibold mb-2 text-blue-800">Add Content</h4>
                                                <form onSubmit={(e) => handleContentSubmit(e, module.id)}>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Content Title"
                                                            value={contentData.title}
                                                            onChange={(e) => setContentData({ ...contentData, title: e.target.value })}
                                                            className="w-full p-2 border rounded"
                                                            required
                                                        />
                                                        <select
                                                            value={contentData.content_type}
                                                            onChange={(e) => setContentData({ ...contentData, content_type: e.target.value })}
                                                            className="w-full p-2 border rounded"
                                                        >
                                                            <option value="TEXT">Text</option>
                                                            <option value="VIDEO">Video URL</option>
                                                            <option value="FILE">File Upload</option>
                                                        </select>
                                                    </div>

                                                    {contentData.content_type === 'TEXT' && (
                                                        <textarea
                                                            placeholder="Enter text content..."
                                                            value={contentData.text_content}
                                                            onChange={(e) => setContentData({ ...contentData, text_content: e.target.value })}
                                                            className="w-full p-2 border rounded mb-3 h-24"
                                                            required
                                                        />
                                                    )}

                                                    {contentData.content_type === 'VIDEO' && (
                                                        <input
                                                            type="url"
                                                            placeholder="Video URL (e.g., YouTube)"
                                                            value={contentData.url}
                                                            onChange={(e) => setContentData({ ...contentData, url: e.target.value })}
                                                            className="w-full p-2 border rounded mb-3"
                                                            required
                                                        />
                                                    )}

                                                    {contentData.content_type === 'FILE' && (
                                                        <input
                                                            type="file"
                                                            onChange={(e) => setContentData({ ...contentData, file: e.target.files[0] })}
                                                            className="w-full p-2 border rounded mb-3"
                                                            required
                                                        />
                                                    )}

                                                    <div className="flex gap-2">
                                                        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Add Item</button>
                                                        <button type="button" onClick={() => setShowContentForm(null)} className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500">Cancel</button>
                                                    </div>
                                                </form>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setShowContentForm(module.id);
                                                    setContentData({ title: '', content_type: 'TEXT', text_content: '', url: '', file: null });
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Content Item
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseEditor;
