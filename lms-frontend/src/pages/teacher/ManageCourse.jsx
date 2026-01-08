import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Video, Calendar, Plus, Trash2, ExternalLink } from 'lucide-react';

const ManageCourse = () => {
  const { courseId } = useParams(); 
  const [course, setCourse] = useState(null);
  
  // Forms State
  const [videoForm, setVideoForm] = useState({ title: '', videoUrl: '', notes: '' });
  const [liveForm, setLiveForm] = useState({ topic: '', date: '', time: '', meetingLink: '' });

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to load course");
    }
  };

  // Helper: Extract YouTube ID from full URL
  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    const videoId = extractVideoId(videoForm.videoUrl);
    
    if (!videoId) return alert("Invalid YouTube URL");

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/${courseId}/lectures`, 
        { title: videoForm.title, videoId, notes: videoForm.notes }, 
        { headers: { 'x-auth-token': token } }
      );
      setVideoForm({ title: '', videoUrl: '', notes: '' }); // Reset form
      fetchCourse(); // Refresh list
    } catch (err) {
      alert("Error adding video");
    }
  };

  const handleAddLiveClass = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/${courseId}/live`, 
        liveForm, 
        { headers: { 'x-auth-token': token } }
      );
      setLiveForm({ topic: '', date: '', time: '', meetingLink: '' });
      fetchCourse();
    } catch (err) {
      alert("Error scheduling class");
    }
  };

  if (!course) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Course Header */}
        <div className="bg-[#0f1120] p-8 rounded-2xl border border-gray-800 mb-10 flex gap-6">
           <img src={course.thumbnail} className="w-40 h-40 object-cover rounded-xl bg-gray-800" alt="Thumb" />
           <div>
             <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
             <p className="text-gray-400">{course.description}</p>
             <div className="mt-4 flex gap-4">
               <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm">
                 {course.category || 'Programming'}
               </span>
               <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                 ₹{course.price}
               </span>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* --- LEFT: LECTURE MANAGEMENT --- */}
            <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Video className="text-blue-400" /> Course Lectures
                </h2>
                
                {/* Add Video Form */}
                <form onSubmit={handleAddVideo} className="bg-[#1e1e2e]/50 p-6 rounded-xl border border-gray-700 mb-6">
                    <input 
                        className="w-full bg-[#11111b] border border-gray-700 rounded-lg p-3 mb-3 text-white" 
                        placeholder="Lecture Title (e.g., Intro to React)"
                        value={videoForm.title}
                        onChange={e => setVideoForm({...videoForm, title: e.target.value})}
                        required 
                    />
                    <input 
                        className="w-full bg-[#11111b] border border-gray-700 rounded-lg p-3 mb-3 text-white" 
                        placeholder="Paste YouTube URL here..."
                        value={videoForm.videoUrl}
                        onChange={e => setVideoForm({...videoForm, videoUrl: e.target.value})}
                        required 
                    />
                          {/* ... inside the form ... */}
                          <textarea
                              className="w-full bg-[#11111b] border border-gray-700 rounded-lg p-3 mb-3 text-white h-24"
                              placeholder="Lecture Notes or Google Drive Link..."
                              value={videoForm.notes}
                              onChange={e => setVideoForm({ ...videoForm, notes: e.target.value })}
                          />

                    <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-bold">
                        Add Lecture
                    </button>
                </form>

                {/* List of Videos */}
                <div className="space-y-3">
                    {course.lectures.map((lec, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#0f1120] p-4 rounded-lg border border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">{idx + 1}</div>
                                <span>{lec.title}</span>
                            </div>
                            <a href={`https://youtu.be/${lec.videoId}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                                <ExternalLink size={18} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- RIGHT: LIVE CLASS SCHEDULE --- */}
            <div>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Calendar className="text-orange-400" /> Live Classes
                </h2>
                
                {/* Add Live Class Form */}
                <form onSubmit={handleAddLiveClass} className="bg-[#1e1e2e]/50 p-6 rounded-xl border border-gray-700 mb-6">
                    <input 
                        className="w-full bg-[#11111b] border border-gray-700 rounded-lg p-3 mb-3 text-white" 
                        placeholder="Topic (e.g., Doubt Clearing)"
                        value={liveForm.topic}
                        onChange={e => setLiveForm({...liveForm, topic: e.target.value})}
                        required 
                    />
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <input type="date" className="bg-[#11111b] border border-gray-700 rounded-lg p-3 text-white" 
                            onChange={e => setLiveForm({...liveForm, date: e.target.value})} required 
                        />
                        <input type="time" className="bg-[#11111b] border border-gray-700 rounded-lg p-3 text-white" 
                             onChange={e => setLiveForm({...liveForm, time: e.target.value})} required 
                        />
                    </div>
                    <input 
                        className="w-full bg-[#11111b] border border-gray-700 rounded-lg p-3 mb-3 text-white" 
                        placeholder="Paste Zoom/Meet Link"
                        value={liveForm.meetingLink}
                        onChange={e => setLiveForm({...liveForm, meetingLink: e.target.value})}
                        required 
                    />
                    <button className="w-full bg-orange-600 hover:bg-orange-700 py-2 rounded-lg font-bold">
                        Schedule Live Class
                    </button>
                </form>

                {/* List of Live Classes */}
                <div className="space-y-3">
                    {course.liveClasses.map((cls, idx) => (
                        <div key={idx} className="bg-[#0f1120] p-4 rounded-lg border border-gray-800">
                             <h4 className="font-bold text-orange-400">{cls.topic}</h4>
                             <p className="text-sm text-gray-400">
                                {new Date(cls.date).toLocaleDateString()} at {cls.time}
                             </p>
                             <a href={cls.meetingLink} target="_blank" className="text-blue-400 text-sm hover:underline mt-1 block">
                                Join Meeting
                             </a>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ManageCourse;