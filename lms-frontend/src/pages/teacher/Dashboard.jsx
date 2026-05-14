import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Plus, Video, Users, Calendar, Home, LogOut, Loader2, BookOpen } from 'lucide-react'; 

const TeacherDashboard = () => {
  const navigate = useNavigate(); 
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

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
            
            // Defensive validation mapping explicit Object properties securely
            const myCourses = res.data.filter(c => {
                if (!c.instructor) return false;
                const targetId = typeof c.instructor === 'object' ? c.instructor._id : c.instructor;
                const storedId = storedUser._id || storedUser.id;
                return String(targetId) === String(storedId);
            });

            setCourses(myCourses);
        } catch (err) {
            console.error("Dashboard synchronization drop:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchCourses();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Compute live active statistics dynamically from client memory arrays
  const totalLectures = courses.reduce((acc, curr) => acc + (curr.lectures?.length || 0), 0);
  const totalLiveSchedules = courses.reduce((acc, curr) => acc + (curr.liveClasses?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      
      {/* Header Framework */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-800 pb-6 gap-4">
        <div>
            <div className="inline-block px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              Management Interface
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Instructor Control Center</h1>
            <p className="text-gray-400 text-sm mt-1">Authenticated user session: <span className="text-gray-200 font-semibold">{user.name}</span></p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Link to="/teacher/create-course" className="flex-1 md:flex-none">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow cursor-pointer">
                    <Plus size={16} /> Create Track
                </button>
            </Link>

            <Link to="/" className="flex-1 md:flex-none">
                <button className="w-full bg-[#1e1e2e] hover:bg-white/5 border border-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer">
                    <Home size={15} /> Platform Home
                </button>
            </Link>

            <button 
                onClick={handleLogout}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
            >
                <LogOut size={15} /> Terminate Session
            </button>
        </div>
      </div>

      {/* Dynamic Performance Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Video className="text-purple-400" size={20} />} label="Active Curriculum Tracks" value={courses.length} />
        <StatCard icon={<BookOpen className="text-blue-400" size={20} />} label="Compiled Sub-Modules" value={totalLectures} />
        <StatCard icon={<Calendar className="text-orange-400" size={20} />} label="Scheduled Live Streams" value={totalLiveSchedules} />
      </div>

      <h2 className="text-lg font-bold uppercase tracking-wider text-gray-300 mb-6">Assigned Curriculums</h2>
      
      {loading ? (
          <div className="flex flex-col items-center justify-center py-20 border border-gray-800/60 rounded-2xl bg-[#0f1120]/50 gap-3">
              <Loader2 className="animate-spin text-purple-400" size={32} />
              <span className="text-xs text-gray-500 font-medium">Querying platform cluster connections...</span>
          </div>
      ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-[#0f1120] rounded-2xl border border-dashed border-gray-800">
              <p className="text-sm text-gray-400 font-medium">No masterclass tracks detected under your assignment ID.</p>
              <Link to="/teacher/create-course" className="text-xs text-purple-400 hover:underline mt-2 inline-block font-bold">
                 Initialize your first module setup →
              </Link>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map(course => (
                  <div key={course._id} className="bg-[#0f1120] border border-gray-800 rounded-2xl p-5 hover:border-purple-500/50 transition duration-300 flex flex-col justify-between shadow-xl group">
                      
                      <div>
                        <div className="h-44 bg-[#15172b] rounded-xl mb-4 overflow-hidden relative border border-gray-800/80">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-900/50">
                                  <Video size={32} className="text-gray-700 opacity-40" />
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-emerald-400 border border-white/10">
                                {course.price === 0 ? 'Free Track' : `₹${course.price}`}
                            </div>
                        </div>
                        
                        <h3 className="text-base font-bold truncate text-white group-hover:text-purple-300 transition-colors mb-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                          {course.description || "No masterclass specifications provided."}
                        </p>
                      </div>
                      
                      <div className="border-t border-gray-800/80 pt-4 mt-auto flex items-center justify-between">
                        <span className="text-[11px] text-gray-500 font-medium">
                          {course.lectures?.length || 0} Appended Modules
                        </span>
                        <Link to={`/teacher/course/${course._id}`}>
                            <button className="bg-[#1e1e2e] hover:bg-purple-600 text-gray-300 hover:text-white border border-gray-700 hover:border-purple-500 px-3.5 py-1.5 rounded-lg transition text-xs font-bold cursor-pointer">
                                Manage Core
                            </button>
                        </Link>
                      </div>

                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-[#0f1120] p-5 rounded-2xl border border-gray-800 flex items-center gap-4">
        <div className="p-3 bg-[#1e1e2e] rounded-xl border border-gray-700/60 shrink-0">{icon}</div>
        <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</h4>
            <span className="text-xl font-black text-white tracking-tight">{value}</span>
        </div>
    </div>
);

export default TeacherDashboard;