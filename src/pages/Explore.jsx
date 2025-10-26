import React, { useState, useEffect } from 'react';
import { exploreAPI } from '../services/api';
import PostCard from '../components/posts/PostCard';

const Explore = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [popularSports, setPopularSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    fetchExploreData();
  }, []);

  const fetchExploreData = async () => {
    try {
      const [trendingResponse, usersResponse, sportsResponse] = await Promise.all([
        exploreAPI.getTrendingPosts(),
        exploreAPI.getSuggestedUsers(),
        exploreAPI.getPopularSports()
      ]);

      setTrendingPosts(trendingResponse.data || []);
      setSuggestedUsers(usersResponse.data || []);
      setPopularSports(sportsResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch explore data:', error);
      // Mock data for development
      setTrendingPosts([
        {
          _id: '1',
          content: 'Just witnessed an incredible basketball game! The teamwork was amazing. 🏀',
          user: { username: 'sports_lover', avatar: '' },
          likes: 45,
          comments: 12,
          shares: 8,
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          content: 'Morning workout complete! Feeling energized and ready for the day. 💪',
          user: { username: 'fitness_enthusiast', avatar: '' },
          likes: 32,
          comments: 5,
          shares: 3,
          createdAt: new Date().toISOString()
        }
      ]);
      setSuggestedUsers([
        { _id: '1', username: 'basketball_pro', mutualFriends: 3 },
        { _id: '2', username: 'fitness_guru', mutualFriends: 5 },
        { _id: '3', username: 'sports_analyst', mutualFriends: 2 }
      ]);
      setPopularSports([
        { name: 'Basketball', posts: 1250 },
        { name: 'Football', posts: 980 },
        { name: 'Tennis', posts: 750 },
        { name: 'Swimming', posts: 620 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                </div>
              </div>
              <div className="mt-3 h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore</h1>
        <p className="text-gray-600">Discover new content and connect with sports enthusiasts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {['trending', 'sports', 'videos'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'trending' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Trending Posts</h3>
                  {trendingPosts.length > 0 ? (
                    trendingPosts.map(post => (
                      <PostCard key={post._id} post={post} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔥</div>
                      <p className="text-gray-600">No trending posts at the moment</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sports' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Popular Sports</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {popularSports.map((sport, index) => (
                      <div
                        key={sport.name}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white"
                      >
                        <h4 className="font-semibold text-lg">{sport.name}</h4>
                        <p className="text-blue-100">{sport.posts.toLocaleString()} posts</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎥</div>
                  <h3 className="text-lg font-semibold mb-2">Featured Videos</h3>
                  <p className="text-gray-600">Amazing sports moments coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Suggested Athletes</h3>
            <div className="space-y-4">
              {suggestedUsers.map(user => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-gray-500 text-xs">
                        {user.mutualFriends} mutual connections
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-500 text-sm font-semibold hover:text-blue-600">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sports Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">🏀 Community Basketball</p>
                <p className="text-gray-500 text-xs">Tomorrow, 6:00 PM</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">⚽ Local Football Match</p>
                <p className="text-gray-500 text-xs">Saturday, 3:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
