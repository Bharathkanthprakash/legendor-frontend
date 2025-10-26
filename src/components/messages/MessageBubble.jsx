import { useState } from 'react';

const MessageBubble = ({ message, isOwn }) => {
  const [showTime, setShowTime] = useState(false);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isOwn 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-gray-200 text-gray-900 rounded-bl-none'
      }`}>
        
        {/* Media */}
        {message.media && message.media.length > 0 && (
          <div className="mb-2 space-y-2">
            {message.media.map((media, index) => (
              <div key={index}>
                {media.mediaType === 'image' ? (
                  <img
                    src={media.url}
                    alt="Shared media"
                    className="rounded-lg max-w-full max-h-64 object-cover"
                  />
                ) : media.mediaType === 'video' ? (
                  <video
                    controls
                    className="rounded-lg max-w-full max-h-64"
                  >
                    <source src={media.url} type="video/mp4" />
                  </video>
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border">
                    <div className="text-2xl">📎</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {media.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(media.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* GIF */}
        {message.gif && (
          <img
            src={message.gif.url}
            alt="GIF"
            className="rounded-lg mb-2 max-w-full"
          />
        )}

        {/* Text Content */}
        {message.content && (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}

        {/* Time */}
        <div className={`text-xs mt-1 ${
          isOwn ? 'text-blue-100' : 'text-gray-500'
        } ${showTime ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          {formatTime(message.createdAt)}
          {message.isEdited && ' (edited)'}
        </div>

        {/* Read Receipts */}
        {isOwn && message.readBy && message.readBy.length > 0 && (
          <div className="flex justify-end mt-1">
            <div className="text-xs text-blue-100">
              Read by {message.readBy.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
