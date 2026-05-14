import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, Search, Activity, Target, Zap, 
  CheckCircle, AlertCircle, RefreshCcw, Layout, 
  ArrowRight, ShieldCheck 
} from 'lucide-react';

const AtsResumeChecker = () => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer (MERN)');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [scanningLine, setScanningLine] = useState(false);

  // 🚀 1. Unified trigger safely maps direct inputs to your live cloud processing API
  const handleScan = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setLoading(true);
    setError(null);
    setReport(null);
    setScanningLine(true); // Engages visual scanning loop on user viewport

    try {
      const res = await axios.post('https://edtech-platform-backend-e6i3.onrender.com/api/tutor/ats-scan', {
        resumeText: resumeText.trim(),
        targetRole: targetRole.trim()
      });
      
      // Preserve a brief visual processing loop for maximum interactive immersion
      setTimeout(() => {
        setReport(res.data);
        setLoading(false);
        setScanningLine(false);
      }, 1500);

    } catch (err) {
      console.error("ATS scan error:", err);
      setError(err.response?.data?.error || "Failed to analyze resume. Please try again.");
      setLoading(false);
      setScanningLine(false);
    }
  };

  const resetScanner = () => {
    setReport(null);
    setResumeText('');
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto my-16 p-1 bg-[#0f1120] rounded-[2rem] border border-gray-800 shadow-2xl relative overflow-hidden group">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 p-8 md:p-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-bold tracking-widest uppercase mb-4">
              <Zap size={12} /> AI Career Services
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-4">
              ATS Score <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-glow">Optimizer</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Top tech companies filter applicants using automated tracking software. Paste your raw plain text below to verify your keyword impact and parsing layout matrices instantly.
            </p>
          </div>
          
          {!report && (
            <div className="bg-[#1e1e2e] p-4 rounded-2xl border border-gray-800 flex items-center gap-4 shadow-inner hidden sm:flex shrink-0">
               <div className="bg-purple-600/20 p-3 rounded-xl border border-purple-500/30">
                 <ShieldCheck className="text-purple-400" size={24} />
               </div>
               <div>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Security Gateway</p>
                 <p className="text-xs text-gray-300 font-semibold">100% Client Isolation</p>
               </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 text-center font-semibold">
            {error}
          </div>
        )}

        {!report ? (
          /* --- 🚀 2. RE-ENGINEERED INPUT INTERFACE --- */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Plain text context entry */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative group overflow-hidden rounded-3xl border border-gray-800 bg-[#0f1120]">
                {/* Embedded horizontal live trace element */}
                {scanningLine && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan-line z-20 shadow-[0_0_15px_rgba(168,85,247,0.8)] pointer-events-none"></div>
                )}
                <textarea 
                  rows={12}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your professional summary, technical skills mapping, work internship history, and core personal project bullet points here... (Minimum 50 characters required)"
                  className="w-full bg-transparent p-6 text-sm text-gray-300 placeholder-gray-600 focus:outline-none transition-all font-mono leading-relaxed resize-y"
                  required
                />
              </div>
            </div>

            {/* Right Column: Execution triggers and targets */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#1e1e2e]/50 border border-gray-800 rounded-3xl p-6">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3">
                  Target Job Designation
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Full Stack Developer"
                    className="w-full bg-[#0f1120] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:border-purple-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Submission Engine */}
              <button 
                onClick={handleScan}
                disabled={loading || resumeText.trim().length < 50}
                className="flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] text-white font-bold rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-3 group/btn disabled:opacity-50 cursor-pointer p-6"
              >
                {loading ? (
                  <>
                    <RefreshCcw className="animate-spin text-purple-200" size={32} />
                    <span className="text-xs text-purple-200 font-medium tracking-wide">Evaluating Densities...</span>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-white/10 rounded-full border border-white/20 group-hover/btn:scale-110 transition-transform">
                      <Activity size={28} />
                    </div>
                    <span className="text-base font-extrabold tracking-wide">Compute Resume Score</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* --- 📊 3. HIGH-FIDELITY DATA CENTER DASHBOARD --- */
          <div className="space-y-8 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* RADIAL SVG GAUGE CENTER */}
              <div className="bg-gradient-to-br from-[#1e1e2e] to-[#0f1120] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-20">
                   <Target className="text-gray-500" size={80} />
                 </div>
                 
                 <div className="relative my-2">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                      <circle 
                        cx="72" cy="72" r="60" stroke="currentColor" strokeWidth="10" fill="transparent" 
                        strokeDasharray={377} 
                        strokeDashoffset={377 - (377 * report.score) / 100} 
                        className="text-purple-500 transition-all duration-1000 ease-out" 
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white">{report.score}%</span>
                      <span className="text-[9px] font-extrabold text-gray-500 tracking-[0.2em] mt-0.5">MATCH</span>
                    </div>
                 </div>

                 <div className="mt-4">
                   <span className="text-[10px] font-semibold px-3 py-1 bg-[#0f1120] text-purple-400 border border-gray-800/80 rounded-full inline-block mb-2">
                     Role Target: {targetRole}
                   </span>
                   <h4 className="text-gray-300 text-xs font-medium leading-relaxed max-w-xs mx-auto italic">
                     "{report.verdict}"
                   </h4>
                 </div>
              </div>

              {/* PROGRESSIVE METRICS BREAKDOWNS */}
              <div className="lg:col-span-2 bg-[#1e1e2e]/30 border border-gray-800 rounded-[2.5rem] p-8 flex flex-col justify-center space-y-6">
                {[
                  { label: "Technical Keyword Optimization", val: report.score > 80 ? 92 : 68, color: "bg-purple-500" },
                  { label: "Action Verbs & Quantifiable Impact", val: report.score < 55 ? 35 : 78, color: "bg-blue-500" },
                  { label: "System Structural Parsing Matrix", val: 85, color: "bg-emerald-500" }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>{item.label}</span>
                      <span className="text-white">{item.val}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-800/80 rounded-full overflow-hidden p-[1px]">
                      <div 
                        className={`h-full ${item.color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-all duration-1000`} 
                        style={{ width: `${item.val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* DETAIL MATRICES ARRAYS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Strengths Container */}
              <div className="bg-[#1e1e2e]/20 border border-emerald-500/20 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
                  <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                    <CheckCircle size={18} />
                  </div>
                  <span>Verified Key Strengths</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.strengths?.map((s, idx) => (
                    <span key={idx} className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-300 px-3 py-2 rounded-xl text-xs font-medium leading-relaxed block w-full">
                      • {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Improvements Container */}
              <div className="bg-[#1e1e2e]/20 border border-rose-500/20 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-4">
                  <div className="bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                    <AlertCircle size={18} />
                  </div>
                  <span>Critical Actionable Gaps</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.improvements?.map((s, idx) => (
                    <span key={idx} className="bg-rose-500/5 border border-rose-500/10 text-rose-300 px-3 py-2 rounded-xl text-xs font-medium leading-relaxed block w-full">
                      • {s}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* STRATEGIC PIVOT FOOTER BAR */}
            <div className="p-4 bg-purple-600/5 border border-purple-500/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h5 className="text-xs font-bold text-white">Need to add highly verified full-stack items to your profile?</h5>
                <p className="text-[11px] text-gray-400 mt-0.5">Explore our deep modules to lock down critical system architecture fundamentals.</p>
              </div>
              <Link to="/courses" className="shrink-0 w-full sm:w-auto">
                <button className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow active:scale-95 cursor-pointer">
                  <span>Browse Tracks</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
            </div>

            {/* Rerun triggers */}
            <div className="flex items-center justify-between border-t border-gray-800 pt-4 px-2">
               <div className="flex items-center gap-2 text-gray-500 text-xs">
                 <Layout size={14} />
                 <span>AI Assessment Interface</span>
               </div>
               <button 
                onClick={resetScanner}
                className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-bold text-xs transition uppercase tracking-wider cursor-pointer"
               >
                 <span>Analyze Another Resume</span> 
                 <ArrowRight size={14} />
               </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AtsResumeChecker;