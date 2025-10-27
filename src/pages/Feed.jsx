import { useState, useEffect, useRef } from 'react';
import { postsAPI, storiesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import StoriesBar from '../components/stories/StoriesBar';
import SuggestedUsers from '../components/sidebar/SuggestedUsers';
import Trends from '../components/sidebar/Trends';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const observerRef = useRef();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [postsResponse, storiesResponse] = await Promise.all([
        postsAPI.getFeed(1, 10),
        storiesAPI.getFeed()
      ]);
      
      setPosts(postsResponse.data || []);
      setStories(storiesResponse.data || []);
      setHasMore(postsResponse.data?.length === 10);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      setPosts(getMockPosts());
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const getMockPosts = () => [
    {
      _id: '1',
      content: 'Just hit a new personal record in the gym today! 🏋️‍♂️ Consistency is key to success. What are your fitness goals?',
      user: {
        _id: '1',
        username: 'fitness_champ',
        avatar: ''
      },
      likes: ['1', '2', '3', '4'],
      comments: [
        {
          _id: '1',
          user: { username: 'gym_buddy', avatar: '' },
          text: 'Amazing progress! Keep going 💪',
          createdAt: new Date().toISOString()
        }
      ],
      shares: 3,
      createdAt: new Date().toISOString(),
      media: []
    },
    {
      _id: '2',
      content: 'Beautiful morning for basketball practice! 🏀 The court was empty and the shots were flowing. #BasketballLife',
      user: {
        _id: '2',
        username: 'hoops_pro',
        avatar: ''
      },
      likes: ['1', '2'],
      comments: [],
      shares: 1,
      createdAt: new Date().toISOString(),
      media: []
    }
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.username}!
                              <p className="text-blue-100">Ready to share your next legendary moment?</p>
            </div>

            {/* Stories */}
            <StoriesBar stories={stories} />

            {/* Create Post */}
            <CreatePost onPostCreated={(newPost) => setPosts(prev => [newPost, ...prev])} />

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onUpdate={(postId, updates) => setPosts(prev => prev.map(p => p._id === postId ? { ...p, ...updates } : p))}
                  onDelete={(postId) => setPosts(prev => prev.filter(p => p._id !== postId))}
                />
              ))}
            </div>

            {/* No posts message */}
            {posts.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-6xl mb-4">🏀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Follow some users or create the first post in your network!
                </p>
                <button 
                  onClick={fetchInitialData}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Refresh Feed
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <SuggestedUsers />
            <Trends />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
