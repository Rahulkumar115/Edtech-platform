import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: '', thumbnail: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await axios.post('https://edtech-platform-backend-e6i3.onrender.com/api/courses', formData, {
        headers: { 'x-auth-token': token }
      });
      navigate('/teacher/dashboard');
    } catch (err) {
      alert('Error creating course');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-[#0f1120] p-8 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-gray-400 mb-2">Course Title</label>
                <input 
                    className="w-full bg-[#1e1e2e] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                />
            </div>
            
            <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea 
                    className="w-full bg-[#1e1e2e] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none h-32"
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-400 mb-2">Price (Rs.)</label>
                    <input 
                        type="number"
                        className="w-full bg-[#1e1e2e] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">Thumbnail URL</label>
                    <input 
                        className="w-full bg-[#1e1e2e] border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                        placeholder="https://imgur.com/..."
                        onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                    />
                </div>
            </div>

            <button className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold mt-4 transition">
                Create & Continue
            </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;