import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { profilesAPI, postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import PostGrid from '../components/profile/PostGrid';
import StatsCard from '../components/profile/StatsCard';

const Profile = () => {
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const { userId } = useParams();

  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileId = userId || currentUser.id;
      
      const [profileResponse, postsResponse] = await Promise.all([
        profilesAPI.getProfile(profileId),
        postsAPI.getUserPosts(profileId)
      ]);

      setProfileUser(profileResponse.data);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      // Toggle follow/unfollow
      if (profileUser.isFollowing) {
        await profilesAPI.unfollow(profileUser._id);
        setProfileUser(prev => ({
          ...prev,
          isFollowing: false,
          followerCount: prev.followerCount - 1
        }));
      } else {
        await profilesAPI.follow(profileUser._id);
        setProfileUser(prev => ({
          ...prev,
          isFollowing: true,
          followerCount: prev.followerCount + 1
        }));
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  const handleProfileUpdate = (updates) => {
    setProfileUser(prev => ({ ...prev, ...updates }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
          <div className="flex space-x-4 mb-6">
            <div className="w-32 h-32 bg-gray-300 rounded-full -mt-16 border-4 border-white"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-gray-600">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Profile Header */}
      <ProfileHeader
        user={profileUser}
        isOwnProfile={isOwnProfile}
        onFollow={handleFollow}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 px-4">
        <StatsCard
          label="Posts"
          value={profileUser.postCount}
          icon="📝"
        />
        <StatsCard
          label="Followers"
          value={profileUser.followerCount}
          icon="👥"
        />
        <StatsCard
          label="Following"
          value={profileUser.followingCount}
          icon="❤️"
        />
        <StatsCard
          label="Sports"
          value={profileUser.sports?.length || 0}
          icon="🏆"
        />
      </div>

      {/* Profile Tabs */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOwnProfile={isOwnProfile}
      />

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'posts' && (
          <PostGrid
            posts={posts}
            onPostUpdate={(postId, updates) => {
              setPosts(prev => prev.map(post => 
                post._id === postId ? { ...post, ...updates } : post
              ));
            }}
            onPostDelete={(postId) => {
              setPosts(prev => prev.filter(post => post._id !== postId));
            }}
          />
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">About</h3>
            
            {/* Bio */}
            {profileUser.bio && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700">{profileUser.bio}</p>
              </div>
            )}

            {/* Professional Info */}
            {profileUser.headline && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Professional</h4>
                <p className="text-gray-700">{profileUser.headline}</p>
                {profileUser.currentPosition && (
                  <p className="text-gray-600">{profileUser.currentPosition}</p>
                )}
              </div>
            )}

            {/* Sports */}
            {profileUser.sports && profileUser.sports.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Sports & Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {profileUser.sports.map((sport, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {sport.name} • {sport.skillLevel}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {profileUser.skills && profileUser.skills.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profileUser.education && profileUser.education.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                <div className="space-y-3">
                  {profileUser.education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium text-gray-900">{edu.school}</p>
                      <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startYear} - {edu.endYear || 'Present'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileUser.followers?.slice(0, 9).map(follower => (
                <div key={follower._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <img
                    src={follower.profilePicture || '/default-avatar.png'}
                    alt={follower.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{follower.name}</p>
                    <p className="text-sm text-gray-500 truncate">@{follower.username}</p>
                  </div>
                </div>
              ))}
            </div>
            {(!profileUser.followers || profileUser.followers.length === 0) && (
              <p className="text-gray-500 text-center py-8">
                No connections yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
