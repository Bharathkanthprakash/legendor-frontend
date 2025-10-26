import React from 'react';

const Trends = () => {
  const trends = [
    { id: 1, topic: '#Legendor', tweets: '12.5K' },
    { id: 2, topic: '#SocialMedia', tweets: '8.2K' },
    { id: 3, topic: '#Community', tweets: '5.7K' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Trending Now</h3>
      <div className="space-y-3">
        {trends.map(trend => (
          <div key={trend.id} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
            <p className="font-medium text-sm text-gray-900">{trend.topic}</p>
            <p className="text-gray-500 text-xs">{trend.tweets} posts</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trends;
