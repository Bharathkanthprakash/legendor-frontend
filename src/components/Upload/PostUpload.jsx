import { useState } from "react";

const PostUpload = ({ onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !mediaFile) {
      alert("Please add a caption or media to post");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("caption", caption);
      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const response = await fetch("https://legendor.in/api/posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        const newPost = await response.json();
        setCaption("");
        setMediaFile(null);
        setPreviewUrl("");
        if (onPostCreated) onPostCreated(newPost);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Create Post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's happening in sports? Share your moment..."
          className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          rows="3"
        />
        
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50">
            <span className="text-2xl">📷</span>
            <span className="font-medium">Add Photo/Video</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          
          <button
            type="submit"
            disabled={loading || (!caption.trim() && !mediaFile)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium text-lg"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

        {previewUrl && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 font-medium">Preview:</p>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 rounded-lg mx-auto border border-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                setMediaFile(null);
                setPreviewUrl("");
              }}
              className="text-red-600 text-sm mt-3 hover:text-red-700 font-medium"
            >
              ✕ Remove Media
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PostUpload;