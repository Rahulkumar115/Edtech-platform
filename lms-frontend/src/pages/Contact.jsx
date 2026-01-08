import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import myProfilePic from '../assets/elogo.jpeg';

const Contact = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }; 

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // 2. Send data to backend
    await axios.post('https://edtech-platform-backend-e6i3.onrender.com/api/contact', formData);
    
    // 3. Success Feedback
    alert("Thank you! Your message has been sent successfully.");
    setFormData({ name: '', email: '', message: '' }); 
    
  } catch (err) {
    console.error("Error sending message:", err);
    alert("Failed to send message. Please try again.");
  }
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

      {/* --- CONTACT CONTENT --- */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in <span className="text-purple-500">Touch</span></h1>
          <p className="text-gray-400 text-lg">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left: Contact Info */}
          <div className="space-y-8">
             <div className="bg-[#1e1e2e] p-8 rounded-2xl border border-gray-800">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="bg-purple-500/10 p-3 rounded-lg"><Mail className="text-purple-500" /></div>
                        <div>
                            <p className="text-sm text-gray-500">Email Us</p>
                            <p className="font-medium">krahulr111@gmail.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="bg-purple-500/10 p-3 rounded-lg"><Phone className="text-purple-500" /></div>
                        <div>
                            <p className="text-sm text-gray-500">Call Us</p>
                            <p className="font-medium">+91 6203374681</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="bg-purple-500/10 p-3 rounded-lg"><MapPin className="text-purple-500" /></div>
                        <div>
                            <p className="text-sm text-gray-500">Visit Us</p>
                            <p className="font-medium">Indore, Madhya Pradesh, India</p>
                        </div>
                    </div>
                </div>
             </div>

             {/* Map Placeholder */}
             <div className="bg-[#1e1e2e] h-64 rounded-2xl border border-gray-800 overflow-hidden relative group">
                {/* Replace src with a real Google Maps Embed link if you want */}
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.081033282276!2d75.875!3d22.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96e9438d9005b6c8!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000" 
                    width="100%" 
                    height="100%" 
                    style={{border:0, filter: 'invert(90%) hue-rotate(180deg)'}} 
                    allowFullScreen="" 
                    loading="lazy"
                    title="Map"
                ></iframe>
             </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-[#0f1120] p-8 rounded-3xl border border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-400 mb-2 text-sm">Your Name</label>
                    <input 
                        type="text" 
                        required
                        className="w-full bg-[#1e1e2e] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 text-sm">Your Email</label>
                    <input 
                        type="email" 
                        required
                        className="w-full bg-[#1e1e2e] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 text-sm">Message</label>
                    <textarea 
                        required
                        rows="4"
                        className="w-full bg-[#1e1e2e] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition resize-none"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                </div>
                
                <button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
                >
                    <Send size={20} /> Send Message
                </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;