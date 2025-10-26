import React from 'react';

const SuggestedUsers = () => {
  const suggestedUsers = [
    { id: 1, username: 'alex_johnson', mutualFriends: 3 },
    { id: 2, username: 'sarah_m', mutualFriends: 5 },
    { id: 3, username: 'mike_chen', mutualFriends: 2 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Suggested for You</h3>
      <div className="space-y-3">
        {suggestedUsers.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm">{user.username}</p>
                <p className="text-gray-500 text-xs">{user.mutualFriends} mutual friends</p>
              </div>
            </div>
            <button className="text-blue-500 text-sm font-semibold hover:text-blue-600">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
