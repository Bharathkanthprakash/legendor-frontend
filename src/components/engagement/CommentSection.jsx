import { useState, useEffect } from "react";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://legendor.in/api/posts/${postId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://legendor.in/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: newComment })
      });
      
      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  return (
    <div className="comment-section">
      <button 
        onClick={() => setShowComments(!showComments)}
        className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
      >
        <span>💬</span>
        <span>Comment</span>
      </button>

      {showComments && (
        <div className="mt-4 p-4 border-t">
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && addComment()}
            />
            <button 
              onClick={addComment}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Post
            </button>
          </div>

          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment._id} className="flex space-x-3">
                <img 
                  src={comment.user.profilePicture || "/default-avatar.png"} 
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="font-semibold text-sm">{comment.user.name}</p>
                    <p className="text-gray-800">{comment.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;