import React from 'react';

const ProfileHeader = ({ user, isOwnProfile, isFollowing, onFollow }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {isOwnProfile && (
          <button className="absolute top-4 right-4 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg backdrop-blur-sm hover:bg-opacity-30 transition-all">
            Edit Cover
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            {/* User Info */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600 max-w-md">{user.bio}</p>
              
              {/* Stats */}
              <div className="flex space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{user.posts || 0}</div>
                  <div className="text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{user.followers || 0}</div>
                  <div className="text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{user.following || 0}</div>
                  <div className="text-gray-500">Following</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-4 md:mt-0">
            {isOwnProfile ? (
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                Edit Profile
              </button>
            ) : (
              <>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  Message
                </button>
                <button
                  onClick={onFollow}
                  className={`px-6 py-2 rounded-lg font-semibold border transition-colors ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      : 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileHeader;
