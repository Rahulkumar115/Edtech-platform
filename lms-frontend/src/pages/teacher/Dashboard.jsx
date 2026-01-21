import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Plus, Video, Users, Calendar, Home, LogOut } from 'lucide-react'; 

const TeacherDashboard = () => {
  const navigate = useNavigate(); 
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!storedUser) {
        navigate('/login');
        return;
    }
    
    setUser(storedUser);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/courses');
            const myCourses = res.data.filter(c => 
                (c.instructor?._id === storedUser._id) || (c.instructor === storedUser._id)
            );
            setCourses(myCourses);
        } catch (err) {
            console.error(err);
        }
    };
    fetchCourses();
  }, [navigate]);

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-800 pb-6 gap-4">
        <div>
            <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.name}</p>
        </div>
        
        {/* Actions Group */}
        <div className="flex flex-wrap gap-4">
            {/* Create New Course */}
            <Link to="/teacher/create-course">
                <button className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition">
                    <Plus size={20} /> Create New Course
                </button>
            </Link>

            {/* Home Button */}
            <Link to="/">
                <button className="bg-[#1e1e2e] hover:bg-[#2d2d3f] border border-gray-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition">
                    <Home size={18} /> Home
                </button>
            </Link>

            {/* Logout Button */}
            <button 
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition"
            >
                <LogOut size={18} /> Logout
            </button>
        </div>
      </div>
      {/* ---------------------- */}

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
                  <div key={course._id} className="bg-[#0f1120] border border-gray-800 rounded-xl p-5 hover:border-purple-500/50 transition flex flex-col justify-between">
                      {/* Thumbnail Placeholder */}
                      <div className="h-40 bg-gray-800 rounded-lg mb-4 overflow-hidden relative">
                          {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gray-900">
                                <Video size={32} className="opacity-20" />
                              </div>
                          )}
                          <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-mono">
                            ₹{course.price}
                          </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold truncate mb-1">{course.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{course.lectures ? course.lectures.length : 0} Lectures</p>
                      </div>
                      
                      <Link to={`/teacher/course/${course._id}`}>
                        <button className="w-full border border-gray-700 py-2 rounded-lg hover:bg-white/5 transition font-medium">
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