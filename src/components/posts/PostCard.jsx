import { useState } from "react";
import LikeButton from "./engagement/LikeButton";
import CommentSection from "./engagement/CommentSection";
import ShareButton from "./engagement/ShareButton";

const PostCard = ({ post }) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Function to get correct media URL
  const getMediaUrl = (url) => {
    if (!url) return null;
    
    // If it's already a full URL, return as is
    if (url.startsWith('http')) return url;
    
    // If it's a relative path, construct full URL
    if (url.startsWith('/uploads')) {
      return `https://legendor.in${url}`;
    }
    
    // If it's just a filename, construct URL
    return `https://legendor.in/uploads/${url}`;
  };

  const mediaUrl = getMediaUrl(post.mediaUrl);
  const shouldTruncate = post.caption && post.caption.length > 150;
  const displayCaption = shouldTruncate && !showFullCaption 
    ? post.caption.substring(0, 150) + "..."
    : post.caption;

  // Determine media type
  const getMediaType = () => {
    if (post.mediaType) return post.mediaType;
    if (mediaUrl?.endsWith('.mp4') || mediaUrl?.endsWith('.mov') || mediaUrl?.includes('/video/')) {
      return 'video';
    }
    return 'image';
  };

  const mediaType = getMediaType();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      {/* Post Header - User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <img 
          src={post.user?.profilePicture || "/default-avatar.png"} 
          alt={post.user?.name || "User"}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">
            {post.user?.name || "Anonymous User"}
          </h3>
          <p className="text-sm text-gray-500">
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : "Recently"}
          </p>
        </div>
      </div>

      {/* Post Caption */}
      {post.caption && post.caption.trim() && (
        <div className="mb-4">
          <p className="text-gray-800 text-lg whitespace-pre-line leading-relaxed">
            {displayCaption}
          </p>
          {shouldTruncate && (
            <button 
              onClick={() => setShowFullCaption(!showFullCaption)}
              className="text-blue-500 text-sm mt-2 hover:underline font-medium"
            >
              {showFullCaption ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {/* Post Media */}
      {mediaUrl && !mediaError && (
        <div className="mb-4 rounded-xl overflow-hidden border border-gray-200">
          {mediaType === 'video' && !videoError ? (
            <div className="relative">
              <video 
                controls 
                className="w-full max-h-96 object-contain bg-gray-100"
                onError={() => setVideoError(true)}
                preload="metadata"
              >
                <source src={mediaUrl} type="video/mp4" />
                <source src={mediaUrl} type="video/webm" />
                <source src={mediaUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <img 
              src={mediaUrl} 
              alt="Post content" 
              className="w-full max-h-96 object-contain bg-gray-100 cursor-pointer"
              loading="lazy"
              onError={() => setMediaError(true)}
              onClick={() => window.open(mediaUrl, '_blank')}
            />
          )}
        </div>
      )}

      {/* Media Error Message - Only show if there should be media but failed to load */}
      {(mediaError || videoError) && post.mediaUrl && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <div className="text-red-500 text-2xl mb-2">📷</div>
          <p className="text-red-600 font-medium">Media failed to load</p>
          <button 
            onClick={() => {
              setMediaError(false);
              setVideoError(false);
            }}
            className="text-red-500 text-sm mt-1 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex justify-between text-sm text-gray-600 mb-4 px-2">
        <span className="font-medium">{post.likesCount || 0} likes</span>
        <span className="font-medium">{post.commentsCount || 0} comments</span>
        <span className="font-medium">{post.sharesCount || 0} shares</span>
      </div>
      
      {/* Engagement Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <LikeButton postId={post._id} initialLikes={post.likesCount || 0} />
        <CommentSection postId={post._id} />
        <ShareButton post={post} />
      </div>

      {/* Shared Post Indicator */}
      {post.isShare && post.originalPost && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">
            🔄 Shared post
          </p>
        </div>
      )}
    </div>
  );
};

export default PostCard;
