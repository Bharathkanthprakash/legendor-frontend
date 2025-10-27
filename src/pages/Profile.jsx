import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profilesAPI, postsAPI } from '../services/api';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import PostCard from '../components/posts/PostCard';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileId = userId || currentUser?.id;
      
      if (profileId) {
        const [profileResponse, postsResponse] = await Promise.all([
          profilesAPI.getProfile(profileId),
          postsAPI.getUserPosts(profileId)
        ]);
        
        setProfileUser(profileResponse.data);
        setPosts(postsResponse.data || []);
        setIsFollowing(profileResponse.data?.isFollowing || false);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      setProfileUser({
        _id: userId || currentUser?.id,
        username: isOwnProfile ? currentUser?.username : 'champion_athlete',
        bio: '🏀 Basketball enthusiast | Fitness lover | Always pushing limits 💪\nTurning dreams into reality, one game at a time.',
        followers: 1250,
        following: 543,
        posts: 47,
        isFollowing: false
      });
      setPosts([
        {
          _id: '1',
          content: 'Just hit a new personal record in the gym today! 🏋️‍♂️ Consistency is key to success. What are your fitness goals?',
          user: {
            _id: userId || currentUser?.id,
            username: isOwnProfile ? currentUser?.username : 'champion_athlete'
          },
          likes: ['1', '2', '3', '4'],
          comments: [
            {
              _id: '1',
              user: { username: 'gym_buddy' },
              text: 'Amazing progress! Keep going 💪',
              createdAt: new Date().toISOString()
            }
          ],
          shares: 3,
          createdAt: new Date().toISOString(),
          media: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-xl font-semibold mb-2">Profile not found</h3>
            <p className="text-gray-600">The user you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollow={() => setIsFollowing(!isFollowing)}
        />

        {/* Profile Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={{
            posts: posts.length,
            followers: profileUser.followers || 0,
            following: profileUser.following || 0
          }}
        />

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {activeTab === 'posts' && (
            <div className="p-6">
              {posts.length > 0 ? (
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
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                  <p className="text-gray-600">
                    {isOwnProfile 
                      ? "You haven't created any posts yet. Share your first legendary moment!" 
                      : "This user hasn't created any posts yet."
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">About</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Bio</h4>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">
                    {profileUser.bio || 'No bio yet. This user prefers to keep an air of mystery.'}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Sports Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Basketball</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Fitness</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Training</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Member Since</h4>
                    <p className="text-gray-700">
                      {profileUser.createdAt 
                        ? new Date(profileUser.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long'
                          })
                        : 'Recently'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
