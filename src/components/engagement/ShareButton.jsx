import { useState } from "react";

const ShareButton = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!caption.trim()) {
      alert("Please add a caption for your share");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://legendor.in/api/shares", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          originalPost: post._id,
          caption: caption
        })
      });
      
      if (response.ok) {
        setIsOpen(false);
        setCaption("");
        alert("Post shared successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to share post");
      }
    } catch (error) {
      console.error("Share error:", error);
      alert("Failed to share post");
    } finally {
      setLoading(false);
    }
  };

  const copyPostLink = () => {
    const postLink = `https://legendor.in/posts/${post._id}`;
    navigator.clipboard.writeText(postLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareToSocialMedia = (platform) => {
    const postLink = `https://legendor.in/posts/${post._id}`;
    const text = `Check out this post on Legendor: ${post.caption?.substring(0, 100)}...`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + postLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postLink)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <span className="text-lg">🔄</span>
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Share Post</h3>
            
            {/* Original Post Preview */}
            <div className="mb-4 p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2 mb-2">
                <img 
                  src={post.user?.profilePicture || "/default-avatar.png"} 
                  alt={post.user?.name}
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-sm font-medium">{post.user?.name}</p>
              </div>
              <p className="text-sm text-gray-700">
                {post.caption || "No caption"}
              </p>
              {post.mediaUrl && (
                <img 
                  src={post.mediaUrl} 
                  alt="Post media" 
                  className="mt-2 rounded max-h-32 object-cover w-full"
                />
              )}
            </div>
            
            {/* Share on Legendor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share on Legendor with your caption:
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            {/* Quick Share Options */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick Share:</p>
              <div className="flex space-x-2">
                <button 
                  onClick={copyPostLink}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                >
                  <span>📋</span>
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
                <button 
                  onClick={() => shareToSocialMedia('whatsapp')}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border rounded-lg hover:bg-green-50 text-sm"
                >
                  <span>💚</span>
                  <span>WhatsApp</span>
                </button>
              </div>
              <div className="flex space-x-2 mt-2">
                <button 
                  onClick={() => shareToSocialMedia('twitter')}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border rounded-lg hover:bg-blue-50 text-sm"
                >
                  <span>🐦</span>
                  <span>Twitter</span>
                </button>
                <button 
                  onClick={() => shareToSocialMedia('facebook')}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border rounded-lg hover:bg-blue-50 text-sm"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setCaption("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleShare}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? "Sharing..." : "Share on Legendor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;