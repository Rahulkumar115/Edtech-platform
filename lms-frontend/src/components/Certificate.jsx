import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, Award, CheckCircle, Loader2 } from 'lucide-react';

const Certificate = ({ studentName = "Rahul Kumar", courseTitle = "Full-Stack Web Development", completionDate = new Date() }) => {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate a mock unique verification ID
  const verificationId = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const handleDownloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    setIsDownloading(true);

    try {
      // 1. Capture the DOM node as a high-res canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale increases image quality
        useCORS: true,
        backgroundColor: "#0f1120" // Match certificate dark theme background
      });

      const imgData = canvas.toDataURL('image/png');

      // 2. Initialize PDF in Landscape mode (A4 size)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 3. Add the captured image directly to the PDF layout
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // 4. Trigger file download securely
      pdf.save(`${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-8 p-4">
      
      {/* Action Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 px-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="text-yellow-400" /> Course Completed Successfully!
          </h3>
          <p className="text-xs text-gray-400">Your verified completion certificate is ready.</p>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isDownloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Download High-Res PDF</span>
            </>
          )}
        </button>
      </div>

      {/* --- VISUAL CERTIFICATE TEMPLATE --- */}
      {/* We wrap it in an explicit size container to guarantee crisp captures */}
      <div className="overflow-x-auto w-full flex justify-center pb-4">
        <div 
          ref={certificateRef}
          className="w-[800px] h-[560px] bg-[#0f1120] text-white border-8 border-[#1e1e2e] p-10 relative flex flex-col justify-between overflow-hidden shrink-0 shadow-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Subtle geometric background patterns */}
          <div className="absolute top-0 left-0 w-full h-full border-[4px] border-purple-500/10 pointer-events-none m-2"></div>
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Brand Banner */}
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-md">
                E
              </div>
              <span className="font-bold tracking-wider text-sm text-gray-300">EDTECH PLATFORM</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 block font-mono">VERIFICATION HASH</span>
              <span className="text-xs text-purple-400 font-mono font-bold">{verificationId}</span>
            </div>
          </div>

          {/* Certificate Core Text */}
          <div className="text-center my-auto z-10 px-12">
            <span className="text-xs font-bold tracking-widest text-purple-400 uppercase block mb-3">
              Certificate of Achievement
            </span>
            
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              PROUDLY PRESENTED TO
            </h1>

            {/* Dynamic Student Name */}
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 my-4 border-b border-gray-800 pb-2 inline-block min-w-[300px]">
              {studentName}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto mt-2">
              for successfully mastering the curriculum, completing all advanced technical modules, and demonstrating comprehensive expertise in
            </p>

            {/* Dynamic Course Title */}
            <div className="text-lg font-bold text-gray-100 mt-3">
              {courseTitle}
            </div>
          </div>

          {/* Signatures & Footer Sign-offs */}
          <div className="flex justify-between items-end z-10 pt-4 border-t border-gray-800/60 mt-auto">
            <div>
              <span className="text-xs font-bold text-gray-300 block">Date of Issuance</span>
              <span className="text-xs text-gray-500 block mt-0.5">
                {new Date(completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {/* Center Verified Badge */}
            <div className="flex flex-col items-center">
              <div className="bg-purple-600/20 text-purple-400 p-2 rounded-full border border-purple-500/30 mb-1">
                <CheckCircle size={20} />
              </div>
              <span className="text-[9px] tracking-wider text-gray-400 font-bold uppercase">Official Document</span>
            </div>

            <div className="text-right">
              <div className="font-writing text-purple-400 text-lg select-none italic pr-2">
                Platform Instructor
              </div>
              <span className="w-32 h-[1px] bg-gray-700 block my-1 ml-auto"></span>
              <span className="text-[10px] text-gray-500 block">Authorized Signature</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Certificate;