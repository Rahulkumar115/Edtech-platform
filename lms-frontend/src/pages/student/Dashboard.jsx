import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Clock, Home, LogOut, Search, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user'));

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const res = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/courses/user/enrolled', {
              headers: { 'x-auth-token': token }
        });
        setEnrolledCourses(res.data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-bold">My Learning</h1>
                <p className="text-gray-400 mt-1">Welcome back, <span className="text-purple-400">{user?.name}</span>.</p>
            </div>
            
            <div className="flex gap-4">
                <Link to="/">
                    <button className="flex items-center gap-2 bg-[#1e1e2e] hover:bg-[#2d2d3f] px-5 py-2.5 rounded-xl font-bold transition border border-gray-700">
                        <Home size={18} /> Home
                    </button>
                </Link>

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-5 py-2.5 rounded-xl font-bold transition border border-red-500/30"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-400 animate-pulse">Loading your courses...</div>
        ) : (
            <>
                {enrolledCourses.length === 0 ? (
                    
                    <div className="flex flex-col items-center justify-center py-20 bg-[#1e1e2e]/50 rounded-2xl border border-dashed border-gray-700 text-center px-4">
                        <div className="bg-purple-500/10 p-6 rounded-full mb-6">
                            <BookOpen size={48} className="text-purple-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Your dashboard is empty!</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                            It looks like you haven't enrolled in any courses yet. 
                            To see your progress here, browse our catalog and start your first lesson today.
                        </p>
                        
                        <Link to="/courses">
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition shadow-lg shadow-purple-900/40 hover:-translate-y-1">
                                <Search size={20} /> Explore Courses
                            </button>
                        </Link>
                    </div>

                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {enrolledCourses.map(course => (
                            <div key={course._id} className="bg-[#0f1120] border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition group flex flex-col h-full">
                                <div className="h-48 overflow-hidden relative shrink-0">
                                    <img src={course.thumbnail || "https://via.placeholder.com/300"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm">
                                        <Link to={`/student/course/${course._id}`}>
                                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                                <PlayCircle size={20} /> Resume
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2" title={course.title}>{course.title}</h3>
                                    <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between text-gray-400 text-sm">
                                        <span className="flex items-center gap-2"><PlayCircle size={16} className="text-purple-500" /> {course.lectures.length} Lessons</span>
                                        <span className="flex items-center gap-2"><Clock size={16} className="text-blue-500" /> Lifetime Access</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;