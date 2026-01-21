import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, CheckCircle, LogOut } from 'lucide-react';
import myProfilePic1 from '../assets/elogo.jpeg';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch All Courses
        const res = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/courses');
        setCourses(res.data);

        if (user && localStorage.getItem('token')) {
            const token = localStorage.getItem('token');
            const enrolledRes = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/courses/user/enrolled', {
                headers: { 'x-auth-token': token }
            });
            setEnrolledCourses(enrolledRes.data.map(c => c._id));
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- RAZORPAY PAYMENT LOGIC ---
  const handlePayment = async (courseId) => {
    if (!user) return navigate('/login');

    try {
      const token = localStorage.getItem('token');
      
      
      const { data: { order, course } } = await axios.post(
        "https://edtech-platform-backend-e6i3.onrender.com/api/courses/checkout",
        { courseId },
        { headers: { 'x-auth-token': token } }
      );

      // 2. Razorpay Options
      const options = {
        key: "rzp_test_RqBpTs0iYonPRv", 
        amount: order.amount,
        currency: "INR",
        name: "LMS Platform",
        description: `Enrollment for ${course.title}`,
        order_id: order.id,
        handler: async function (response) {
            const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: courseId
            };

            // 3. Verify on Backend
            await axios.post(
                "https://edtech-platform-backend-e6i3.onrender.com/api/courses/paymentverification",
                verificationData,
                { headers: { 'x-auth-token': token } }
            );
            
            alert("Payment Successful! Course Enrolled.");
            setEnrolledCourses([...enrolledCourses, courseId]);
            navigate('/student/dashboard');
        },
        prefill: {
            name: user.name,
            email: user.email,
        },
        theme: { color: "#7c3aed" }
      };

      
      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed or cancelled.");
    }
  };

  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-purple-500 selection:text-white">
      
      
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
              <img 
                src={myProfilePic1} 
                alt="Logo" 
                className="h-12 w-auto object-contain" 
              />
        
        <div className="hidden md:flex space-x-8 text-gray-300">
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          <Link to="/courses" className="text-purple-500 font-semibold">Courses</Link>
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

      <div className="max-w-7xl mx-auto px-8 py-12">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
                <h1 className="text-4xl font-bold mb-2">Explore Courses</h1>
                <p className="text-gray-400">Discover the best content to learn and grow.</p>
            </div>
            
            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Search courses..." 
                    className="w-full bg-[#0f1120] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-purple-500 outline-none transition"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {loading ? (
            <div className="text-center py-20 text-gray-500">Loading courses...</div>
        ) : (
            <>
                {filteredCourses.length === 0 ? (
                     <div className="text-center py-20">
                        <h3 className="text-xl text-gray-400">No courses found matching "{searchTerm}"</h3>
                     </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                        {filteredCourses.map(course => {
                            const isEnrolled = enrolledCourses.includes(course._id);

                            return (
                                <div key={course._id} className="bg-[#0f1120] border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition group hover:-translate-y-1 flex flex-col h-full">
                                    <div className="h-48 overflow-hidden relative bg-gray-800">
                                        <img 
                                            src={course.thumbnail || "https://via.placeholder.com/400x300?text=No+Image"} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                                        />
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-medium border border-white/10">
                                            {course.category || 'General'}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold mb-2 truncate">{course.title}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                                            {course.description || "No description available."}
                                        </p>
                                        
                                        <div className="flex justify-between items-center border-t border-gray-800 pt-4 mt-auto">
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <BookOpen size={16} className="text-purple-400" />
                                                <span>{course.lectures.length} Lessons</span>
                                            </div>
                                            <span className="text-green-400 font-bold text-lg">
                                                {course.price === 0 ? 'Free' : `₹${course.price}`}
                                            </span>
                                        </div>
                                        
                                        <div className="mt-6">
                                            {isEnrolled ? (
                                                <Link to={`/student/course/${course._id}`}>
                                                    <button className="w-full bg-green-600/20 text-green-500 py-3 rounded-xl font-bold hover:bg-green-600/30 transition flex items-center justify-center gap-2">
                                                        <CheckCircle size={20} /> Enrolled
                                                    </button>
                                                </Link>
                                            ) : (
                                                <button 
                                                    onClick={() => handlePayment(course._id)}
                                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-purple-900/20"
                                                >
                                                    Buy Now ₹{course.price}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default Courses;