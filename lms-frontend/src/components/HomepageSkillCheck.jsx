import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Award, CheckCircle, XCircle, Sparkles, ArrowRight, RefreshCw, Bot } from 'lucide-react';

const HomepageSkillCheck = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch live questions generated on the fly by Gemini
  const fetchLiveAIQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);

    try {
      // Pointing to your local backend for testing
      const res = await axios.get('https://edtech-platform-backend-e6i3.onrender.com/api/tutor/live-quiz');
      setQuizQuestions(res.data);
    } catch (err) {
      console.error("Error fetching AI quiz:", err);
      setError("⚠️ AI Assessor connection timed out. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger AI generation on component mount
  useEffect(() => {
    fetchLiveAIQuiz();
  }, []);

  const handleSelectOption = (qIndex, oIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: oIndex });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) calculatedScore++;
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto my-16 p-8 bg-gradient-to-b from-[#1e1e2e] to-[#0f1120] rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Component Header */}
      <div className="text-center max-w-xl mx-auto mb-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold mb-4">
          <Sparkles size={14} /> Live AI-Powered Assessment
        </div>
        <h2 className="text-3xl font-bold text-white">Test Your Full-Stack Knowledge</h2>
        <p className="text-sm text-gray-400 mt-2">
          Questions dynamically designed on the fly by Google Gemini to challenge your grasp of coding fundamentals.
        </p>
      </div>

      {/* State 1: Loading AI Data */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
            <Bot size={24} className="absolute inset-0 m-auto text-purple-400 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-gray-200">AI is curating fresh questions...</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">Connecting with live models to compile personalized web development trivia.</p>
        </div>
      )}

      {/* State 2: Error handling fallback */}
      {error && !isLoading && (
        <div className="py-8 text-center">
          <p className="text-sm text-rose-400 mb-4">{error}</p>
          <button 
            onClick={fetchLiveAIQuiz} 
            className="px-4 py-2 bg-[#1e1e2e] hover:bg-white/5 border border-gray-700 rounded-xl text-xs text-white transition cursor-pointer"
          >
            Try Connection Again
          </button>
        </div>
      )}

      {/* State 3: Render AI Questions */}
      {!isLoading && !error && quizQuestions.length > 0 && (
        <>
          <div className="space-y-6 mb-8">
            {quizQuestions.map((q, qIndex) => {
              const isCorrect = selectedAnswers[qIndex] === q.correctAnswerIndex;
              return (
                <div key={qIndex} className="bg-[#0f1120]/80 p-5 rounded-2xl border border-gray-800/80">
                  <h3 className="font-semibold text-sm text-gray-200 mb-4 flex items-start gap-2">
                    <span className="text-purple-400 shrink-0">{qIndex + 1}.</span> 
                    <span>{q.questionText}</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, oIndex) => {
                      const isSelected = selectedAnswers[qIndex] === oIndex;
                      const isCorrectOption = q.correctAnswerIndex === oIndex;

                      let style = "bg-[#1e1e2e] border-gray-800 text-gray-400 hover:border-gray-700";
                      if (isSelected) style = "bg-purple-600/20 border-purple-500 text-purple-200";
                      
                      if (isSubmitted) {
                        if (isCorrectOption) {
                          style = "bg-emerald-500/20 border-emerald-500 text-emerald-300";
                        } else if (isSelected && !isCorrect) {
                          style = "bg-rose-500/20 border-rose-500 text-rose-300";
                        } else {
                          style = "bg-[#1e1e2e]/40 border-gray-800/40 text-gray-600 opacity-40";
                        }
                      }

                      return (
                        <button
                          key={oIndex}
                          onClick={() => handleSelectOption(qIndex, oIndex)}
                          disabled={isSubmitted}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition flex items-center justify-between cursor-pointer disabled:cursor-default ${style}`}
                        >
                          <span className="font-medium">{option}</span>
                          {isSubmitted && isCorrectOption && <CheckCircle size={16} className="text-emerald-400 shrink-0" />}
                          {isSubmitted && isSelected && !isCorrect && <XCircle size={16} className="text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Explanation string sent directly from Gemini */}
                  {isSubmitted && q.explanation && (
                    <div className="mt-3 px-3 py-2 bg-purple-500/5 rounded-xl border border-purple-500/10 text-xs text-purple-300">
                      <span className="font-bold">AI Insight:</span> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {isSubmitted ? (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-purple-600/5 p-4 rounded-2xl border border-purple-500/10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400 shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      You scored {score} out of {quizQuestions.length}!
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {score === 3 ? "Flawless execution! You clearly understand full-stack architecture." : "Solid baseline! Time to review core frameworks."}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  {/* Button to make another live backend API call for completely new questions */}
                  <button 
                    onClick={fetchLiveAIQuiz}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-700 hover:bg-white/5 rounded-xl text-gray-300 text-xs font-semibold transition cursor-pointer"
                  >
                    <RefreshCw size={14} /> Generate Fresh AI Quiz
                  </button>
                  <Link to="/courses" className="flex-1 sm:flex-initial">
                    <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg active:scale-95 cursor-pointer">
                      <span>Browse Catalog</span>
                      <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between">
                <button 
                  onClick={fetchLiveAIQuiz}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-400 transition cursor-pointer"
                  title="Ask AI to design a different set"
                >
                  <RefreshCw size={12} /> Regenerate Live Questions
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl font-bold text-sm transition shadow-md active:scale-95 cursor-pointer"
                >
                  Verify Answers
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HomepageSkillCheck;