import { useState, useEffect, useRef } from 'react';
import { storiesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const StoryViewer = ({ stories, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const intervalRef = useRef();

  const currentStory = stories.stories[currentStoryIndex];
  const duration = currentStory?.media.duration || 5; // seconds

  useEffect(() => {
    // Mark story as viewed
    if (currentStory && !currentStory.viewers?.includes(user.id)) {
      storiesAPI.viewStory(currentStory._id);
    }

    // Start progress bar
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          nextStory();
          return 0;
        }
        return prev + (100 / (duration * 10)); // Update every 100ms
      });
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [currentStoryIndex, duration]);

  const nextStory = () => {
    if (currentStoryIndex < stories.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    
    if (clickX < rect.width / 2) {
      previousStory();
    } else {
      nextStory();
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
        {stories.stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full">
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{
                width: index === currentStoryIndex ? `${progress}%` : 
                       index < currentStoryIndex ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl z-10"
      >
        ✕
      </button>

      {/* User Info */}
      <div className="absolute top-16 left-4 flex items-center space-x-3 z-10">
        <img
          src={stories.user.profilePicture || '/default-avatar.png'}
          alt={stories.user.name}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="text-white font-semibold">{stories.user.name}</p>
          <p className="text-gray-300 text-sm">
            {new Date(currentStory.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Story Content */}
      <div
        className="w-full h-full flex items-center justify-center cursor-pointer"
        onClick={handleClick}
      >
        {currentStory.media.mediaType === 'image' ? (
          <img
            src={currentStory.media.url}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <video
            src={currentStory.media.url}
            controls
            autoPlay
            className="max-w-full max-h-full"
          />
        )}
      </div>

      {/* Caption */}
      {currentStory.caption && (
        <div className="absolute bottom-20 left-0 right-0 text-center z-10">
          <p className="text-white text-lg bg-black bg-opacity-50 inline-block px-4 py-2 rounded-full">
            {currentStory.caption}
          </p>
        </div>
      )}

      {/* Reply Input */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Send message..."
            className="flex-1 bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-full px-4 py-2 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50"
          />
          <button className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center">
            ❤️
          </button>
          <button className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
