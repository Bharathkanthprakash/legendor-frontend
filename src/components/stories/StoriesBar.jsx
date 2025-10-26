import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const StoriesBar = ({ stories }) => {
  const { user } = useAuth();
  const [showViewer, setShowViewer] = useState(false);
  const [selectedStories, setSelectedStories] = useState(null);

  const openStories = (userStories) => {
    setSelectedStories(userStories);
    setShowViewer(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {/* Create Story */}
          <div className="flex-shrink-0 w-20 text-center">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-1">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">+</span>
                </div>
              </div>
            </div>
            <p className="text-xs font-medium truncate">Your Story</p>
          </div>

          {/* Other Stories */}
          {stories.map((userStories) => (
            <div
              key={userStories.user._id}
              className="flex-shrink-0 w-20 text-center cursor-pointer"
              onClick={() => openStories(userStories)}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full p-0.5 mx-auto mb-1">
                  <img
                    src={userStories.user.profilePicture || '/default-avatar.png'}
                    alt={userStories.user.name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                </div>
                {userStories.stories.some(story => !story.viewers?.includes(user.id)) && (
                  <div className="absolute top-0 right-3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <p className="text-xs font-medium truncate">
                {userStories.user.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      {showViewer && selectedStories && (
        <StoryViewer
          stories={selectedStories}
          onClose={() => setShowViewer(false)}
        />
      )}
    </>
  );
};

export default StoriesBar;
