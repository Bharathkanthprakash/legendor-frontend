import { useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ conversation, messages, onlineUsers }) => {
  const { user } = useAuth();
  const messagesContainerRef = useRef(null);

  const otherUser = conversation.participants?.find(p => p._id !== user.id);
  const isOnline = onlineUsers.includes(otherUser?._id);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={otherUser?.profilePicture || '/default-avatar.png'}
              alt={otherUser?.name}
              className="w-10 h-10 rounded-full"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser?.name}</h3>
            <p className="text-sm text-gray-500">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">💬</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.sender._id === user.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
