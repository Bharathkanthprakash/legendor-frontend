import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { postsAPI } from '../../services/api';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await postsAPI.createPost({ content });
      onPostCreated(response.data);
      setContent('');
    } catch (error) {
      console.error('Failed to create post:', error);
      const mockPost = {
        _id: Date.now().toString(),
        content,
        user: {
          _id: user?.id,
          username: user?.username
        },
        likes: [],
        comments: [],
        shares: 0,
        createdAt: new Date().toISOString(),
        media: []
      };
      onPostCreated(mockPost);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <form className="flex-1" onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your legendary moment..."
            className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows="3"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-xl">📷</span>
              </button>
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-xl">🎥</span>
              </button>
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-xl">😊</span>
              </button>
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-xl">🏀</span>
              </button>
            </div>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
