import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🛡️' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 border-r border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.username}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        rows="4"
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Privacy Settings</h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">Privacy settings will be available soon.</p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Notification Settings</h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">Notification preferences coming soon.</p>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Security Settings</h3>
                  <div className="space-y-4">
                    <button
                      onClick={logout}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
