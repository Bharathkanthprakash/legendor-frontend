import React from 'react';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation }) => {
  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find(p => p._id !== localStorage.getItem('userId')) || 
           conversation.participants?.[0] || 
           { username: 'Unknown User' };
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map(conversation => {
          const otherUser = getOtherParticipant(conversation);
          const isSelected = selectedConversation?._id === conversation._id;

          return (
            <div
              key={conversation._id}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {otherUser.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {otherUser.username}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.text}
                    </p>
                  )}

                  {conversation.unreadCount > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-blue-600 font-semibold">
                        {conversation.unreadCount} new message{conversation.unreadCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {conversations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>No conversations yet</p>
            <p className="text-sm">Start a conversation with someone!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
