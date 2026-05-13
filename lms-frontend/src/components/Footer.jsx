import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Twitter, Linkedin, Github, Youtube, Mail, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1120] border-t border-gray-800/80 text-gray-400 pt-16 pb-8 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 blur-xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800/60">
        
        {/* Brand & Value Proposition (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5 inline-block">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-md">
              E
            </div>
            <span className="font-bold text-lg text-white tracking-wide">EdTech Platform</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Empowering the next generation of software engineers with high-fidelity technical courses, real-time interactive modules, and intelligent Socratic AI mentoring.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 bg-[#1e1e2e] hover:bg-purple-600/20 hover:text-purple-400 rounded-xl border border-gray-800 transition">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-[#1e1e2e] hover:bg-purple-600/20 hover:text-purple-400 rounded-xl border border-gray-800 transition">
              <Linkedin size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-[#1e1e2e] hover:bg-purple-600/20 hover:text-purple-400 rounded-xl border border-gray-800 transition">
              <Twitter size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 bg-[#1e1e2e] hover:bg-purple-600/20 hover:text-purple-400 rounded-xl border border-gray-800 transition">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/courses" className="hover:text-purple-400 transition">Course Catalog</Link></li>
            <li><Link to="/student/dashboard" className="hover:text-purple-400 transition">Student Dashboard</Link></li>
            <li><Link to="/" className="hover:text-purple-400 transition">Live Skill Checks</Link></li>
            <li><Link to="/community" className="hover:text-purple-400 transition">Peer Discusssions</Link></li>
          </ul>
        </div>

        {/* Technology Track Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Curriculum</h4>
          <ul className="space-y-2.5 text-sm">
            <li className="hover:text-gray-200 transition cursor-default">MERN Full-Stack</li>
            <li className="hover:text-gray-200 transition cursor-default">React.js Internals</li>
            <li className="hover:text-gray-200 transition cursor-default">Backend & APIs</li>
            <li className="hover:text-gray-200 transition cursor-default">System Architecture</li>
          </ul>
        </div>

        {/* Newsletter Capture Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stay Updated</h4>
          <p className="text-xs text-gray-400">Get notification alerts for upcoming live masterclasses.</p>
          <div className="space-y-2">
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-[#1e1e2e] text-white placeholder-gray-500 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <button className="w-full flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md active:scale-95 cursor-pointer">
              <span>Subscribe</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Deep Footer Sign-off */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© {currentYear} EdTech Platform. All rights reserved.</p>
        <div className="flex items-center gap-1">
          <span>Engineered with</span>
          <Heart size={12} className="text-rose-500 fill-rose-500" />
          <span>for immersive learning</span>
        </div>
        <div className="flex gap-4 text-gray-500">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;