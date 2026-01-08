import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { Play, ArrowRight, BookOpen } from 'lucide-react';
import myProfilePic from '../assets/elogo.jpeg';

const Home = () => {
  const navigate = useNavigate();
  const [trendingCourses, setTrendingCourses] = useState([]); 
  
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  // --- 1. FETCH COURSES ON LOAD ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
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
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-purple-500 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        {/* Use the img tag directly with a smaller height */}
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
                  <button className="text-gray-300 hover:text-white font-medium">Dashboard</button>
              </Link>
              <button 
                  onClick={handleLogout} 
                  className="bg-red-500/10 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg hover:bg-red-500/20 transition"
              >
                  Logout
              </button>
            </div>
        ) : (
            <Link to="/login">
              <button className="border border-purple-500/30 px-6 py-2 rounded-lg hover:bg-purple-500/10 transition text-purple-400 font-medium">
                  Login
              </button>
            </Link>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative px-8 py-12 md:py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 z-10">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Learn. <br />
            Upskill. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Succeed
            </span>
          </h1>
          <p className="text-gray-400 max-w-md text-lg">
            Master the skills of tomorrow. From coding to design, 
            unlock your potential with our expert-led courses.
          </p>
          <div className="flex space-x-4 pt-4">
            <Link to="/signup">
                <button className="bg-[#7c3aed] hover:bg-[#6d28d9] px-8 py-3 rounded-xl font-medium transition shadow-lg shadow-purple-900/50">
                Start Learning
                </button>
            </Link>
            <Link to="/courses">
                <button className="border border-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-white/5 transition">
                Explore Courses
                </button>
            </Link>
          </div>
        </div>

        {/* Right Content (Glass Card) */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-2xl opacity-30"></div>
          <div className="relative bg-[#1e1e2e]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl">
            <div className="bg-[#11111b] rounded-xl h-48 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
               <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/10 transition group-hover:scale-110">
                 <Play fill="white" className="ml-1" size={32} />
               </button>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Course Preview</h3>
                <p className="text-sm text-gray-400">Introduction to React</p>
              </div>
              <span className="text-purple-400 font-bold">50%</span>
            </div>
            <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRENDING COURSES (NOW DYNAMIC) --- */}
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold">Trending Courses</h2>
          <Link to="/courses" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1">
            View All <ArrowRight size={16}/>
          </Link>
        </div>

        {/* Dynamic Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingCourses.length > 0 ? (
            trendingCourses.map((course) => (
              <Link to={`/student/course/${course._id}`} key={course._id}>
                <div className="bg-[#0f1120] border border-gray-800 p-5 rounded-2xl hover:border-purple-500/50 transition duration-300 group hover:-translate-y-1 cursor-pointer h-full">
                  
                  {/* Thumbnail Image */}
                  <div className="mb-4 bg-gray-800 h-40 rounded-xl overflow-hidden relative">
                    <img 
                      src={course.thumbnail || "https://via.placeholder.com/400x300"} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2 truncate">{course.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <BookOpen size={16} /> {course.lectures.length} Lessons
                    </span>
                    <span className="text-green-400 font-bold">
                       {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-500 bg-[#0f1120] rounded-xl border border-dashed border-gray-800">
              No courses available yet. Visit the Teacher Dashboard to create one!
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;