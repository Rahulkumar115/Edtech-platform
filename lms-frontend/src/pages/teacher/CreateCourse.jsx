import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: '', thumbnail: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
      alert('Authentication error. Please log in again.');
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      // Safely ensure instructor context is cleanly passed to database controllers
      const payload = {
        ...formData,
        instructor: user._id || user.id
      };

      await axios.post('https://edtech-platform-backend-e6i3.onrender.com/api/courses', payload, {
        headers: { 'x-auth-token': token }
      });
      
      navigate('/teacher/dashboard');
    } catch (err) {
      console.error('Course Creation Error:', err);
      alert(err.response?.data?.msg || 'Error creating course. Please verify parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-[#0f1120] p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-purple-400">Create New Course Track</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Course Title</label>
                <input 
                    className="w-full bg-[#1e1e2e] border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition"
                    placeholder="e.g., Advanced System Architecture"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Curriculum Overview</label>
                <textarea 
                    className="w-full bg-[#1e1e2e] border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none h-32 transition resize-y"
                    placeholder="Map out modules, learning deliverables, and project outcomes..."
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Enrollment Fee (INR)</label>
                    <input 
                        type="number"
                        min="0"
                        placeholder="e.g., 2499 (Set 0 for Free)"
                        className="w-full bg-[#1e1e2e] border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition"
                        onChange={(e) => setFormData({...formData, price: e.target.value ? Number(e.target.value) : 0})}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Category</label>
                    <input 
                        className="w-full bg-[#1e1e2e] border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition"
                        placeholder="e.g., Full Stack Engineering"
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Cover Thumbnail URL</label>
                <input 
                    type="url"
                    className="w-full bg-[#1e1e2e] border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none transition font-mono text-sm"
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                    required
                />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 py-3.5 rounded-xl font-bold mt-4 transition shadow-lg cursor-pointer active:scale-95"
            >
                {loading ? 'Compiling Artifacts...' : 'Initialize Course Structure'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;