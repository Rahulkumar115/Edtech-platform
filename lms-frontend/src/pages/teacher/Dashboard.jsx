import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Video, Users, Calendar } from 'lucide-react';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    // 1. Get User Data
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/courses');
            // Filter only courses where instructor._id matches current user
            const myCourses = res.data.filter(c => c.instructor._id === storedUser.id);
            setCourses(myCourses);
        } catch (err) {
            console.error(err);
        }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
            <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.name}</p>
        </div>
        <Link to="/teacher/create-course">
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition">
                <Plus size={20} /> Create New Course
            </button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Video className="text-blue-400" />} label="Total Courses" value={courses.length} />
        <StatCard icon={<Users className="text-green-400" />} label="Total Students" value="0" />
        <StatCard icon={<Calendar className="text-orange-400" />} label="Live Classes" value="0" />
      </div>

      {/* Course List */}
      <h2 className="text-xl font-bold mb-6">Your Courses</h2>
      
      {courses.length === 0 ? (
          <div className="text-center py-20 bg-[#0f1120] rounded-2xl border border-dashed border-gray-700">
              <p className="text-gray-400">You haven't created any courses yet.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map(course => (
                  <div key={course._id} className="bg-[#0f1120] border border-gray-800 rounded-xl p-5 hover:border-purple-500/50 transition">
                      {/* Thumbnail Placeholder */}
                      <div className="h-40 bg-gray-800 rounded-lg mb-4 overflow-hidden">
                          {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                          )}
                      </div>
                      <h3 className="text-lg font-bold truncate">{course.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{course.lectures.length} Lectures</p>
                      
                      <Link to={`/teacher/course/${course._id}`}>
                        <button className="w-full border border-gray-700 py-2 rounded-lg hover:bg-white/5 transition">
                            Manage Content
                        </button>
                      </Link>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

// Simple Stat Component
const StatCard = ({ icon, label, value }) => (
    <div className="bg-[#0f1120] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-lg">{icon}</div>
        <div>
            <h4 className="text-gray-400 text-sm">{label}</h4>
            <span className="text-2xl font-bold">{value}</span>
        </div>
    </div>
);

export default TeacherDashboard;