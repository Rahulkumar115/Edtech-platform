import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
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
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Learning</h1>
        <p className="text-gray-400 mb-10">Welcome back! Continue where you left off.</p>

        {loading ? (
            <div className="text-white">Loading your courses...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                    <div key={course._id} className="bg-[#0f1120] border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition group">
                        <div className="h-48 overflow-hidden relative">
                             <img src={course.thumbnail || "https://via.placeholder.com/300"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                 <Link to={`/student/course/${course._id}`}>
                                     <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2">
                                         <PlayCircle size={20} /> Start Learning
                                     </button>
                                 </Link>
                             </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-lg mb-2 truncate">{course.title}</h3>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span className="flex items-center gap-1"><PlayCircle size={14} /> {course.lectures.length} Lessons</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> Live Support</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;