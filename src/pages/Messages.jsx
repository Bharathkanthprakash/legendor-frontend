import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';
import { messagesAPI } from '../services/api';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      // Mock data for development
      setConversations([
        {
          _id: '1',
          participants: [
            { _id: '2', username: 'john_doe', avatar: '' },
            { _id: user?.id, username: user?.username, avatar: '' }
          ],
          lastMessage: {
            text: 'Hey, how are you doing?',
            sender: '2',
            createdAt: new Date().toISOString()
          },
          unreadCount: 0
        },
        {
          _id: '2',
          participants: [
            { _id: '3', username: 'sarah_smith', avatar: '' },
            { _id: user?.id, username: user?.username, avatar: '' }
          ],
          lastMessage: {
            text: 'See you at the game!',
            sender: user?.id,
            createdAt: new Date().toISOString()
          },
          unreadCount: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    try {
      const response = await messagesAPI.getMessages(conversation._id);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Mock messages
      setMessages([
        {
          _id: '1',
          text: 'Hey there!',
          sender: { _id: '2', username: 'john_doe' },
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          text: 'Hello! How are you?',
          sender: { _id: user?.id, username: user?.username },
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleSendMessage = async (text) => {
    if (!selectedConversation || !text.trim()) return;

    const newMessage = {
      _id: Date.now().toString(),
      text,
      sender: { _id: user?.id, username: user?.username },
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      await messagesAPI.sendMessage({
        conversationId: selectedConversation._id,
        text
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-md flex">
      {/* Conversation List */}
      <div className="w-1/3 border-r border-gray-200">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
