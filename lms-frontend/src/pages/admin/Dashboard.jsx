import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Users, BookOpen, DollarSign, MessageSquare, Mail, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  
  const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, totalEarnings: 0 });
  const [courses, setCourses] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const token = localStorage.getItem('token');

  // Fetch Data
  useEffect(() => {
    fetchStatsAndCourses();
    fetchMessages();
  }, []);

  const fetchStatsAndCourses = async () => {
    try {
      const courseRes = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/courses');
      setCourses(courseRes.data);
      setStats({
        totalStudents: 120, 
        totalCourses: courseRes.data.length,
        totalEarnings: 45000
      });
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async () => {
    try {
        const res = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/contact', {
            headers: { 'x-auth-token': token }
        });
        setMessages(res.data);
    } catch (err) { console.error("Error fetching messages", err); }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`https://edtech-platform-backend-e6i3.onrender.com/api/courses/${courseId}`, {
        headers: { 'x-auth-token': token }
      });
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (err) { alert("Error deleting course"); }
  };

  // Delete Message
  const handleDeleteMessage = async (msgId) => {
    if(!window.confirm("Delete this message?")) return;
    try {
        await axios.delete(`https://edtech-platform-backend-e6i3.onrender.com/api/contact/${msgId}`, {
            headers: { 'x-auth-token': token }
        });
        setMessages(messages.filter(m => m._id !== msgId));
    } catch (err) { alert("Error deleting message"); }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Users className="text-blue-500" />} title="Total Students" value={stats.totalStudents} />
          <StatCard icon={<BookOpen className="text-purple-500" />} title="Total Courses" value={stats.totalCourses} />
          <StatCard icon={<DollarSign className="text-green-500" />} title="Total Earnings" value={`₹${stats.totalEarnings}`} />
        </div>

        {/* TABS Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 pb-4">
            <button 
                onClick={() => setActiveTab('courses')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition font-medium ${activeTab === 'courses' ? 'bg-purple-600 text-white' : 'bg-[#1e1e2e] text-gray-400 hover:text-white'}`}
            >
                <BookOpen size={18} /> Manage Courses
            </button>
            <button 
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition font-medium ${activeTab === 'messages' ? 'bg-purple-600 text-white' : 'bg-[#1e1e2e] text-gray-400 hover:text-white'}`}
            >
                <MessageSquare size={18} /> Inbox ({messages.length})
            </button>
        </div>
        
        {/* 1. COURSES TAB */}
        {activeTab === 'courses' && (
            <div className="bg-[#1e1e2e] rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-bold mb-6">Course Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="p-4">Title</th>
                                <th className="p-4">Instructor</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course._id} className="border-b border-gray-700/50 hover:bg-white/5 transition">
                                    <td className="p-4">{course.title}</td>
                                    <td className="p-4 text-gray-400">{course.instructor?.name || 'Unknown'}</td>
                                    <td className="p-4 font-mono text-green-400">₹{course.price}</td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => handleDeleteCourse(course._id)}
                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {courses.length === 0 && <p className="text-center text-gray-500 py-8">No courses found.</p>}
                </div>
            </div>
        )}

        {/* 2. MESSAGES TAB (New!) */}
        {activeTab === 'messages' && (
            <div className="grid grid-cols-1 gap-4">
                {messages.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-[#1e1e2e] rounded-xl">
                        No new messages.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id} className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between gap-6 hover:border-purple-500/30 transition">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                                    <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20">
                                        {new Date(msg.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                    <Mail size={14} /> {msg.email}
                                </div>
                                <p className="text-gray-300 bg-black/20 p-4 rounded-lg border border-white/5">
                                    {msg.message}
                                </p>
                            </div>
                            <div className="flex items-start">
                                <button 
                                    onClick={() => handleDeleteMessage(msg._id)}
                                    className="text-red-400 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm border border-red-500/20"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}

      </div>
    </div>
  );
};

// Helper Component
const StatCard = ({ icon, title, value }) => (
  <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 flex items-center gap-4">
    <div className="bg-white/5 p-3 rounded-lg">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;