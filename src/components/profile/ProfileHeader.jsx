import { useState, useRef } from 'react';
import { profilesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ProfileHeader = ({ user, isOwnProfile, onFollow, onProfileUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio || '',
    headline: user.headline || '',
    location: user.location || '',
    website: user.website || ''
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const coverInputRef = useRef();
  const { user: currentUser } = useAuth();

  const handleSave = async () => {
    try {
      const response = await profilesAPI.updateProfile(editData);
      onProfileUpdate(response.data.user);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(type === 'profile' ? 'profilePicture' : 'coverPhoto', file);

      const response = await profilesAPI.uploadProfilePicture(formData);
      
      if (type === 'profile') {
        onProfileUpdate({ profilePicture: response.data.profilePicture });
      } else {
        onProfileUpdate({ coverPhoto: response.data.coverPhoto });
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        {user.coverPhoto && (
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        
        {isOwnProfile && (
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
          >
            📷
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={user.profilePicture || '/default-avatar.png'}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover"
              />
              {isOwnProfile && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  📷
                </button>
              )}
            </div>

            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold bg-gray-100 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editData.headline}
                    onChange={(e) => setEditData(prev => ({ ...prev, headline: e.target.value }))}
                    placeholder="Headline"
                    className="text-gray-600 bg-gray-100 rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Bio"
                    rows="2"
                    className="text-gray-700 bg-gray-100 rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  {user.headline && (
                    <p className="text-lg text-gray-600 mt-1">{user.headline}</p>
                  )}
                  {user.bio && (
                    <p className="text-gray-700 mt-2 max-w-2xl">{user.bio}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    {user.location && (
                      <span>📍 {user.location}</span>
                    )}
                    {user.website && (
                      <a href={user.website} className="text-blue-500 hover:underline">
                        🌐 {user.website.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 md:mt-0 flex space-x-3">
            {isOwnProfile ? (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={onFollow}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    user.isFollowing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0], 'profile')}
        className="hidden"
      />
      <input
        type="file"
        ref={coverInputRef}
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0], 'cover')}
        className="hidden"
      />

      {/* Uploading Overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Uploading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
