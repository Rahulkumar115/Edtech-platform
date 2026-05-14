import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { ArrowRight, BookOpen } from 'lucide-react';
import myProfilePic from '../assets/elogo.jpeg';

// 🚀 Core Custom Modules
import HomepageSkillCheck from '../components/HomepageSkillCheck';
import HeroGraphic from '../components/HeroGraphic';
import SuccessMetrics from '../components/SuccessMetrics';
import AtsResumeChecker from '../components/AtsResumeChecker';

const Home = () => {
  const navigate = useNavigate();
  const [trendingCourses, setTrendingCourses] = useState([]); 
  
  // Retrieve authorized local storage context cleanly
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/courses');
        setTrendingCourses(res.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching homepage courses:", err); 
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f1120] text-white font-sans selection:bg-purple-500 selection:text-white flex flex-col">
      
      {/* --- TOP NAVBAR --- */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full shrink-0">
        <img 
          src={myProfilePic} 
          alt="Logo" 
          className="h-12 w-auto object-contain" 
        />
        
        <div className="hidden md:flex space-x-8 text-gray-300">
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          <Link to="/courses" className="hover:text-purple-400 transition">Courses</Link>
          <Link to="/about" className="hover:text-purple-400 transition">About</Link>
          <Link to="/contact" className="hover:text-purple-400 transition">Contact</Link>
        </div>

        {user ? (
            <div className="flex items-center gap-4">
              <Link to={`/${user.role}/dashboard`}>
                  <button className="text-gray-300 hover:text-white font-medium cursor-pointer">Dashboard</button>
              </Link>
              <button 
                  onClick={handleLogout} 
                  className="bg-red-500/10 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg hover:bg-red-500/20 transition cursor-pointer"
              >
                  Logout
              </button>
            </div>
        ) : (
            <Link to="/login">
              <button className="border border-purple-500/30 px-6 py-2 rounded-lg hover:bg-purple-500/10 transition text-purple-400 font-medium cursor-pointer">
                  Login
              </button>
            </Link>
        )}
      </nav>

      {/* 🚀 1. DYNAMIC PARTICLE NETWORK HERO SECTION */}
      <HeroGraphic />

      {/* 📊 2. REAL-TIME SUCCESS METRICS COUNTDOWN DASHBOARD */}
      <SuccessMetrics />

      {/* --- 3. TRENDING COURSE PREVIEWS --- */}
      <section className="px-8 py-16 max-w-7xl mx-auto w-full flex-1">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold">Trending Masterclasses</h2>
          <Link to="/courses" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
            View Catalog <ArrowRight size={16}/>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {trendingCourses.length > 0 ? (
            trendingCourses.map((course) => (
              <Link to={`/student/course/${course._id}`} key={course._id}>
                <div className="bg-[#0f1120] border border-gray-800 p-5 rounded-2xl hover:border-purple-500/50 transition duration-300 group hover:-translate-y-1 cursor-pointer h-full flex flex-col justify-between shadow-xl">
                  
                  <div>
                    <div className="mb-4 bg-gray-800 h-40 rounded-xl overflow-hidden relative">
                      <img 
                        src={course.thumbnail || "https://via.placeholder.com/400x300"} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 truncate">{course.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-800/80 pt-3 mt-auto">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <BookOpen size={14} /> {course.lectures?.length || 0} Lessons
                    </span>
                    <span className="text-emerald-400 font-bold text-sm">
                       {course.price === 0 ? 'Free Track' : `₹${course.price}`}
                    </span>
                  </div>

                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500 bg-[#0f1120] rounded-xl border border-dashed border-gray-800">
              No core modules available yet. Check back after your database sync completes!
            </div>
          )}
        </div>
        <div id="ats-scanner" className="scroll-mt-6 mb-12">
          <AtsResumeChecker />
        </div>

        {/* 🧠 4. DYNAMIC SKILL CHECK TRIGGER CONTAINER */}
        <div id="skill-check" className="scroll-mt-6">
          <HomepageSkillCheck />
        </div>
      </section>

    </div>
  );
};

export default Home;