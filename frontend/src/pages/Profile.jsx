import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Save, BookOpen } from 'lucide-react';

const Profile = () => {
    const { user: authUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({ bio: '', profile_picture: null });
    const [isEditing, setIsEditing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchProfile();
        fetchUserCourses();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('users/me/');
            setProfile(response.data);
            setFormData({
                bio: response.data.bio || '',
                profile_picture: null
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const fetchUserCourses = async () => {
        try {
            // We don't know the role yet if profile isn't loaded, but we can try fetching both or wait.
            // Better: fetch profile first, then courses. But for simplicity, let's just try to fetch based on context user or just fetch 'enrolled' and 'mine' and merge?
            // Actually, let's wait for profile or use authUser.
            // But authUser might be stale.
            // Let's just fetch 'enrolled' for now, and if instructor, 'mine'.
            // Or better, let's just make two calls and see what returns.
            // Actually, let's just use the 'enrolled' param for students and 'mine' for instructors.
            // We can determine this inside the function if we have the user.
            // Since we have authUser from context, let's use that.

            if (!authUser) return;

            const endpoint = authUser.role === 'INSTRUCTOR' ? 'courses/?mine=true' : 'courses/?enrolled=true';
            const response = await api.get(endpoint);
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profile_picture: file });
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('bio', formData.bio);
        if (formData.profile_picture) {
            data.append('profile_picture', formData.profile_picture);
        }

        try {
            await api.patch('users/me/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    if (!profile) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-800 h-32"></div>
                <div className="px-6 pb-6">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden flex items-center justify-center">
                                {previewUrl || profile.profile_picture ? (
                                    <img
                                        src={previewUrl || profile.profile_picture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={48} className="text-gray-400" />
                                )}
                            </div>
                            {isEditing && (
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Save size={18} /> Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    {profile.username}
                                    <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {profile.role}
                                    </span>
                                </h1>
                                <p className="text-gray-500 flex items-center gap-2 mt-1">
                                    <Mail size={16} /> {profile.email}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg mb-2 border-b pb-1">About Me</h3>
                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 h-32"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {profile.bio || "No bio provided yet."}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg h-fit">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <BookOpen size={20} />
                                {profile.role === 'INSTRUCTOR' ? 'My Courses' : 'Enrolled Courses'}
                            </h3>
                            <div className="space-y-3">
                                {courses.length > 0 ? (
                                    courses.map(course => (
                                        <div key={course.id} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                                            <h4 className="font-medium text-gray-800 line-clamp-1">{course.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{course.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-sm text-center py-4">
                                        No courses found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
