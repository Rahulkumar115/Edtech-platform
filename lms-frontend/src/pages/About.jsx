import React, { useState } from 'react';
import { Users, Award, Globe, BookOpen, Github, Linkedin, Code, ExternalLink, Mail, Phone, X, Copy, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import myProfilePic from '../assets/Rahul.jpg';
import myProfilePic1 from '../assets/elogo.jpeg';

const About = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  // State for the "Hire Me" Popup
  const [showHirePopup, setShowHirePopup] = useState(false);
  const [copied, setCopied] = useState(''); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Helper to copy text to clipboard
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000); 
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-purple-500 selection:text-white relative">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        {/* Use the img tag directly with a smaller height */}
        <img 
          src={myProfilePic1} 
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

      {/* --- ABOUT CONTENT --- */}
      <div className="max-w-7xl mx-auto px-8 pt-10 pb-20">
        
        {/* Header Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Empowering the <span className="text-purple-500">Future</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            We are on a mission to democratize education. Our platform connects expert instructors 
            with eager learners from around the globe.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <StatCard icon={<Users className="text-blue-500" />} number="10k+" label="Students" />
            <StatCard icon={<BookOpen className="text-purple-500" />} number="500+" label="Courses" />
            <StatCard icon={<Award className="text-yellow-500" />} number="50+" label="Awards" />
            <StatCard icon={<Globe className="text-green-500" />} number="100+" label="Countries" />
        </div>

        {/* --- DEVELOPER PROFILE SECTION --- */}
        <div className="bg-gradient-to-r from-[#1e1e2e] to-[#11111b] rounded-3xl p-8 md:p-12 border border-gray-800 flex flex-col md:flex-row items-center gap-12 mb-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>

            {/* Profile Image */}
            <div className="shrink-0 relative">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-lg group">
                    <img 
                        src={myProfilePic} 
                        alt="Developer" 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                </div>
                <div className="absolute bottom-2 right-2 bg-green-500 border-4 border-[#1e1e2e] w-6 h-6 rounded-full" title="Available for Work"></div>
            </div>

            {/* Developer Info */}
            <div className="text-center md:text-left z-10 w-full">
                <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-bold mb-4 border border-purple-500/30">
                    MEET THE DEVELOPER
                </div>
                <h2 className="text-4xl font-bold mb-2">Rahul <span className="text-purple-500">Kumar</span></h2>
                <p className="text-xl text-gray-300 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                    <Code size={20} className="text-blue-400" /> Full Stack MERN Developer
                </p>
                <p className="text-gray-400 mb-8 max-w-xl leading-relaxed">
                    I am a Computer Science student at <strong>Oriental University, Indore</strong>. 
                    I specialize in building scalable web applications using React, Node.js, and MongoDB.
                </p>
                
                {/* Social Links & HIRE ME Button */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a href="https://github.com/Rahulkumar115?tab=repositories" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#2b3137] hover:bg-[#333] px-5 py-3 rounded-xl transition font-bold border border-gray-700">
                        <Github size={20} /> GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/rahul-kumar-b88b5723a/" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#006097] px-5 py-3 rounded-xl transition font-bold border border-blue-400/30">
                        <Linkedin size={20} /> LinkedIn
                    </a>
                    
                    {/* HIRE ME TRIGGER */}
                    <button 
                        onClick={() => setShowHirePopup(true)} 
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-purple-900/40 text-white"
                    >
                        Hire Me <ExternalLink size={18} />
                    </button>
                </div>
            </div>
        </div>

        {/* --- OUR STORY SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="text-gray-400 leading-relaxed">
                    Founded in 2024, our platform started with a simple idea: Learning shouldn't be limited 
                    by geography or cost. We built a bridge between passion and knowledge.
                </p>
                <p className="text-gray-400 leading-relaxed">
                    Today, we host thousands of students learning everything from Full Stack Development 
                    to AI and Machine Learning.
                </p>
                <Link to="/courses">
                    <button className="bg-white/5 border border-purple-500/30 hover:bg-purple-500/10 px-6 py-3 rounded-xl font-bold transition mt-4 text-purple-400">
                        Join Our Journey
                    </button>
                </Link>
            </div>
            
            <div className="bg-[#1e1e2e] h-80 rounded-2xl border border-gray-800 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 z-10"></div>
                 <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Team" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
                 />
            </div>
        </div>

        {/* --- WHY CHOOSE US SECTION (KEPT!) --- */}
        <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    title="Expert Instructors" 
                    desc="Learn from industry veterans who have worked at top tech companies like Google and Amazon." 
                />
                <FeatureCard 
                    title="Lifetime Access" 
                    desc="Pay once, learn forever. Get unlimited access to all course updates and community support." 
                />
                <FeatureCard 
                    title="Practical Learning" 
                    desc="Don't just watch videos. Build real-world projects and build a portfolio that gets you hired." 
                />
            </div>
        </div>

      </div>

      {/* --- HIRE ME POPUP MODAL --- */}
      {showHirePopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e1e2e] border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-300">
                
                {/* Close Button */}
                <button 
                    onClick={() => setShowHirePopup(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-purple-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">Let's Work Together!</h2>
                    <p className="text-gray-400 mt-2">I am available for freelance projects and full-time opportunities.</p>
                </div>

                <div className="space-y-4">
                    {/* Phone Block */}
                    <div className="bg-[#0f1120] p-4 rounded-xl border border-gray-800 flex items-center justify-between group hover:border-purple-500/30 transition">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-500/10 p-3 rounded-lg text-green-500">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Phone / WhatsApp</p>
                                <p className="font-mono text-lg">+91 6203374681</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => copyToClipboard('+91 98765 43210', 'phone')}
                            className="text-gray-500 hover:text-white transition"
                        >
                            {copied === 'phone' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                    </div>

                    {/* Email Block */}
                    <div className="bg-[#0f1120] p-4 rounded-xl border border-gray-800 flex items-center justify-between group hover:border-purple-500/30 transition">
                        <div className="flex items-center gap-4">
                            <div className="bg-purple-500/10 p-3 rounded-lg text-purple-500">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Email Address</p>
                                <p className="font-mono text-lg">krahulr111@gmail.com</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => copyToClipboard('rahul@example.com', 'email')}
                            className="text-gray-500 hover:text-white transition"
                        >
                            {copied === 'email' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={() => setShowHirePopup(false)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---
const StatCard = ({ icon, number, label }) => (
    <div className="bg-[#0f1120] p-6 rounded-2xl border border-gray-800 text-center hover:border-purple-500/30 transition hover:-translate-y-1">
        <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-3xl font-bold mb-1">{number}</h3>
        <p className="text-gray-400 text-sm">{label}</p>
    </div>
);

const FeatureCard = ({ title, desc }) => (
    <div className="bg-[#1e1e2e]/50 p-8 rounded-2xl border border-gray-800 hover:bg-[#1e1e2e] transition hover:border-purple-500/30">
        <h3 className="text-xl font-bold mb-3 text-purple-400">{title}</h3>
        <p className="text-gray-400">{desc}</p>
    </div>
);

export default About;