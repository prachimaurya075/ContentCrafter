import React, { useEffect, useState } from "react";
import api from "../services/api";

const ContentDisplay = ({ genreId, onContentSelect }) => {
  const [contentPreviews, setContentPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!genreId) return;

    const fetchContentPreviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await api.get(`/content/${genreId}`);
        console.log("API Response:", res.data); 

        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          setContentPreviews(res.data.data);
        } else {
          console.error("Invalid data format:", res.data);
          setContentPreviews([]); // Fix: Changed from setContents to setContentPreviews
          setError("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setContentPreviews([]); // Fix: Changed from setContents to setContentPreviews
        setError(err.message || "Failed to fetch content");
      } finally {
        setLoading(false);
      }
    };

    fetchContentPreviews();
  }, [genreId]);

  if (!onContentSelect) {
    console.warn("ContentDisplay: onContentSelect prop is missing");
    onContentSelect = (id) => console.log("Content selected:", id);
  }

  if (loading) return <p className="text-center text-blue-400">Loading content...</p>;
  if (error) return <p className="text-center text-red-400">Error: {error}</p>;

  return (
    <div>
      {contentPreviews.length === 0 ? (
        <p className="text-center text-gray-400">No content available for this genre.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentPreviews.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 p-5 h-full rounded-xl shadow-md border border-gray-700 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-gray-300 mb-4 line-clamp-3">{item.preview || (item.content && item.content.substring(0, 150) + "...")}</p>
              <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                </span>
                <button 
                  onClick={() => onContentSelect(item._id)}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center group transition-colors cursor-pointer"
                >
                  <span>Read Full Content</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;
