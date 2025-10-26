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
      // Mock data for development
      setProfileUser({
        _id: userId || currentUser?.id,
        username: isOwnProfile ? currentUser?.username : 'example_user',
        bio: 'Sports enthusiast and fitness lover. Always ready for the next challenge! 🏀💪',
        followers: 1250,
        following: 543,
        posts: 47,
        isFollowing: false
      });
      setPosts([
        {
          _id: '1',
          content: 'Just hit a new personal record in the gym today! 💪 So proud of the progress.',
          user: {
            _id: userId || currentUser?.id,
            username: isOwnProfile ? currentUser?.username : 'example_user'
          },
          likes: ['1', '2', '3'],
          comments: [
            {
              _id: '1',
              user: { username: 'fitness_fan' },
              text: 'Great work! Keep it up!',
              createdAt: new Date().toISOString()
            }
          ],
          shares: 2,
          createdAt: new Date().toISOString(),
          media: []
        },
        {
          _id: '2',
          content: 'Beautiful day for some outdoor basketball! 🏀 Who else is hitting the court?',
          user: {
            _id: userId || currentUser?.id,
            username: isOwnProfile ? currentUser?.username : 'example_user'
          },
          likes: ['1', '2'],
          comments: [],
          shares: 0,
          createdAt: new Date().toISOString(),
          media: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profileUser) return;

    try {
      if (isFollowing) {
        await profilesAPI.unfollow(profileUser._id);
      } else {
        await profilesAPI.follow(profileUser._id);
      }
      setIsFollowing(!isFollowing);
      setProfileUser(prev => ({
        ...prev,
        followers: isFollowing ? prev.followers - 1 : prev.followers + 1
      }));
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  const handlePostUpdate = (postId, updates) => {
    setPosts(prev => prev.map(post => 
      post._id === postId ? { ...post, ...updates } : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold mb-2">Profile not found</h3>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onFollow={handleFollow}
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
      <div className="bg-white rounded-lg shadow-md">
        {activeTab === 'posts' && (
          <div className="p-6">
            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-600">
                  {isOwnProfile 
                    ? "You haven't created any posts yet. Share your first post!" 
                    : "This user hasn't created any posts yet."
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700">{profileUser.bio || 'No bio yet.'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Joined</h4>
                <p className="text-gray-700">
                  {profileUser.createdAt 
                    ? new Date(profileUser.createdAt).toLocaleDateString()
                    : 'Recently'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Photos</h3>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-600">No photos uploaded yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
