import React, { useEffect, useState } from "react";
import api from "../services/api";
import { FaArrowLeft, FaSave, FaFilePdf, FaBookmark, FaShare } from "react-icons/fa";

const FullContentDisplay = ({ contentId, onBack, onSave }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!contentId) return;

    const fetchFullContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await api.get(`/content/detail/${contentId}`);
        console.log("Full Content Response:", res.data);

        if (res.data && res.data.data) {
          setContent(res.data.data);
        } else {
          console.error("Invalid content format:", res.data);
          setContent(null);
          setError("Invalid content format");
        }
      } catch (err) {
        console.error("Error fetching full content:", err);
        setContent(null);
        setError(err.message || "Failed to fetch content");
      } finally {
        setLoading(false);
      }
    };

    fetchFullContent();
  }, [contentId]);

  const handleSaveContent = () => {
    // Save the content to local storage or your database
    if (!content) return;
    
    const savedItem = {
      id: content._id,
      title: content.title,
      content: content.content,
      date: new Date().toLocaleDateString(),
      type: "Saved Content"
    };
    
    if (onSave) {
      onSave(savedItem);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Fullscreen loading state
  if (loading) return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-white">Loading content...</h2>
      <p className="text-gray-400 mt-2">Please wait while we prepare your content</p>
    </div>
  );
  
  // Fullscreen error state
  if (error) return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Error Loading Content</h2>
      <p className="text-gray-400 mb-6">{error}</p>
      <button 
        onClick={onBack}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <FaArrowLeft className="mr-2" />
        Return to Content List
      </button>
    </div>
  );

  if (!content) return null;

  // Format the creation date if available
  const formattedDate = content.createdAt ? 
    new Date(content.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }) : null;

  // Tag styles
  const tagStyle = "text-xs font-medium px-3 py-1 rounded-full";
  
  // Function to copy content to clipboard
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content.content);
    setSaved(true); // Reuse the saved state for copy notification
    setTimeout(() => setSaved(false), 2000);
  };

  // Success message when content is saved or copied
  const StatusMessage = () => (
    <div className={`fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl transform transition-all duration-300 flex items-center ${saved ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      <span className="font-medium">Action completed successfully!</span>
    </div>
  );

  return (
    <>
      {/* Immersive full-screen overlay with decorative elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-40 overflow-y-auto">
        {/* Decorative background elements */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 -right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-teal-600/5 rounded-full blur-2xl"></div>
        </div>

        {/* Enhanced navigation bar with glass effect */}
        <div className="sticky top-0 bg-gray-900/80 backdrop-blur-lg z-10 border-b border-gray-700/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
            <button 
              onClick={onBack}
              className="text-gray-300 hover:text-white flex items-center group transition-all"
            >
              <div className="bg-gray-800/80 p-2 rounded-full mr-3 group-hover:bg-blue-600/20 transition-colors">
                <FaArrowLeft />
              </div>
              <span className="font-medium">Back to Library</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleCopyContent}
                className="flex items-center px-5 py-2.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full transition-colors text-sm font-medium backdrop-blur-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy</span>
              </button>
              
              <button 
                onClick={handleSaveContent}
                className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-blue-500/30"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Immersive content area with elegant typography */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-3xl p-12 backdrop-blur-sm shadow-2xl">
            {/* Enhanced header section with visual elements */}
            <div className="mb-16 relative">
              {/* Accent line */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              
              <div className="ml-6">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 leading-tight mb-6">{content.title}</h1>
                
      
      
      
                <div className="flex flex-wrap items-center text-gray-400 mb-8">  
                  {content.reading_time && (
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center mr-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span>{content.reading_time} min read</span>
                    </div>
                  )}
                </div>
                
                {/* Tags with enhanced styling */}
                {content.tags && content.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {content.tags.map((tag, index) => (
                      <span key={index} className={`${tagStyle} bg-blue-900/30 text-blue-300 border border-blue-800/50`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Content body with enhanced typography and styling */}
            <div className="prose prose-xl prose-invert max-w-none px-6">
              {/* Format the content paragraphs with different styling based on content */}
              {content.content.split('\n\n').map((paragraph, index) => {
                // Heading detection (starts with #)
                if (paragraph.startsWith('# ')) {
                  return <h2 key={index} className="text-3xl font-bold text-blue-300 mt-10 mb-6">{paragraph.substring(2)}</h2>;
                } 
                // Subheading detection (starts with ##)
                else if (paragraph.startsWith('## ')) {
                  return <h3 key={index} className="text-2xl font-bold text-blue-200 mt-8 mb-4">{paragraph.substring(3)}</h3>;
                }
                // Quote detection (starts with >)
                else if (paragraph.startsWith('> ')) {
                  return (
                    <blockquote key={index} className="border-l-4 border-blue-500 pl-6 py-3 italic text-gray-300 my-8 bg-blue-900/10 rounded-r-lg">
                      {paragraph.substring(2)}
                    </blockquote>
                  );
                }
                // Regular paragraph
                else if (paragraph.trim()) {
                  return <p key={index} className="text-gray-300 mb-6 leading-relaxed">{paragraph}</p>;
                }
                // Empty space
                else {
                  return <div key={index} className="h-4"></div>;
                }
              })}
            </div>
          </div>
          
          {/* Enhanced footer with additional actions */}
          <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <button 
                onClick={onBack}
                className="flex items-center text-gray-400 hover:text-white transition-colors group"
              >
                <div className="p-2 rounded-full bg-gray-800/50 mr-2 group-hover:bg-blue-900/30 transition-colors">
                  <FaArrowLeft />
                </div>
                <span>Return to Collection</span>
              </button>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={handleCopyContent}
                className="flex items-center px-5 py-3 bg-gray-800/80 hover:bg-gray-700 text-white rounded-xl transition-colors shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Content</span>
              </button>
              
              <button 
                onClick={handleSaveContent}
                className="flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
                <FaBookmark className="mr-2" />
                <span>Save to Library</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status message */}
      <StatusMessage />
    </>
  );
};

export default FullContentDisplay;