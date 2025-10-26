import React from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { postId } = useParams();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Details</h1>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold mb-2">Post #{postId}</h3>
          <p className="text-gray-600">
            Detailed view of the post will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
