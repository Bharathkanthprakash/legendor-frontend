import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { engagementAPI } from '../../services/api';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const [isLiked, setIsLiked] = useState(post.likes?.includes(localStorage.getItem('userId')));
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const { user } = useAuth();

  const handleLike = async () => {
    try {
      if (isLiked) {
        await engagementAPI.unlikePost(post._id);
      } else {
        await engagementAPI.likePost(post._id);
      }
      setIsLiked(!isLiked);
      onUpdate(post._id, {
        ...post,
        likes: isLiked 
          ? post.likes.filter(id => id !== user?.id)
          : [...post.likes, user?.id]
      });
    } catch (error) {
      console.error('Failed to like post:', error);
      setIsLiked(!isLiked);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {post.user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.user?.username || 'User'}</h3>
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        {user?.id === post.user?._id && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed text-lg">{post.content}</p>
      </div>

      {/* Post Stats */}
      <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
        <div className="flex space-x-4">
          <span>{post.likes?.length || 0} likes</span>
          <span>{comments.length} comments</span>
          <span>{post.shares || 0} shares</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex border-t border-b border-gray-200 py-2 mb-4">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl transition-all ${
            isLiked 
              ? 'text-red-500 bg-red-50 hover:bg-red-100' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-xl mr-2">{isLiked ? '❤️' : '🤍'}</span>
          <span className="font-medium">{isLiked ? 'Liked' : 'Like'}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
        >
          <span className="text-xl mr-2">💬</span>
          <span className="font-medium">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all">
          <span className="text-xl mr-2">🔄</span>
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Add Comment */}
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!commentText.trim()) return;
            const newComment = {
              _id: Date.now().toString(),
              user: { _id: user?.id, username: user?.username },
              text: commentText,
              createdAt: new Date().toISOString()
            };
            setComments(prev => [...prev, newComment]);
            setCommentText('');
          }} className="flex space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all transform hover:scale-105"
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment._id} className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                  {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">{comment.user?.username}</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.text || comment.content}</p>
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
