import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseEditor from './pages/CourseEditor';
import StudentDashboard from './pages/StudentDashboard';
import CoursePlayer from './pages/CoursePlayer';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';
import Assignment from './pages/Assignment';
import Discussion from './pages/Discussion';
import Notifications from './pages/Notifications';
import InstructorAnalytics from './pages/InstructorAnalytics';

// Wrapper to redirect based on role
const DashboardRedirect = () => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return user.role === 'INSTRUCTOR' ? <InstructorDashboard /> : <StudentDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />
          <div className="flex-1 container mx-auto py-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={<StudentDashboard />} />
              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              {/* Instructor Routes */}
              <Route
                path="/courses/new"
                element={
                  <ProtectedRoute roles={["INSTRUCTOR"]}>
                    <CourseEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id/edit"
                element={
                  <ProtectedRoute roles={["INSTRUCTOR"]}>
                    <CourseEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute roles={["INSTRUCTOR"]}>
                    <InstructorAnalytics />
                  </ProtectedRoute>
                }
              />

              {/* Student/Public Routes */}
              <Route path="/courses/:id" element={<CoursePlayer />} />
              <Route
                path="/quiz/:quizId"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz-results/:attemptId"
                element={
                  <ProtectedRoute>
                    <QuizResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assignment/:assignmentId"
                element={
                  <ProtectedRoute>
                    <Assignment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discussion/:courseId"
                element={
                  <ProtectedRoute>
                    <Discussion />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
