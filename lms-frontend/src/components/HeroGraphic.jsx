import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Code } from 'lucide-react';

const HeroGraphic = () => {
  const canvasRef = useRef(null);
  
  // 🚀 1. Initialize state and navigation hooks
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // 🚀 2. Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Navigate to the courses catalog with the search string attached as a URL parameter
    navigate(`/courses?query=${encodeURIComponent(searchTerm.trim())}`);
  };

  // Keep your Canvas Particle network logic exactly as it is
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const setDimensions = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    setDimensions();
    window.addEventListener('resize', setDimensions);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 45 }, () => new Particle());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => p.update());
      particles.forEach(p => p.draw());

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - (distance / 130);
            ctx.strokeStyle = `rgba(147, 51, 234, ${opacity * 0.25})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setDimensions);
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-b from-[#0f1120] via-[#15172b] to-[#020617] pt-24 pb-20 px-6 overflow-hidden border-b border-gray-800/60">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-600/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles size={14} /> Master Full-Stack Engineering
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Architect the Future with <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
            Immersive Learning
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Accelerate your software engineering career with comprehensive MERN masterclasses, automated concept evaluations, and personalized Socratic AI guidance.
        </p>

        {/* 🚀 3. Attach onSubmit handler and wire input values strictly to state */}
        <div className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[#0f1120]/90 border border-gray-800/80 p-2 rounded-2xl shadow-2xl backdrop-blur-md">
            <Search size={20} className="text-gray-500 ml-3 shrink-0" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search concepts (e.g., React hooks, Express auth, MongoDB Atlas)..." 
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none px-2"
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition cursor-pointer shrink-0">
              Explore
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
          <Link to="/courses" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition active:scale-95 cursor-pointer">
            <span>Browse Masterclasses</span>
            <ArrowRight size={16} />
          </Link>
          <a href="#skill-check" className="flex items-center gap-2 bg-[#1e1e2e] hover:bg-white/5 border border-gray-700/80 text-gray-300 px-6 py-3 rounded-xl transition active:scale-95 cursor-pointer">
            <Code size={16} className="text-purple-400" />
            <span>Live Skill Check</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default HeroGraphic;