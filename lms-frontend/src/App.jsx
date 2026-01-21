import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses'; 
import About from './pages/About';
import Contact from './pages/Contact';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import CreateCourse from './pages/teacher/CreateCourse';
import ManageCourse from './pages/teacher/ManageCourse';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import CoursePlayer from './pages/student/CoursePlayer';

// Admin Page
import AdminDashboard from './pages/admin/Dashboard';

// --- IMPORT THE PROTECTED ROUTE COMPONENT ---
// Make sure this file exists in your components folder!
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes (Anyone can access) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* --- Teacher Routes (PROTECTED) --- */}
        <Route 
          path="/teacher/dashboard" 
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/create-course" 
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/course/:courseId" 
          element={
            <ProtectedRoute>
              <ManageCourse />
            </ProtectedRoute>
          } 
        />

        {/* --- Student Routes (PROTECTED) --- */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/course/:courseId" 
          element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          } 
        />

        {/* --- Admin Route (PROTECTED) --- */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;