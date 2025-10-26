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
      // Fallback to mock data if API fails
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
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <form className="flex-1" onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-2 text-gray-500">
              <button type="button" className="p-2 hover:bg-gray-100 rounded-lg">
                📷
              </button>
              <button type="button" className="p-2 hover:bg-gray-100 rounded-lg">
                🎥
              </button>
              <button type="button" className="p-2 hover:bg-gray-100 rounded-lg">
                😊
              </button>
            </div>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
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
