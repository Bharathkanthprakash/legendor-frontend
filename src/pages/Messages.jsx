import { useState, useEffect, useRef } from 'react';
import { messagesAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';
import MessageInput from '../components/messages/MessageInput';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { socket, onlineUsers } = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && selectedConversation) {
      // Join conversation room
      socket.emit('joinConversation', selectedConversation._id);

      // Listen for new messages
      socket.on('newMessage', (message) => {
        if (message.conversation === selectedConversation._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.emit('leaveConversation', selectedConversation._id);
        socket.off('newMessage');
      };
    }
  }, [socket, selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await messagesAPI.getMessages(conversationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (content, mediaFiles = []) => {
    if (!content.trim() && mediaFiles.length === 0) return;

    setSending(true);
    try {
      const messageData = {
        conversation: selectedConversation._id,
        content: content.trim(),
        media: mediaFiles
      };

      if (socket) {
        socket.emit('sendMessage', messageData);
      } else {
        // Fallback to API
        const response = await messagesAPI.sendMessage(messageData);
        setMessages(prev => [...prev, response.data]);
      }

      // Clear input handled by parent
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewConversation = (user) => {
    const existingConversation = conversations.find(conv => 
      conv.participants.some(p => p._id === user._id)
    );

    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      // Create new conversation
      const newConversation = {
        _id: `temp-${Date.now()}`,
        participants: [user],
        isNew: true
      };
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white rounded-lg shadow-lg">
      {/* Conversation List */}
      <div className="w-1/3 border-r border-gray-200">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onNewConversation={startNewConversation}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              onlineUsers={onlineUsers}
            />
            <MessageInput
              onSendMessage={sendMessage}
              disabled={sending}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
