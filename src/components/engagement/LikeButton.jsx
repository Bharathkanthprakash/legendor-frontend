import { useState } from "react";

const LikeButton = ({ postId, initialLikes = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `https://legendor.in/api/posts/${postId}/like`;
      
      const response = await fetch(url, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLike} 
      disabled={loading}
      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
        isLiked ? "text-red-500 bg-red-50" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="text-lg">{isLiked ? "❤️" : "🤍"}</span>
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;