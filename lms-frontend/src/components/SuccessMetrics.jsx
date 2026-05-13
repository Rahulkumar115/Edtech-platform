import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Award, Zap } from 'lucide-react';

const SuccessMetrics = () => {
  // Counters state
  const [students, setStudents] = useState(0);
  const [modules, setModules] = useState(0);
  const [completion, setCompletion] = useState(0);

  // Dynamic counter increment logic
  useEffect(() => {
    const duration = 2000; // Animation runs for 2 seconds
    const interval = 20;
    const steps = duration / interval;

    let stepCount = 0;
    const timer = setInterval(() => {
      stepCount++;
      setStudents(Math.floor((12500 / steps) * stepCount));
      setModules(Math.floor((85 / steps) * stepCount));
      setCompletion(Math.floor((94 / steps) * stepCount));

      if (stepCount >= steps) {
        clearInterval(timer);
        // Lock to exact final parameters safely
        setStudents(12500);
        setModules(85);
        setCompletion(94);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { 
      icon: <Users size={24} className="text-purple-400" />, 
      value: `${students.toLocaleString()}+`, 
      label: "Active Engineers",
      sub: "Enrolled in core tracks"
    },
    { 
      icon: <BookOpen size={24} className="text-blue-400" />, 
      value: `${modules}+`, 
      label: "Technical Modules",
      sub: "Constantly optimized"
    },
    { 
      icon: <Award size={24} className="text-emerald-400" />, 
      value: `${completion}%`, 
      label: "Completion Success",
      sub: "Verified artifact deliveries"
    },
    { 
      icon: <Zap size={24} className="text-yellow-400" />, 
      value: "24/7", 
      label: "AI Socratic Mentor",
      sub: "Instant hints & tracing"
    }
  ];

  return (
    <div className="bg-[#0f1120] border-b border-gray-800/80 py-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#1e1e2e]/50 border border-gray-800/60 p-6 rounded-2xl flex items-start gap-4 transition hover:border-gray-700/80">
            <div className="p-3 bg-[#0f1120] rounded-xl border border-gray-800 shrink-0 shadow-inner">
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-gray-300 mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessMetrics;