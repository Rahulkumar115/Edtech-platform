import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send Register Request
      await axios.post('https://edtech-platform-backend-e6i3.onrender.com/api/auth/register', formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error registering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
       {/* (Keep the same background/design as Login) */}
       <div className="bg-[#1e1e2e]/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input */}
            <input 
              className="w-full bg-[#11111b] border border-gray-700 rounded-lg p-3 text-white" 
              placeholder="Full Name" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            
            {/* Email Input */}
            <input 
              className="w-full bg-[#11111b] border border-gray-700 rounded-lg p-3 text-white" 
              placeholder="Email" 
              type="email"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />

            {/* Password Input */}
            <input 
              className="w-full bg-[#11111b] border border-gray-700 rounded-lg p-3 text-white" 
              placeholder="Password" 
              type="password"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />

            {/* Role Selection */}
            <div className="flex gap-4">
                <label className="text-white flex items-center gap-2">
                    <input type="radio" name="role" value="student" defaultChecked onChange={(e) => setFormData({...formData, role: e.target.value})} /> Student
                </label>
                <label className="text-white flex items-center gap-2">
                    <input type="radio" name="role" value="teacher" onChange={(e) => setFormData({...formData, role: e.target.value})} /> Teacher
                </label>
            </div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition">
                {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-400">
            Already have an account? <Link to="/login" className="text-purple-400">Login</Link>
          </p>
       </div>
    </div>
  );
};

export default Signup;