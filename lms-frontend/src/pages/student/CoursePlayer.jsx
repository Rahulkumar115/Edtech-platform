import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import YouTube from 'react-youtube';
import { Play, Lock, Calendar, AlertCircle } from 'lucide-react';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEnrollmentAndLoad = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        // 1. Fetch the User's Enrolled Courses
        const enrolledRes = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/courses/user/enrolled', {
            headers: { 'x-auth-token': token }
        });

        // 2. Check if the current courseId exists in their list
        const hasEnrolled = enrolledRes.data.some(c => c._id === courseId);
        setIsEnrolled(hasEnrolled);

        // 3. Fetch Course Details (Public Info)
        const courseRes = await axios.get(`https://edtech-platform-backend-e6i3.onrender.com/api/courses/${courseId}`);
        setCourse(courseRes.data);

        // If enrolled and lectures exist, play the first one
        if (hasEnrolled && courseRes.data.lectures.length > 0) {
            setCurrentVideo(courseRes.data.lectures[0]);
        }

      } catch (err) {
        console.error("Error loading player data", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkEnrollmentAndLoad();
  }, [courseId]);

  if (loading) return <div className="min-h-screen bg-[#020617] text-white p-10">Checking access...</div>;
  if (!course) return <div className="min-h-screen bg-[#020617] text-white p-10">Course not found</div>;

  // --- ACCESS DENIED SCREEN ---
  // If user is NOT enrolled, show this instead of the player
  if (!isEnrolled) {
      return (
          <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-[#1e1e2e] p-10 rounded-2xl border border-gray-800 max-w-lg w-full">
                  <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock size={40} className="text-red-500" />
                  </div>
                  <h1 className="text-3xl font-bold mb-4">Access Restricted</h1>
                  <p className="text-gray-400 mb-8">
                      You must enroll in <strong>{course.title}</strong> to watch the lectures and access resources.
                  </p>
                  
                  {/* Since we are using Razorpay later, for now this redirects to Courses page or just Enroll logic */}
                  <Link to="/courses">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition w-full">
                        Go to Enrollment Page
                    </button>
                  </Link>
              </div>
          </div>
      );
  }

  // --- ACCESS GRANTED (VIDEO PLAYER) ---
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col md:flex-row h-screen overflow-hidden">
      
      {/* --- LEFT: VIDEO PLAYER AREA --- */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentVideo ? (
            <div>
                <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                    <YouTube 
                        videoId={currentVideo.videoId} 
                        opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1 } }} 
                        className="h-full w-full"
                    />
                </div>
                <h1 className="text-2xl font-bold mt-6">{currentVideo.title}</h1>
                <p className="text-gray-400 mt-2">{course.description}</p>

                {/* --- NOTES SECTION --- */}
                {currentVideo.notes && (
                  <div className="mt-4 p-4 bg-[#1e1e2e] rounded-xl border border-gray-700">
                      <h3 className="font-bold text-gray-300 mb-2">Lecture Notes / Resources:</h3>
                      {currentVideo.notes.startsWith('http') ? (
                          <a href={currentVideo.notes} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-2">
                              📄 Download / View Resource
                          </a>
                      ) : (
                          <p className="text-gray-400 whitespace-pre-wrap">{currentVideo.notes}</p>
                      )}
                  </div>
                )}
            </div>
        ) : (
            <div className="h-full flex items-center justify-center text-gray-500">Select a lecture to start</div>
        )}

        {/* Live Classes Section */}
        {course.liveClasses.length > 0 && (
            <div className="mt-10 p-6 bg-[#0f1120] rounded-xl border border-gray-800">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="text-orange-400" /> Upcoming Live Classes
                </h2>
                <div className="space-y-3">
                    {course.liveClasses.map((cls, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#1e1e2e] p-4 rounded-lg">
                            <div>
                                <h4 className="font-bold text-orange-400">{cls.topic}</h4>
                                <p className="text-sm text-gray-400">{new Date(cls.date).toLocaleDateString()} at {cls.time}</p>
                            </div>
                            <a href={cls.meetingLink} target="_blank" rel="noreferrer">
                                <button className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-bold">
                                    Join
                                </button>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* --- RIGHT: SIDEBAR PLAYLIST --- */}
      <div className="w-full md:w-96 bg-[#0f1120] border-l border-gray-800 flex flex-col h-full">
         <div className="p-6 border-b border-gray-800">
             <h2 className="font-bold text-lg">Course Content</h2>
             <p className="text-sm text-gray-400">{course.lectures.length} Lessons</p>
         </div>
         <div className="overflow-y-auto flex-1 p-4 space-y-2">
             {course.lectures.map((lec, idx) => (
                 <div 
                    key={idx} 
                    onClick={() => setCurrentVideo(lec)}
                    className={`p-4 rounded-xl cursor-pointer transition flex items-center gap-3 ${
                        currentVideo?.videoId === lec.videoId 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-[#1e1e2e] hover:bg-white/5 text-gray-300'
                    }`}
                 >
                     {currentVideo?.videoId === lec.videoId ? <Play size={18} fill="white" /> : <Lock size={16} className="text-gray-500" />}
                     <div className="text-sm font-medium">{lec.title}</div>
                 </div>
             ))}
         </div>
      </div>

    </div>
  );
};

export default CoursePlayer;