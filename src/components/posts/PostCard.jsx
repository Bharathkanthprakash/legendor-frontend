import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, you'd call the API here
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      _id: Date.now().toString(),
      user: {
        _id: user?.id,
        username: user?.username
      },
      content: commentText,
      createdAt: new Date().toISOString()
    };

    const updatedPost = {
      ...post,
      comments: [...post.comments, newComment]
    };

    onUpdate(post._id, updatedPost);
    setCommentText('');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {post.user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.user?.username || 'User'}</h3>
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {user?.id === post.user?._id && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      </div>

      {/* Post Media - Placeholder for future implementation */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-500">
            📷 Media Content
          </div>
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
        <div className="flex space-x-4">
          <span>{post.likes?.length || 0} likes</span>
          <span>{post.comments?.length || 0} comments</span>
          <span>{post.shares || 0} shares</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex border-t border-b border-gray-200 py-2 mb-4">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${
            isLiked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          ❤️ Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          💬 Comment
        </button>
        <button className="flex-1 flex items-center justify-center py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          🔄 Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="flex space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50"
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.map(comment => (
              <div key={comment._id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex-shrink-0"></div>
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm">{comment.user?.username}</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
