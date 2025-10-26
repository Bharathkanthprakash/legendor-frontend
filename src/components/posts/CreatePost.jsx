import { useState, useRef } from 'react';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [sport, setSport] = useState('');
  const [activityType, setActivityType] = useState('casual');
  const [visibility, setVisibility] = useState('public');
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const { user } = useAuth();

  const sportsOptions = [
    'Football', 'Basketball', 'Tennis', 'Cricket', 'Swimming',
    'Athletics', 'Gym', 'Yoga', 'Cycling', 'Running',
    'Martial Arts', 'Boxing', 'Golf', 'Baseball', 'Rugby'
  ];

  const feelings = ['😊 Happy', '😎 Cool', '🤩 Excited', '💪 Strong', '🏆 Proud', '🔥 Lit'];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    setMediaFiles(prev => [...prev, ...validFiles]);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && mediaFiles.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('sport', sport);
      formData.append('activityType', activityType);
      formData.append('visibility', visibility);
      
      if (feeling) formData.append('feeling', feeling);
      if (location) formData.append('location', JSON.stringify({ name: location }));
      if (tags.length > 0) formData.append('tags', JSON.stringify(tags));

      mediaFiles.forEach(file => {
        formData.append('media', file);
      });

      const response = await postsAPI.createPost(formData);
      onPostCreated(response.data.post);
      
      // Reset form
      setCaption('');
      setMediaFiles([]);
      setSport('');
      setFeeling('');
      setLocation('');
      setTags([]);
      setIsOpen(false);
      
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      setTags(prev => [...prev, e.target.value.trim()]);
      e.target.value = '';
    }
  };

  const removeTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* Create Post Trigger */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profilePicture || '/default-avatar.png'}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="flex-1 text-left text-gray-500 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors"
          >
            What's happening in sports, {user?.name}?
          </button>
        </div>
        
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
          {[
            { icon: '📷', label: 'Photo/Video', onClick: () => fileInputRef.current?.click() },
            { icon: '😊', label: 'Feeling', onClick: () => setIsOpen(true) },
            { icon: '📍', label: 'Location', onClick: () => setIsOpen(true) },
            { icon: '🏷️', label: 'Tag', onClick: () => setIsOpen(true) }
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Create Post</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={user?.profilePicture || '/default-avatar.png'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="text-sm text-gray-500 border-none bg-transparent focus:outline-none"
                    >
                      <option value="public">🌍 Public</option>
                      <option value="friends">👥 Friends</option>
                      <option value="private">🔒 Private</option>
                    </select>
                  </div>
                </div>

                {/* Caption */}
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's happening in sports?"
                  className="w-full border-none resize-none focus:outline-none text-lg placeholder-gray-400 min-h-[100px]"
                  rows="3"
                />

                {/* Media Preview */}
                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Add tags (press Enter)"
                    onKeyPress={addTag}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />

                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Sport</option>
                    {sportsOptions.map(sport => (
                      <option key={sport} value={sport}>{sport}</option>
                    ))}
                  </select>

                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="casual">Casual Activity</option>
                    <option value="training">Training</option>
                    <option value="competition">Competition</option>
                    <option value="achievement">Achievement</option>
                    <option value="news">Sports News</option>
                  </select>

                  <select
                    value={feeling}
                    onChange={(e) => setFeeling(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">How are you feeling?</option>
                    {feelings.map(feeling => (
                      <option key={feeling} value={feeling}>{feeling}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Add location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      📷
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      😊
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      📍
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || (!caption.trim() && mediaFiles.length === 0)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
};

export default CreatePost;
